# Serasi

A career-fit demo for Malay youths aged 18–25 in Singapore. Youths take a five-part quiz (about 15 minutes), see their top 10 jobs with reasons, and get job searches, career coaches and a job-taster sign-up. A MENDAKI dashboard shows how shared results would be tabulated and used to plan events.

Public site: https://havochadi.github.io/serasi/ (dashboard: https://havochadi.github.io/serasi/#dashboard)

## Files

- `index.html`: the whole app in one file. GitHub Pages serves it as the home page.
- `Serasi overview.pdf`: detailed proposal and limitations.
- `Serasi pitch deck.pdf`: presentation.
- `.github/workflows/pages.yml`: publishes `index.html` and the two PDFs whenever `main` changes.
- `worker/`: the Cloudflare Worker that connects Ask Serasi to Google Gemini. See **Set up the AI bot**.

Open `index.html` in a browser to preview it. There is no build step. Opened this way, Ask Serasi answers with fixed rules; see **Set up the AI bot** to run it with AI.

## What the demo does

- **Quiz and results:** answers and results are saved in the browser, so a youth can close the page and come back. **Delete my data** removes them.
- **Ask Serasi:** answers simple questions with fixed rules, using the youth's scores and the job data in the app. It does not use AI, and nothing typed leaves the device. It can answer:
  - why a job is a match, or what a job involves (name any of the 43 jobs)
  - what the interest code means
  - which skill to build first
  - how the youth likes to work, and what their values point to
  - what their stretch roles need
  - how to find openings, where pay information is, and who to talk to

  Any other question gets the list of questions it can answer.
- **Sharing and job tasters (demo):** ticking the sharing box, or tapping **I'm interested**, adds the youth's anonymised record to a mock database in their browser. Nothing is sent anywhere.
- **MENDAKI dashboard:** runs on a mock database of 240 made-up youths, plus the visitor's own record if they shared. It shows:
  - filters by age, qualification and area; groups under 10 youths are hidden
  - headline counts and bar charts of interest types, top jobs, values and skills to build
  - a cross-tab of interest types by age, qualification or area
  - job-taster ideas and a planning note written from the counts, with **Copy note** and **Download counts (CSV)**
  - a preview of the records behind the numbers, showing exactly what each shared result contains

## Set up the AI bot

Ask Serasi's AI runs through a Cloudflare Worker, so the Gemini key never appears in the page. Both services are free.

1. Create a Gemini API key at https://aistudio.google.com (**Get API key**, then **Create API key**). Don't turn on billing for its project.
2. Install Node.js 20 or later.
3. Sign in to Cloudflare, deploy the Worker, then give it the key:

   ```
   cd worker
   npx wrangler@4 login
   npx wrangler@4 deploy
   npx wrangler@4 secret put GEMINI_API_KEY
   ```

4. Copy the Worker's address from the deploy output, add `/ask`, and set `ASK_WORKER` in `index.html` to it.
5. If the site moves to a new address, add it to `ALLOWED_ORIGINS` in `worker/wrangler.toml` and deploy again.

To try it on your computer:

1. Put `GEMINI_API_KEY=your-key` in `worker/.dev.vars`. Git ignores this file.
2. Run `npx wrangler@4 dev` in `worker/`.
3. In another terminal, serve the site from the repo folder with `python3 -m http.server 8000`.
4. Open http://localhost:8000. On localhost, the page uses the local Worker.

Run the Worker's tests with `cd worker && node --test`.

## For a real pilot

A real pilot would need hosting with a database for the shared results, a staff sign-in for the dashboard, and consent wording and a retention period reviewed under the PDPA. In the pilot, staff would see only grouped counts, never individual records. Partners, funding, job tasters and internships are proposals. Scores and the hand-coded role data still need validation. See the PDFs for the full plan.
