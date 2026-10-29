# Serasi

A career-fit demo for Malay youths aged 18–25 in Singapore. Youths take a five-part quiz (about 15 minutes), see their top jobs with reasons, the shortest path to each with costs and subsidies, and a world map of where each industry is growing, and get job searches, career coaches and a job-taster sign-up. A separate page for MENDAKI staff shows how shared results would be tabulated and used to plan events.

Public site: https://havochadi.github.io/serasi/, which lets visitors choose between the youth app (https://havochadi.github.io/serasi/youth.html) and the MENDAKI staff page (https://havochadi.github.io/serasi/mendaki.html). The world map has its own link: https://havochadi.github.io/serasi/youth.html#world.

## Files

- `index.html`: the landing page. GitHub Pages serves it as the home page, with one link to each of the two pages below. The old `index.html#dashboard` link redirects to the staff page.
- `youth.html`: the youth app.
- `mendaki.html`: the MENDAKI staff page, a separate page with its own layout.
- `serasi-core.js`: what the two pages share: the 93 jobs, questions and scoring, and the store for shared results.
- `serasi-pathways.js`: the youth app's study routes, fees, subsidies, overseas options, contacts and world-map notes, each with its source.
- `Serasi overview.pdf`: detailed proposal and limitations.
- `Serasi pitch deck.pdf`: presentation.
- `.github/workflows/pages.yml`: publishes the pages, the two scripts and the two PDFs whenever `main` changes.
- `worker/`: the Cloudflare Worker that connects Ask Serasi to Google Gemini. See **Set up the AI bot**.

Open `index.html`, `youth.html` or `mendaki.html` in a browser to preview them. There is no build step. Opened this way, Ask Serasi answers on the device; see **Set up the AI bot** to run it with AI. The world map's globe loads d3, topojson and the world-atlas country shapes from cdnjs and jsDelivr when it opens; without them, its lists still show every place.

## What the demo does

- **Discovery interface:** five primary navigation choices, including the world map, an interactive explorer of the six interest types, and a short onboarding form with optional age and area. Community tools and privacy information sit under “More from Serasi”. Results are organised into Matches, About you, Ask Serasi, and Next steps. All four sections remain visible on small screens.
- **Explore and save careers:** search matches by name or sector, filter by sector, and bookmark roles. Saved careers include stretch roles and remain available after retaking the quiz. Personal bookmarks stay on this device; example bookmarks last only for the session.
- **Scoring:** 93 hand-coded jobs, each scored 0–100 with fixed weights: 50% interests, 30% work style, 20% values.
  - Interests combine Brown and Gore's (1994) C index for the three-letter codes (60%) with how closely the youth's six interest scores correlate with the job's profile (40%).
  - Work style counts only shortfalls below what a job needs, after a small allowance.
  - Values give full marks when a job offers two of the youth's chosen values.
  - The list shows the top 10, with 10 more on request. Jobs needing two qualification steps (such as ITE to a degree) or a big skill jump go to stretch roles.
  - Scores are locked once the quiz is finished. **Retake quiz** clears the answers and starts from blank; saved careers stay.
- **Shortest path:** each role has a tab with the quickest route from the youth's current stage (ITE, polytechnic, university or working). It includes:
  - a price breakdown using fees for Singapore Citizens, with an optional household-income band to estimate MENDAKI's TTFS (AY2026/27 tiers), government bursaries (AY2026) and the ITE Progression Award. The band stays on the device and is never shared or sent to the AI.
  - sponsorships with their bonds (hospital nursing sponsorships, MOH Holdings allied health, NCSS, ECDA, MOE teacher training, uniformed services)
  - overseas options (Australia, the UK, Germany, Japan, Malaysia, Egypt) with costs, and what to watch out for
  - hotlines and websites for more research
- **World map:** a drag-to-turn globe and lists showing where 17 industries are growing, steady or shrinking, by country and by city, with a source for each note. For example, construction is shrinking in China while tech is growing in Shenzhen, Hangzhou, Beijing and Shanghai. Each role's "Where in the world" tab shows its industry, and Next steps links to the map.
- **Quiz and results:** interests and work-style questions appear six at a time with labelled answers, an unanswered-question shortcut, and Save & exit on every step. Example answers are tucked into a separate demo option. Answers, the current quiz page, and results are saved in the browser, so a youth can close the page and continue where they left off. **Delete my data** removes them.
- **Ask Serasi:** an AI career guide powered by Google Gemini. It answers questions about careers and jobs only, using a summary of the youth's results, and turns down anything else. It can:
  - explain why a job is a match, or what any job involves
  - suggest which skills to build, and courses on SkillsFuture
  - help with finding openings, resumes and interviews
  - answer questions about faith at work, such as prayer time or the tudung
  - point to career coaches at NTUC e2i and M³+

  Questions go through a small Cloudflare Worker (`worker/`), which holds the Gemini key and keeps the bot to careers. With each question, the page sends the youth's scores, values, skill ratings, pathway and job list, plus the shortest path, costs and world notes for their top three jobs, kept under the Worker's 16,000-character limit. It never sends their name, age, area, income band or personal preferences. On Gemini's free tier, Google may use what is sent to improve its products.

  If the AI can't be reached, the page answers on the device instead, in English or Malay. That covers:
  - any of the 93 jobs, comparisons, routes and costs, subsidies, scholarships and bonds, and 2025 graduate pay medians
  - studying or working overseas, and where an industry is growing
  - the youth's results, interviews, CVs, internships, NS, switching careers and faith at work

  It remembers the last job and place it discussed, so follow-ups like "how much will it cost?" or "what about Japan?" work.
- **Sharing and job tasters (demo):** ticking the sharing box, or tapping **I'm interested**, adds the youth's anonymised record to a mock database in their browser. The youth app writes only that one record, never the quiz answers. Nothing is sent anywhere.
- **MENDAKI staff page (`mendaki.html`):** a separate page for planners, with a header band and a filter toolbar that stays in view. It runs on a mock database of 240 made-up youths, plus the record shared from this browser, which appears or disappears straight away if the youth app is open in another tab. It shows:
  - filters by age, qualification and area; groups under 10 youths are hidden
  - headline counts and bar charts of interest types, top jobs, values and skills to build
  - a cross-tab of interest types by age, qualification or area
  - job-taster ideas and a planning note written from the counts, with **Copy note** and **Download counts (CSV)**
  - a preview of the records behind the numbers, showing exactly what each shared result contains

## Keeping the data current

Fees, subsidies, pay figures and world-market notes were checked in October 2026, and each links to its source in the app. They live in `serasi-pathways.js`. Review them each academic year: TTFS tiers, bursary amounts and overseas fees change often, and overseas costs use rough exchange rates (`FX`).

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

4. Copy the Worker's address from the deploy output, add `/ask`, and set `ASK_WORKER` in `youth.html` to it.
5. If the site moves to a new address, add it to `ALLOWED_ORIGINS` in `worker/wrangler.toml` and deploy again.

To try it on your computer:

1. Put `GEMINI_API_KEY=your-key` in `worker/.dev.vars`. Git ignores this file.
2. Run `npx wrangler@4 dev` in `worker/`.
3. In another terminal, serve the site from the repo folder with `python3 -m http.server 8000`.
4. Open http://localhost:8000. On localhost, the page uses the local Worker.

Run the Worker's tests with `cd worker && node --test`.

## For a real pilot

A real pilot would need hosting with a database for the shared results, a staff sign-in for the MENDAKI page, and consent wording and a retention period reviewed under the PDPA. Ask Serasi would need a paid Gemini tier, so youths' questions aren't used to improve Google's products. In the pilot, staff would see only grouped counts, never individual records. Partners, funding, job tasters and internships are proposals. Scores and the hand-coded role data still need validation. See the PDFs for the full plan.
