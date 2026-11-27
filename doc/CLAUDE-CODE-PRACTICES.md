# Claude Code practices (and why)

Lessons from building a real app milestone by milestone with Claude Code.

## 1. One source of standing rules: `CLAUDE.md` → `@AGENTS.md`

`CLAUDE.md` contains only `@AGENTS.md`, which imports it. Other coding agents read `AGENTS.md`
directly, so there's one file to maintain. Keep it short: it is in context on every turn. Put
details in `ARCHITECTURE.md` and milestone files, and point to them.

## 2. Plan in one session, execute in another

Drafting a plan pulls a lot into context (requirements, exploration, back-and-forth). Executing in a
**fresh session** that reads only the approved plan is cheaper and avoids acting on discarded ideas.
The plan file is the hand-off, so it must stand on its own: goal, files, rules, edge cases, manual check.

## 3. Edge cases first, then tests for each

Listing edge cases in the plan before writing code makes the definition of done checkable, and
gives the reviewer (you) one place to spot what's missing.

## 4. Tests run automatically after every turn (Stop hook)

`.claude/hooks/run-tests.sh` runs the suite when Claude says it's done. Passing is silent; failing
prints the last 30 lines and exits 2, so Claude keeps working. The `stop_hook_active` check
prevents loops. It skips when `node_modules` is missing so a fresh clone isn't blocked.

## 5. Let tools enforce the architecture

Rules in prose get forgotten; lint errors don't. ESLint bans I/O, `process`, `Date.now()` and
`Math.random()` in `src/core/`, and coverage thresholds in `jest.config.js` (100% core, 90% elsewhere)
fail the run. The instruction "never lower thresholds to pass" closes the obvious escape hatch.

## 6. Deterministic core: pass `now` and `rng` in

Anything time- or chance-based becomes trivially testable (lock times, DST boundaries, tiebreaks).
Run calendar tests under a different `TZ` to catch host-timezone leaks.

## 7. Save tokens on output

Quiet scripts (`-s`, `--silent`, `text-summary` coverage), logs written to `logs/` and read with
`tail`/`grep`, never dumping JSON. Recorded fixtures in `data/` let demos and tests run offline and
stop repeat API calls.

## 8. Permissions: allow the routine, deny the secrets

`.claude/settings.json` pre-allows test/lint/typecheck/git-read commands (fewer prompts) and denies
reading `.env`. Personal additions go in `.claude/settings.local.json` (gitignored).

## 9. Ask, don't leave to-do lists

Claude asks the user directly for choices and approvals, then records the decision in the plan.
Plans never carry a "needs from you" section, which goes stale.

## 10. A living "Mistakes to Avoid" list

Every surprise (stale branch, wrong enum, `.env` committed, wrong environment hit) becomes one line in
`AGENTS.md`, so no later session repeats it.

## 11. A manual check for every milestone

Each milestone ships a `npm run -s demo:<name>` (or a page in the app) so you can see it work yourself
in under a minute, not just trust green tests.

## 12. Dev vs Prod, always

Separate projects/databases; scripts refuse to run unless `APP_ENV=dev`. Cloud sessions use
proxy-injected keys (set the env var to a dummy like `proxy-injected`).

## 13. Diagrams stay current

`doc/diagrams/architecture.drawio` is updated whenever a module or data flow is added, as part of
the Definition of Done.
