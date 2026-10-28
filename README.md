# Serasi

A career-fit demo for Malay youths aged 18–25 in Singapore. Youths take a five-part quiz (about 15 minutes), see their top jobs with reasons, the shortest path to each job with costs and subsidies, and a world map of where each industry is growing. A MENDAKI dashboard shows how shared results would be tabulated and used to plan events.

Public site: https://havochadi.github.io/serasi/ (dashboard: https://havochadi.github.io/serasi/#dashboard, world map: https://havochadi.github.io/serasi/#world)

## Files

- `index.html`: the whole app in one file. GitHub Pages serves it as the home page.
- `Serasi overview.pdf`: detailed proposal and limitations.
- `Serasi pitch deck.pdf`: presentation.
- `.github/workflows/pages.yml`: publishes `index.html` and the two PDFs whenever `main` changes.

Open `index.html` in a browser to preview it. There is no build step and no server. The world map's globe loads d3, topojson and the world-atlas country shapes from cdnjs and jsDelivr when the map opens; without them, the map's lists still show every place.

## What the demo does

- **Quiz and results:** answers and results are saved in the browser, so a youth can close the page and come back. **Delete my data** removes them.
- **Scoring:** 93 hand-coded jobs, each scored 0–100 with fixed weights: 50% interests, 30% work style, 20% values.
  - Interests combine Brown and Gore's (1994) C index for the three-letter codes (60%) with how closely the youth's six interest scores correlate with the job's profile (40%).
  - Work style counts only shortfalls below what a job needs, after a small allowance.
  - Values give full marks when a job offers two of the youth's chosen values.
  - The list shows the top 10, with 10 more on request. Jobs needing two qualification steps (such as ITE to a degree) or a big skill jump go to "stretch".
  - Scores are locked once the quiz is finished. **Retake quiz** clears the answers and starts from blank.
- **Shortest path:** each job has a tab with the quickest route from the youth's current stage (ITE, polytechnic, university or working). It includes:
  - a price breakdown using fees for Singapore Citizens, with an optional household-income band to estimate MENDAKI's TTFS (AY2026/27 tiers), government bursaries (AY2026) and the ITE Progression Award
  - sponsorships with their bonds (hospital nursing sponsorships, MOH Holdings allied health, NCSS, ECDA, MOE teacher training, uniformed services)
  - overseas options (Australia, the UK, Germany, Japan, Malaysia, Egypt) with costs, and what to watch out for
  - hotlines and websites for more research
- **World map:** a drag-to-turn globe and lists showing where 17 industries are growing, steady or shrinking, by country and by city, with a source for each note. For example, construction is shrinking in China while tech is growing in Shenzhen, Hangzhou, Beijing and Shanghai. Each job's "Where in the world" tab shows its industry.
- **Ask Serasi:** answers a wide range of career questions in English or Malay, from the data in the app. It does not use AI, and nothing typed leaves the device. It covers:
  - any job: what it involves, why it fits, comparisons, pay (2025 Graduate Employment Survey medians)
  - routes and costs, subsidies, scholarships and bonds
  - studying or working overseas, and where an industry is growing
  - the youth's code, work style, values, skills, stretch roles and how scores work
  - interviews, CVs, internships, NS, ITE and poly-or-JC choices, switching careers, starting a business, faith at work, and who to call (including national mindline 1771 and SOS 1767 for wellbeing)

  It remembers the last job and place it discussed, so follow-ups like "how much will it cost?" or "what about Japan?" work.
- **Sharing and job tasters (demo):** ticking the sharing box, or tapping **I'm interested**, adds the youth's anonymised record to a mock database in their browser. Nothing is sent anywhere. The household-income band is never shared.
- **MENDAKI dashboard:** runs on a mock database of 240 made-up youths, plus the visitor's own record if they shared. It shows:
  - filters by age, qualification and area; groups under 10 youths are hidden
  - headline counts and bar charts of interest types, top jobs, values and skills to build
  - a cross-tab of interest types by age, qualification or area
  - job-taster ideas and a planning note written from the counts, with **Copy note** and **Download counts (CSV)**
  - a preview of the records behind the numbers, showing exactly what each shared result contains

## Keeping the data current

Fees, subsidies, pay figures and world-market notes were checked in October 2026, and each links to its source in the app. They live in the `FEES`, `INCOME`, `HELP`, `ABROAD`, `TRACKS`, `PAY`, `WORLD` and `SOURCES` objects in `index.html`. Review them each academic year: TTFS tiers, bursary amounts and overseas fees change often, and overseas costs use rough exchange rates (`FX`).

## For a real pilot

A real pilot would need hosting with a database for the shared results, a staff sign-in for the dashboard, and consent wording and a retention period reviewed under the PDPA. In the pilot, staff would see only grouped counts, never individual records. Partners, funding, job tasters and internships are proposals. Scores and the hand-coded role data still need validation. See the PDFs for the full plan.
