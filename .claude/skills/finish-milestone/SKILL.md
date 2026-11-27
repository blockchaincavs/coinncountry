---
name: finish-milestone
description: Run the Definition of Done checklist from AGENTS.md for the active milestone and close it out. Use when the work in plans/active/ is complete, or the user asks to finish or wrap up a milestone.
---

# Finish the active milestone

Go through each step; stop and fix anything that fails. Do not lower coverage thresholds.

1. Every edge case listed in the milestone file has a test (name the test for each one).
2. `npm run -s tests`, `npm run -s typecheck`, `npm run -s lint` all pass. Read only the tail of
   `logs/` output, never dump full logs.
3. The manual check named in the milestone file runs and prints a short, sensible summary.
4. `doc/diagrams/architecture.drawio` and `ARCHITECTURE.md` reflect any new module or data flow.
5. Any lesson learned (a wrong assumption, a surprising API value, a tooling trap) is added to
   "Mistakes to Avoid" in `AGENTS.md` as one line.
6. Move the file from `plans/active/` to `plans/archive/` and tick it in `plans/ROADMAP.md`.
7. Commit on the feature branch with a message starting `M<n>:`, push, open or update the pull
   request, give the user a short summary and the manual-check command, then stop.
