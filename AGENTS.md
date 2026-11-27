# Standing Rules: CoinNCountry website

<!-- Keep this file short: it is loaded into every Claude Code session (via CLAUDE.md -> @AGENTS.md).
     Put detail in ARCHITECTURE.md / plans and link to it. -->

## Environment & Commands

- Run the site: `npm run dev` (http://localhost:4321). Production-style: `npm run build && npm start`.
- Tests: `npm run tests` (quiet, coverage summary only). Also `npm run typecheck` (astro check), `npm run lint`.
- Story files: `npm run check-stories` after any change in `content/stories/`.
- Run scripts quietly (`npm run -s ...`).
- Work happens on a feature branch and reaches `main` through a pull request the user reviews. Never push to `main`.
- Tests go in `tests/`, mirroring `src/` (never next to the source).
- In a Claude Code cloud session, Node's `fetch` needs
  `NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt`.
- Requirements: `doc/REQUIREMENTS.md`. Roadmap: `plans/ROADMAP.md`.

## The user

- A beginner. Keep the README's "Run it on your computer" steps as simple as they are now: install
  Node once, `npm install`, `npm run dev`. Developer tooling belongs in the README's developer section.
- Ask one question at a time, with a recommendation. Don't add scope they didn't ask for.

## Architecture & Workflow

- Refer to `ARCHITECTURE.md` for module boundaries and file placement.
- Execute only the active milestone in `plans/active/` when instructed, then stop.
- Ask the user directly for approvals, choices and edits. Record decisions in the milestone file.
- Milestone flow: draft the plan in `plans/active/` (skill: `draft-milestone`) → user approves →
  new session executes it → close out with `finish-milestone`.
- Keep `src/core/` pure: no network, file I/O, `process`, clock or randomness (enforced by ESLint).
  Time (`now`) is passed in as an argument.
- I/O lives in `src/adapters/`, behind the `ContentSource` interface. Pages get data only through
  `src/site-data.ts`. Appwrite will be a second `ContentSource`; don't call Appwrite from pages.
- Stories and images are content, not code. Today they live in `content/` and `public/media/`; they
  move to Appwrite (DocumentsDB and Storage) later. Don't create anything in Appwrite until the user says so.
- Every fact in a story is fact-checked with a cited source. Lines that guess at motives start with "maybe".
- Secrets live only in `.env` (gitignored) and server environment variables.
- Update `doc/diagrams/*.drawio` when module boundaries or data flow change.

## Definition of Done (every milestone)

1. The milestone file lists edge cases up front; each one has a test.
2. `npm run tests`, `npm run typecheck`, `npm run lint` all pass. Coverage thresholds
   (100% `src/core/`, 90% elsewhere) are enforced by `jest.config.cjs`. Never lower them to pass.
3. Move the milestone file from `plans/active/` to `plans/archive/`, tick it in `plans/ROADMAP.md`.
4. The milestone has a manual check: a page in the running app or an `npm run -s` script.
5. Update `doc/diagrams/architecture.drawio` for any new module, service or data flow.
6. Add any new lesson to "Mistakes to Avoid". Commit on the feature branch, push, open or update the PR.

- A Stop hook (`.claude/hooks/run-tests.sh`) runs the tests after each turn; full log in `logs/tests.log`.

## Token-Saving & Output Rules

- **NEVER** print raw JSON, full CSV rows, or >30 lines of logs to stdout. Write logs to `logs/`
  and read only the relevant part (`tail`, `grep`).

## Mistakes to Avoid

<!-- One line per lesson. Add to this list at the end of every milestone. -->

- After changing ignore rules, run `git rm --cached <file>` for files already tracked.
- Never point tests or scripts at a production project or database.
- Time-zone code must not depend on the host TZ. Use IANA zones (DST-aware), never fixed UTC offsets.
- `package.json` is `"type": "module"`, so CommonJS config files need the `.cjs` extension (`jest.config.cjs`).
- An `<img>` with `width`/`height` attributes needs `height: auto` in CSS, or `aspect-ratio` is ignored.
- Astro reads `.env` only for `import.meta.env`; `astro.config.mjs` loads it itself with `process.loadEnvFile()`.
