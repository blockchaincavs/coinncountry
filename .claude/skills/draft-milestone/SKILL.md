---
name: draft-milestone
description: Draft the next milestone plan in plans/active/ from plans/ROADMAP.md, doc/REQUIREMENTS.md and ARCHITECTURE.md. Use when the user asks to plan, draft or start the next milestone. Does not execute it.
---

# Draft the next milestone

1. `git fetch origin main` and make sure your branch is up to date, so the plans you read are current.
2. Read `plans/ROADMAP.md` and pick the first unticked milestone. Read the parts of
   `doc/REQUIREMENTS.md` and `ARCHITECTURE.md` it touches, and the last archived plan for style.
3. If anything is ambiguous (a library, a data shape, a price, a scope cut), ask the user with a
   question prompt before writing. Do not guess and do not leave "TODO for the user" sections.
4. Write `plans/active/M<n>-<slug>.md` from `plans/TEMPLATE-milestone.md`:
   goal, files/modules to add, rules, **edge cases up front** (each will need a test),
   the manual check (`npm run -s demo:<name>` or a page in the running app), and out-of-scope items.
5. Keep it short and concrete. Record decisions the user made in the file.
6. Commit on the feature branch and push. Ask the user to approve the plan.
7. Once approved, tell the user to **start a new session** and say "execute the active milestone".
   Never execute a plan in the session that drafted it (fresh context = fewer tokens, fewer mix-ups).
