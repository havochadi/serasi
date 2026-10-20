// Runs Serasi on Node 22.13 or later with a local SQLite file: the app and its PDFs, plus the API under /api/.
// Start it with `npm start`. Settings come from environment variables or a .env file (see .env.example).
import http from 'node:http';
import { mkdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { createApp } from './app.js';
import { PUBLIC_FILES, contentType, withSecurityHeaders } from './site.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BODY_LIMIT = 64 * 1024;

// Wraps node:sqlite in the same calling style as Cloudflare D1, so server/app.js runs unchanged on both.
export function openDatabase(file) {
  if (file !== ':memory:') mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec('PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;');
  const statement = (sql, args) => ({
    bind: (...values) => statement(sql, values),
    run: async () => { db.prepare(sql).run(...args); },
    all: async () => ({ results: db.prepare(sql).all(...args) }),
    first: async () => db.prepare(sql).get(...args) ?? null
  });
  return { prepare: sql => statement(sql, []), close: () => db.close() };
}

export function createServer({ env = process.env, db }) {
  const app = createApp({ db, env });
  const trustProxy = env.TRUST_PROXY === '1' || env.TRUST_PROXY === 'true';
  const firstValue = v => String(v || '').split(',')[0].trim();

  return http.createServer(async (req, res) => {
    try {
      const proto = (trustProxy && firstValue(req.headers['x-forwarded-proto'])) || (req.socket.encrypted ? 'https' : 'http');
      const url = new URL(req.url, proto + '://' + (req.headers.host || 'localhost'));
      if (!url.pathname.startsWith('/api/')) return await send(res, await serveStatic(url, req.method));

      let body;
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        body = await readBody(req);
        if (body === null) return await send(res, new Response('{"error":"too_large"}', { status: 413, headers: { 'Content-Type': 'application/json' } }));
      }
      const headers = new Headers();
      for (const [k, v] of Object.entries(req.headers)) if (v !== undefined) headers.set(k, Array.isArray(v) ? v.join(', ') : v);
      const ip = (trustProxy && firstValue(req.headers['x-forwarded-for'])) || req.socket.remoteAddress || '';
      await send(res, await app.handle(new Request(url, { method: req.method, headers, body }), { ip }));
    } catch (e) {
      console.error('Request failed:', e);
      if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Server error');
    }
  });
}

async function serveStatic(url, method) {
  if (method !== 'GET' && method !== 'HEAD') return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  let name;
  try { name = decodeURIComponent(url.pathname.slice(1)) || 'index.html'; } catch { name = ''; }
  const notFound = () => withSecurityHeaders(new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }));
  if (!PUBLIC_FILES.includes(name)) return notFound();
  let data;
  try { data = await readFile(path.join(ROOT, name)); } catch (e) { if (e.code === 'ENOENT') return notFound(); throw e; }
  return withSecurityHeaders(new Response(method === 'HEAD' ? null : data, {
    headers: { 'Content-Type': contentType(name), 'Cache-Control': name.endsWith('.html') ? 'no-cache' : 'public, max-age=3600' }
  }));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', c => {
      size += c.length;
      if (size > BODY_LIMIT) { resolve(null); req.resume(); return; }
      chunks.push(c);
    });
    req.on('end', () => { if (size <= BODY_LIMIT) resolve(Buffer.concat(chunks)); });
    req.on('error', reject);
  });
}

// Streams a web Response to Node, so Ask Serasi answers arrive as they are written.
async function send(res, response) {
  const headers = {};
  response.headers.forEach((v, k) => { if (k !== 'set-cookie') headers[k] = v; });
  const cookies = response.headers.getSetCookie();
  if (cookies.length) headers['set-cookie'] = cookies;
  res.writeHead(response.status, headers);
  if (!response.body) return res.end();
  const reader = response.body.getReader();
  res.on('close', () => { if (!res.writableFinished) reader.cancel().catch(() => {}); });
  for (;;) {
    const { value, done } = await reader.read();
    if (done || res.destroyed) break;
    res.write(value);
  }
  res.end();
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const env = process.env;
  const db = openDatabase(env.DATABASE_PATH || path.join(ROOT, 'data', 'serasi.db'));
  const port = Number(env.PORT) || 8787;
  const host = env.HOST || '127.0.0.1';
  const server = createServer({ env, db });
  server.listen(port, host, () => {
    console.log('Serasi is running at http://' + (host === '0.0.0.0' ? 'localhost' : host) + ':' + port);
    console.log('  Sharing with MENDAKI: on');
    console.log('  Ask Serasi and AI summary: ' + (env.ANTHROPIC_API_KEY ? 'on (' + (env.CLAUDE_MODEL || 'claude-opus-5-5') + ')' : 'off (set ANTHROPIC_API_KEY)'));
    console.log('  Staff dashboard: ' + ((env.ADMIN_PASSWORD || '').length >= 12 ? 'on' : 'off (set ADMIN_PASSWORD, at least 12 characters)'));
  });
  const stop = () => server.close(() => { db.close(); process.exit(0); });
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}
