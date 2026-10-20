// The public files the server hands out, and the headers added to them. Shared by server/node.js,
// server/worker.js and server/build-site.mjs so every host serves the same set.
export const PUBLIC_FILES = ['index.html', 'Serasi app.html', 'Serasi overview.pdf', 'Serasi pitch deck.pdf'];

const TYPES = { '.html': 'text/html; charset=utf-8', '.pdf': 'application/pdf' };
export const contentType = name => TYPES[name.slice(name.lastIndexOf('.'))] || 'application/octet-stream';

// The app is one HTML file with inline script and styles, plus Google Fonts.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  'font-src https://fonts.gstatic.com',
  "img-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "form-action 'self'"
].join('; ');

export function withSecurityHeaders(response) {
  const r = new Response(response.body, response);
  r.headers.set('X-Content-Type-Options', 'nosniff');
  r.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  r.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if ((r.headers.get('Content-Type') || '').startsWith('text/html')) {
    r.headers.set('Content-Security-Policy', CSP);
    r.headers.set('X-Frame-Options', 'DENY');
  }
  return r;
}
