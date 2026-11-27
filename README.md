# CoinNCountry website

The CoinNCountry story site: a newspaper-style homepage, one page per story, a timeline, YouTube and X links, and SEO built in.

Every story is one JSON file in `content/stories/`. Add a file and the homepage card, timeline entry, topic page, sitemap and the story's own page appear on the next refresh. No code changes needed.

## Run it on your computer

You only do steps 1 and 2 once.

1. **Install Node.js.** Go to [nodejs.org](https://nodejs.org), download the version marked **LTS** (version 22 or newer), and install it like any app.
2. **Download the code and its tools.** Open the Terminal app (Mac) or PowerShell (Windows) and run these lines one at a time:

   ```
   git clone https://github.com/blockchaincavs/coinncountry.git
   cd coinncountry
   npm install
   ```

3. **Start the site:**

   ```
   npm run dev
   ```

   Open **http://localhost:4321** in your browser. Leave the Terminal window open while you use the site. To stop it, click the Terminal window and press `Ctrl + C`.

Next time, you only need to `cd coinncountry` and `npm run dev`.

## Add or edit a story

1. Copy `content/stories/_template.json` and rename the copy to your story's address, for example `panic-of-1907.json`. The file name must match the `"slug"` inside it.
2. Fill in the fields. Text goes between quotes. Set `"status"` to `"published"` when it's ready (`"draft"` keeps it hidden).
3. Put the images in `public/media/<slug>/` (for example `public/media/panic-of-1907/cover.jpg`). A 1600×900 cover works best.
4. Check your work:

   ```
   npm run check-stories
   ```

   It points out a missing comma, a missing image, a title that's too long for Google, and similar problems.

5. Refresh the browser. The story is live on the homepage.

What the main fields do:

| Field                     | What it's for                                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `slug`                    | The page address: `/stories/<slug>`. Lowercase letters, numbers and dashes.                                     |
| `featured`                | `true` puts the story in the big "Today's story" spot.                                                          |
| `title`, `dek`, `summary` | Headline, the italic line under it, and the homepage card text.                                                 |
| `seoTitle`, `description` | What Google and link previews show.                                                                             |
| `topic`                   | The section (for example Presidents). A new topic gets its own page and menu link automatically.                |
| `links.youtubeVideoId`    | The ID at the end of a YouTube link (`youtube.com/watch?v=`**`THIS_PART`**). Adds the play button on the story. |
| `links.xPostUrl`          | The full link to the story's X post or thread.                                                                  |
| `shorts`                  | Short covers for the "Seen it on Shorts?" row.                                                                  |
| `timeline`                | Dates in the story. `"home": true` puts that date on the homepage timeline.                                     |
| `chapters`                | The story text. Each block is a paragraph (`p`), a big pull quote (`quote`), or a Then vs now box (`thenNow`).  |
| `yourTake`                | A line or two in your own words. Hidden until you fill it in (you'll see a reminder box while running locally). |
| `sources`                 | Every source used, shown at the bottom of the story.                                                            |

Brand settings (name, tagline, YouTube and X links, ad placeholders on/off) are in `content/site.json`.

## How the code is organized

| Folder                  | What's inside                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| `content/`              | The stories (JSON) and brand settings. Moves to Appwrite later.                                |
| `public/media/`         | Images. Moves to Appwrite Storage later.                                                       |
| `src/core/`             | The rules: story order, topics, timeline, SEO data, sitemap, story checks. Fully tested.       |
| `src/adapters/`         | Where stories come from. Today `json-files.ts`; an Appwrite version gets added later.          |
| `src/site-data.ts`      | The one place pages get their data from. Switching to Appwrite changes one line here.          |
| `src/components/`       | Reusable pieces: story card, timeline, Then vs now box, follow buttons, ad slot, video player. |
| `src/pages/`            | Homepage, story page, all stories, topic pages, About, sitemap.xml and robots.txt.             |
| `src/styles/global.css` | Colors, fonts and layout.                                                                      |

The site is built with [Astro](https://astro.build) and renders each page on the server when it's requested (SSR). That means Google gets the full page, and new stories show up without rebuilding, which is how it will work with Appwrite too.

## SEO built in

- Unique page titles, descriptions and share images (Open Graph and X cards) on every page.
- Structured data for Google: Article and BreadcrumbList on stories, Organization (with the YouTube and X links) and WebSite on the homepage.
- `/sitemap.xml` and `/robots.txt` are generated from the stories. robots.txt allows every crawler, including AI search and training bots.
- Key facts near the top of each story, dated fact checks and a numbered source list.

## Ads

`src/components/AdSlot.astro` is the one place ads live. For now each slot is a dashed placeholder box. Turn them off with `"showAdPlaceholders": false` in `content/site.json`. When AdSense is approved, its code goes into that one file.

## Run the finished version (like the real server will)

```
npm run build
npm start
```

Then open http://localhost:4321. Before going online, set your real address: create a file named `.env` in the project folder containing one line, `SITE_URL=https://your-domain.com` (used for the sitemap and SEO links).

## Put it online (Netlify)

Netlify builds the site from the `main` branch on GitHub. The settings live in `netlify.toml`, so in Netlify you only connect the repository and add one environment variable, `SITE_URL` (your site's address, for example `https://coinncountry.netlify.app`). Every merge into `main` publishes a new version, including new or edited story files.

## For developers (you can skip this)

The project follows the [claude-scaffolding](https://github.com/blockchaincavs/claude-scaffolding) setup. None of it is needed to run the site.

```
npm run tests          # Jest tests with coverage (100% required for src/core/)
npm run typecheck      # TypeScript and Astro checks
npm run lint           # ESLint, including the "keep src/core pure" rules
npm run format         # Prettier
```

- `AGENTS.md` (loaded through `CLAUDE.md`) holds the standing rules for Claude Code. `ARCHITECTURE.md` explains where files go.
- `.claude/` has the shared Claude Code settings, a hook that runs the tests after every Claude turn, and the `draft-milestone` and `finish-milestone` skills.
- `plans/` holds the roadmap and milestone plans; `doc/` holds the requirements and the architecture diagram.
