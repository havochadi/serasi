// Ask Serasi's Worker: takes a question from the Serasi page, asks Gemini, and keeps the answer to careers and jobs.
import { OFF_TOPIC_TEXT, DISTRESS_TEXT } from './prompt.js';
import { buildGeminiRequest, callGemini, UpstreamError } from './gemini.js';

const MAX_BODY = 32000;
const MAX_QUESTION = 300;
const MAX_TURNS = 6;
const MAX_TURN_TEXT = 1200;
const MAX_PROFILE = 16000;
const MAX_REPLY = 1200;

function corsHeaders(origin) {
  return origin ? { 'Access-Control-Allow-Origin': origin, 'Vary': 'Origin' } : { 'Vary': 'Origin' };
}

function json(status, body, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: Object.assign({ 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, corsHeaders(origin))
  });
}

function allowedOrigins(env) {
  return String(env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
}

// Returns { question, history, profile } from the raw body, or null if anything breaks a limit.
export function readAsk(raw) {
  if (raw.length > MAX_BODY) return null;
  let b;
  try { b = JSON.parse(raw); } catch (e) { return null; }
  if (!b || typeof b !== 'object') return null;
  const question = typeof b.question === 'string' ? b.question.trim() : '';
  if (!question || question.length > MAX_QUESTION) return null;
  const history = b.history === undefined ? [] : b.history;
  const turnOk = m => m && (m.role === 'user' || m.role === 'bot') && typeof m.text === 'string' && m.text.length <= MAX_TURN_TEXT;
  if (!Array.isArray(history) || !history.every(turnOk)) return null;
  const profile = b.profile;
  if (!profile || typeof profile !== 'object' || Array.isArray(profile) || JSON.stringify(profile).length > MAX_PROFILE) return null;
  return { question, history: history.slice(-MAX_TURNS).map(m => ({ role: m.role, text: m.text })), profile };
}

export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname !== '/ask') return json(404, { error: 'not_found' });
    const origin = request.headers.get('Origin') || '';
    if (!allowedOrigins(env).includes(origin)) return json(403, { error: 'forbidden' });
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: Object.assign({ 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400' }, corsHeaders(origin))
      });
    }
    if (request.method !== 'POST') return json(405, { error: 'method_not_allowed' }, origin);

    if (env.RATE_LIMITER) {
      const { success } = await env.RATE_LIMITER.limit({ key: request.headers.get('CF-Connecting-IP') || 'unknown' });
      if (!success) return json(429, { error: 'rate_limited' }, origin);
    }
    const ask = readAsk(await request.text());
    if (!ask) return json(400, { error: 'bad_request' }, origin);
    if (!env.GEMINI_API_KEY) return json(500, { error: 'not_configured' }, origin);

    try {
      const out = await callGemini(buildGeminiRequest(ask), { apiKey: env.GEMINI_API_KEY, model: env.GEMINI_MODEL });
      if (out.topic === 'off_topic') return json(200, { reply: OFF_TOPIC_TEXT, topic: 'off_topic' }, origin);
      if (out.topic === 'distress') return json(200, { reply: DISTRESS_TEXT, topic: 'distress' }, origin);
      const reply = out.reply.trim().slice(0, MAX_REPLY);
      if (!reply) return json(502, { error: 'upstream' }, origin);
      return json(200, { reply, topic: 'career' }, origin);
    } catch (e) {
      // Log only the status, never the question, so youths' messages stay out of Cloudflare's logs.
      const status = e instanceof UpstreamError ? e.status : 502;
      console.log('Gemini call failed:', status);
      return status === 429 ? json(429, { error: 'rate_limited' }, origin) : json(502, { error: 'upstream' }, origin);
    }
  }
};
