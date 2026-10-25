# Serasi

A career-fit demo for Malay youths aged 18–25 in Singapore. Youths take a five-part quiz (about 15 minutes), see their top 10 jobs with reasons, and get job searches, career coaches and a job-taster sign-up. A separate page for MENDAKI staff shows how shared results would be tabulated and used to plan events.

Public site: https://havochadi.github.io/serasi/, which lets visitors choose between the youth app (https://havochadi.github.io/serasi/youth.html) and the MENDAKI staff page (https://havochadi.github.io/serasi/mendaki.html).

## Files

- `index.html`: the landing page. GitHub Pages serves it as the home page, with one link to each of the two pages below. The old `index.html#dashboard` link redirects to the staff page.
- `youth.html`: the youth app.
- `mendaki.html`: the MENDAKI staff page, a separate page with its own layout.
- `serasi-core.js`: what the two pages share: the jobs, questions and scoring, and the store for shared results.
- `Serasi overview.pdf`: detailed proposal and limitations.
- `Serasi pitch deck.pdf`: presentation.
- `.github/workflows/pages.yml`: publishes the pages, `serasi-core.js` and the two PDFs whenever `main` changes.
- `worker/`: the Cloudflare Worker that connects Ask Serasi to Google Gemini. See **Set up the AI bot**.

Open `index.html`, `youth.html` or `mendaki.html` in a browser to preview them. There is no build step. Opened this way, Ask Serasi answers with fixed rules; see **Set up the AI bot** to run it with AI.

## What the demo does

- **Discovery interface:** four primary navigation choices, an interactive explorer of the six interest types, and a short onboarding form with optional age and area. Community tools and privacy information sit under “More from Serasi”. Results are organised into Matches, About you, Ask Serasi, and Next steps. All four sections remain visible on small screens.
- **Explore and save careers:** search matches by name or sector, filter by sector, and bookmark roles. Saved careers include stretch roles and remain available after retaking the quiz. Personal bookmarks stay on this device; example bookmarks last only for the session.
- **Quiz and results:** interests and work-style questions appear six at a time with labelled answers, an unanswered-question shortcut, and Save & exit on every step. Example answers are tucked into a separate demo option. Answers, the current quiz page, and results are saved in the browser, so a youth can close the page and continue where they left off. **Delete my data** removes them.
- **Ask Serasi:** an AI career guide powered by Google Gemini. It answers questions about careers and jobs only, using a summary of the youth's results, and turns down anything else. It can:
  - explain why a job is a match, or what any job involves
  - suggest which skills to build, and courses on SkillsFuture
  - help with finding openings, resumes and interviews
  - answer questions about faith at work, such as prayer time or the tudung
  - point to career coaches at NTUC e2i and M³+

  Questions go through a small Cloudflare Worker (`worker/`), which holds the Gemini key and keeps the bot to careers. With each question, the page sends the youth's scores, values, skill ratings, pathway and job list. It never sends their name, age, area or personal preferences. On Gemini's free tier, Google may use what is sent to improve its products. If the AI can't be reached, the page answers with fixed rules on the device instead.
- **Sharing and job tasters (demo):** ticking the sharing box, or tapping **I'm interested**, adds the youth's anonymised record to a mock database in their browser. The youth app writes only that one record, never the quiz answers. Nothing is sent anywhere.
- **MENDAKI staff page (`mendaki.html`):** a separate page for planners, with a header band and a filter toolbar that stays in view. It runs on a mock database of 240 made-up youths, plus the record shared from this browser, which appears or disappears straight away if the youth app is open in another tab. It shows:
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
