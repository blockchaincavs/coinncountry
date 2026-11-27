# Architecture

The CoinNCountry website: fact-checked American and economic history stories for readers who found
the channel on YouTube or X. Pages render on the server on every request (Astro SSR: Netlify adapter on Netlify, Node adapter on your computer),
so Google sees full pages and new stories appear without a rebuild.

Diagram: [`doc/diagrams/architecture.drawio`](doc/diagrams/architecture.drawio) (open in draw.io).

## Layout

| Path               | Purpose                                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| `src/core/`        | Pure logic: story ordering, topics, timeline, SEO data, sitemap, story validation. 100% tested. |
| `src/adapters/`    | Where content comes from. `ContentSource` interface; `json-files.ts` today, Appwrite later.     |
| `src/site-data.ts` | Picks the content source and applies the core rules. The only data entry point for pages.       |
| `src/pages/`       | Astro routes: home, story, all stories, topic, about, 404, sitemap.xml, robots.txt.             |
| `src/components/`  | Reusable UI: story card, timeline, Then vs now, follow buttons, ad slot, video player.          |
| `src/layouts/`     | Page shell with SEO tags and header/footer.                                                     |
| `content/`         | Story JSON files and `site.json` (brand settings). Moves to Appwrite DocumentsDB later.         |
| `public/media/`    | Story images. Moves to Appwrite Storage later.                                                  |
| `scripts/`         | `check-stories.ts` (run with `npm run check-stories`).                                          |
| `tests/`           | Jest tests, mirroring `src/`.                                                                   |
| `doc/`, `plans/`   | Requirements, diagram, roadmap and milestone plans.                                             |
| `.claude/`         | Shared Claude Code settings, the Stop hook that runs tests, project skills.                     |

## Key design rules

- **Ports and adapters.** Pages depend on `site-data.ts`, which depends on the `ContentSource`
  interface. Swapping JSON for Appwrite is one new adapter and one changed line.
- **Deterministic core.** No clock reads in `src/core/`; the masthead date gets `new Date()` from the layout.
- **One ad component.** Every ad slot goes through `src/components/AdSlot.astro`.
- **Secrets** exist only in server environment variables and the local `.env`.
