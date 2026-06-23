# Plan Self-Review Round 3: testability + coherence (final round)

Plan reviewed: `.designs/consonant-counter/design-doc.md` (post self-review round 2)
Method: 2 independent reviews (testability, coherence-final-pass), dispatched
via Claude Code's native Agent tool (same workaround as all prior rounds, see
gt-k46). Coherence reviewer was given all 5 prior round logs for full context,
as the final holistic pass.

## Testability report — summary

Steps 1-3 and step 6's overall format/structure were confirmed to already
have clear, verifiable criteria (no finding). Independent phase verification
was confirmed sound (step 3's logic is checkable in isolation before
commit/push; step 5 has no hard dependency on 1-3).

- **Must-fix (1):** step 6's checklist never checked the print view (Q7),
  despite the doc's own Summary calling printing "the one substantive change
  from default assumptions" and the source of "the only real security
  consideration" in the feature.
- **Should-fix (4):**
  1. No check that the `<label for>` association actually works (vs. just
     visually adjacent text).
  2. No check for the mobile font-size/no-zoom criterion specifically (only
     the 320px/no-scroll item was checked).
  3. README update (step 4) had no acceptance criterion — "wrote some
     sentence" and "left it unedited" were both arguably compliant.
  4. GitHub Pages enablement (step 5) had no verification distinct from
     "settings toggled" — no check that it actually serves the page.

## Coherence report — summary (final holistic pass)

Confirmed clean after re-checking across all 5 prior rounds: naming
consistency, print CSS/JS ownership split, the "two interactive regions"
claim, GitHub Pages hosting claims against actual repo state, the
`textarea`-content-isn't-HTML-parsed security claim, and no drift back into
Non-Goal territory. The worked verification example ("Yellow Wax" → 6) was
independently re-verified arithmetically. No must-fix found.

- **Should-fix (1):** the UX section's mockup ("Consonants: **0**") was never
  reconciled with the implementation plan's description of the result
  element. As written, step 1 (bare `0` in static markup) + step 3
  (`textContent` write to "the result element") could be read as one node,
  meaning the literal label text "Consonants: " would never render, or would
  be silently wiped on first update if placed inside the same live-region
  node. Step 6 only checked the count *value*, not this structural question,
  so nothing forced resolution before shipping.

## Fixes applied to `.designs/consonant-counter/design-doc.md`

1. **Result region content model** (coherence should-fix): UX section now
   specifies the structure explicitly — static "Consonants: " text as a
   sibling of a nested `<span id="count">`, with `aria-live`/`role="status"`
   on `#count` only (not the static label), so announcements stay terse
   while the visible label is never wiped. Implementation-plan steps 1 and 3
   updated to match (step 1 defines the markup, step 3 targets `#count`'s
   `textContent` specifically, never the outer container).
2. **Print-view check added to step 6** (testability must-fix): triggering
   print preview with sample text entered, confirming it renders rather than
   breaking/emptying.
3. **Label-association check added to step 6** (testability should-fix):
   clicking the label confirms focus moves to the textarea.
4. **Font-size/no-zoom check added to step 6** (testability should-fix):
   tapping into the textarea on a real device or emulation confirms no
   auto-zoom.
5. **README acceptance criterion added to step 4** (testability should-fix):
   minimum required content spelled out, plus a placeholder rule for the
   Pages URL if step 5 hasn't run yet, plus an explicit acceptance test
   ("a first-time visitor could open the page from the README alone").
6. **Pages-serving check added to step 5** (testability should-fix): load the
   published URL directly and confirm it serves the page rather than a 404,
   with a propagation-delay note so a transient 404 isn't mistaken for
   failure.

All must-fix and should-fix items from both reports have been applied. No
items deferred. This closes the 6-round iterative review.
