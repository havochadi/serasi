// Runs Serasi on Cloudflare Workers, with results in a D1 database. Configured by wrangler.toml; see README.md.
import { createApp } from './app.js';
import { withSecurityHeaders } from './site.js';

let app = null;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      app ??= createApp({ db: env.DB, env });
      return app.handle(request, { ip: request.headers.get('CF-Connecting-IP') || '' });
    }
    return withSecurityHeaders(await env.ASSETS.fetch(request));
  }
};
