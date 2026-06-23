# Plan Self-Review Round 1: completeness + sequencing

Plan reviewed: `.designs/consonant-counter/design-doc.md` (post PRD-alignment)
Method: 2 independent reviews (completeness, sequencing), dispatched via
Claude Code's native Agent tool (same workaround as PRD-alignment rounds,
see gt-k46).

## Completeness report — summary

Confirmed N/A (no finding): build/CI/env-vars/feature-flags infra, data
migrations/schema, automated test tasks (consistent with Q9), task
granularity.

- **Must-fix:** none.
- **Should-fix (5):**
  1. README.md never targeted for an update, despite being the repo's only
     existing doc and currently content-free.
  2. GitHub Pages enablement (old step 5) underspecified: manual action, no
     stated verification step, no fallback if Pages is unavailable.
  3. `countConsonants` never states it can assume a string argument, inviting
     unneeded defensive type-checking.
  4. Implicit dependency: Pages enablement needs files committed/pushed to
     `main` first — not stated.
  5. No step tells the builder how to confirm the finished page actually
     matches the PRD's user stories/clarifications before calling it done.

## Sequencing report — summary

No circular dependencies; the critical path (DOM structure → styling/behavior
wired against it → verify) was already about as short as possible for a
project this size.

- **Must-fix:** none.
- **Should-fix (3):**
  1. Old step 4 ("no build tooling...") isn't an executable task — it's a
     standing scope constraint, not a sequenced step.
  2. Old step 5 bundled two actions with different dependency profiles
     (enable Pages = no dependency on 1-3; verify locally = depends on 1-3).
  3. Step 3's dependency on step 1 (DOM structure/selectors) was real but only
     implicit in prose, not flagged as a cross-step dependency.

## Fixes applied to `.designs/consonant-counter/design-doc.md`

Restructured the "Implementation plan" section in one pass, addressing all 8
should-fix items together:

- Moved the old step 4 scope constraint into an unnumbered preamble line
  above the numbered steps (sequencing #1).
- Step 1 now explicitly notes it fixes the structure step 3 depends on
  (sequencing #3); step 3 now explicitly references that dependency too.
- Step 3 now states the function can assume a string argument, no defensive
  type-checking needed (completeness #3).
- New step 4: commit/push to `main` + update README.md with a one-line
  description (completeness #1), explicitly stated as a precondition for
  step 5 (completeness #4).
- Step 5 (Pages) now states it's a manual repo-settings action, independent
  of 1-4 in principle but practically needing step 4's push, with the
  local-file fallback restated (completeness #2, sequencing #2).
- New step 6: manual verification checklist tied to PRD user stories/
  clarifications — known input/output check including Y/W, clear-to-`0`
  check, 320px/on-screen-keyboard check, `aria-live` check — explicitly
  framed as a checklist, not the automated suite Q9 already excludes
  (completeness #5, sequencing #2 split).

All must-fix and should-fix items from both reports have been applied. No
items deferred.
