# Serasi

A career-fit app for Malay youths aged 18–25 in Singapore. Youths take a five-part quiz (about 15 minutes), see their top 10 jobs with reasons, and get job searches, career coaches and job-taster sign-up. MENDAKI staff see grouped, anonymised results to plan events.

Public demo (device only): https://havochadi.github.io/serasi/

## Two ways it runs

| | Static copy (GitHub Pages) | With the Serasi server |
|---|---|---|
| Quiz, results, job links, coaches, example results, About and privacy | Yes | Yes |
| Results saved in the browser, "Delete my data" | Yes | Yes |
| Share anonymised results with MENDAKI (optional tick) | – | Yes |
| "I'm interested" job-taster and internship sign-up | – | Yes |
| MENDAKI insights dashboard (staff sign-in) | – | Yes |
| Ask Serasi and the dashboard's AI summary | – | Yes, with an Anthropic API key |

The app detects the server by itself. Without one it hides the server features and says results are saved on this device only.

## Files

- `Serasi app.html`: the app (one HTML file). `index.html` is an identical copy; keep them in sync.
- `server/app.js`: the API for sharing, staff sign-in, dashboard counts and the AI features.
- `server/node.js`: runs the app and API on Node with a local SQLite file.
- `server/worker.js` and `wrangler.toml`: run the same API on Cloudflare Workers with a D1 database.
- `server/app.test.mjs`: API tests (`npm test`). They use a stand-in for the Claude API, so they cost nothing.
- `.env.example`: the settings, with defaults.
- `Serasi overview.pdf` and `Serasi pitch deck.pdf`: proposal and presentation.

## Run it on your computer

Needs Node 22.13 or later.

```sh
npm install
cp .env.example .env     # then fill in ANTHROPIC_API_KEY and ADMIN_PASSWORD
npm start
```

Open http://localhost:8787. Staff sign in at http://localhost:8787/#staff, or with **MENDAKI staff sign-in** at the foot of any page. Results are saved in `data/serasi.db`.

## Put it online

### Option A: Cloudflare Workers (free tier, data stored in Asia-Pacific)

1. Sign in: `npx wrangler login`
2. Create the database: `npx wrangler d1 create serasi --location apac`, then paste the `database_id` it prints into `wrangler.toml`.
3. Add the secrets (each command asks for the value):
   `npx wrangler secret put ANTHROPIC_API_KEY`
   `npx wrangler secret put ADMIN_PASSWORD`
4. Deploy: `npx wrangler deploy`. It prints the address, such as `https://serasi.<your-account>.workers.dev`. Use that link in the poster QR codes.

The tables are created on first use. The free plan limits processing time per request. If Ask Serasi answers get cut off, the Workers Paid plan raises the limit.

### Option B: any Node host

Any host that runs Node 22.13+ and keeps files between restarts works, such as a small cloud server. Run `npm ci --omit=dev`, then `npm start`. Set `HOST=0.0.0.0`, `PORT`, and `DATABASE_PATH` on a persistent disk. Set `TRUST_PROXY=1` when the host sits behind a proxy or load balancer. Back up the database file.

Either way, serve the app over HTTPS. Cloudflare does this automatically.

## Settings

| Setting | What it does |
|---|---|
| `ANTHROPIC_API_KEY` | Turns on Ask Serasi and the AI summary. Without it, both are hidden. |
| `ADMIN_PASSWORD` | Staff dashboard password, at least 12 characters. Without it, the dashboard is off. |
| `CLAUDE_MODEL` | Default `claude-opus-5-5`. |
| `ASK_LIMIT_PER_IP` | Ask Serasi questions per IP address per 10 minutes (default 60). |
| `WRITE_LIMIT_PER_IP` | Shares, updates and deletions per IP address per 10 minutes (default 120). |
| `AI_DAILY_LIMIT` | AI requests per day across everyone (default 2000). Caps spending. |
| `MAX_RESULTS` | Shared results the database accepts (default 20000). |

At events, many youths share one Wi-Fi connection and so one IP address. Raise `ASK_LIMIT_PER_IP` and `WRITE_LIMIT_PER_IP` for events with more than about 50 youths at once.

## Data and privacy

- **On the youth's device:** quiz answers and results, until they use **Delete my data**.
- **On the server, only if the youth ticks the sharing box or taps "I'm interested":** age band, area, qualification, interest code, chosen values, skills rated 1 or 2, top 10 jobs, up to 2 stretch jobs, job-taster interest and the month they finished. Each record is keyed by a hash of a random code that only the youth's device holds. The server rejects any other field. Names, contact details, individual answers, personal preferences (such as prayer time or halal food), timestamps and IP addresses are never stored.
- **Deleting:** "Stop sharing" and "Delete my data" remove the shared record. If the server can't be reached, the app retries the next time the youth opens it on that device.
- **Staff access:** one shared password. Sessions last 8 hours, and sign-in allows 10 tries per 15 minutes. The server groups the results itself and never sends counts for groups of fewer than 10 youths.
- **Ask Serasi:** each question goes to Anthropic's Claude API with the youth's scores, choices (including personal preferences) and shortlist, but never a name. The answer rules are held on the server. Serasi doesn't store questions or answers; it logs only token counts for cost tracking. Refusal fallbacks are switched on (`fallbacks: "default"`), so a request the main model declines is retried on Anthropic's recommended model. Ask Serasi answers use low effort; the staff summary uses medium.

## Cost of the AI features

Claude Opus 5.5 costs US$4 per million input tokens and US$20 per million output tokens. A rough estimate is US$0.02–0.04 per Ask Serasi question, so a 300-youth pilot asking about 5 questions each would cost about US$30–60. Check real usage in the Claude Console. `AI_DAILY_LIMIT` puts a ceiling on daily spending.

## Before a real pilot

- Have the consent wording, the About and privacy page, and a retention period reviewed under the PDPA. Add a contact for data requests.
- Agree on Anthropic's commercial terms for the API account that runs Ask Serasi.
- Choose a strong staff password and share it only with the people who need the dashboard.
- Partners, funding, job tasters and internships are proposals. Scores and the hand-coded role data still need validation. See the PDFs for the full plan.

## Tests

`npm test` runs the API tests on Node.
