# CoinNCountry Website Requirements

Source of truth for the plan: the project's `website/website-plan.md` (Nov 27, 2026). Summary:

## General

- Astro (chosen Nov 27, 2026), TypeScript, server-side rendering so Google sees full pages.
- Runs locally with simple steps: install Node once, `npm install`, `npm run dev`.
- Tests for all logic (Jest), with coverage thresholds.

## Front end

- Design "Mix A and C": Broadsheet newspaper homepage and reading style, plus the Ledger timeline and
  "Then vs now" boxes. Brand palette: paper #efe4cc, ink #1f1a14, green #2f6b4f, dark green #173a2a,
  red #b3322a, gold #c99a1e. Fonts: Playfair Display 900 + Oswald.
- YouTube and X link buttons on the homepage and every story page.
- Ad slot placeholders until AdSense is approved (apply at 15 to 25 stories).

## Backend / data

- GitHub holds code only. Stories and images are content.
- Now: story metadata in local JSON files, one per story. Adding a story = adding one file.
- Later: Appwrite DocumentsDB (stories) and Storage (images), read live on each page load; Appwrite
  Sites hosting with deploys from GitHub. Nothing is created in Appwrite until the user says so.

## SEO

- Unique titles and descriptions, Open Graph/X cards, Article/BreadcrumbList/Organization/WebSite
  structured data, sitemap.xml, robots.txt allowing all bots (including AI bots).

## Domain rules

- Every fact is fact-checked and cited, except clearly marked guesses ("maybe...").
- Brand name is always "CoinNCountry".
- Finance and crypto stories say they aren't investment advice.

## Out of scope (for now)

- Appwrite, newsletter signup, animated scenes, domain and hosting, AdSense code.
