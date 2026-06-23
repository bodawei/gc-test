# PRD Review Synthesis: Consonant Counter Web Page

Source PRD: `.prd-reviews/consonant-counter/prd-draft.md`
Review method: 6 independent review passes (requirements, gaps, ambiguity, feasibility,
scope, stakeholders), synthesized below.

## Top consolidated issues (cross-dimension, decision-needed)

These showed up from multiple angles and are the highest-value items for human
clarification before plan generation:

1. **"Y" handling is contradictory, not just open.** The Open Questions section
   says Y's classification is undecided, but the Rough Approach section already
   commits to a concrete rule (Y = consonant). Pick one and remove the
   contradiction. (requirements, ambiguity, gaps — gaps also notes W has the same
   semivowel ambiguity and isn't mentioned at all.)
2. **Live-typing vs. button is presented as both optional and unresolved.** Goals
   says "either," User Stories doesn't pick one, Open Questions re-asks the same
   question. Left as-is, an implementer may build both to be safe, doubling UI/event
   surface for no benefit. Needs one explicit MVP decision. (requirements, ambiguity, scope)
3. **The "additional breakdowns" Open Question directly contradicts the stated
   Non-Goal** ("no additional text statistics... beyond consonant count"). This is
   a scope side-door — either drop the open question or formally amend the Non-Goal.
   (scope)
4. **"Usable on a phone/small screen" has no acceptance criteria.** Not a technical
   blocker (trivial with basic responsive CSS) but as worded it invites
   disproportionate effort. Needs a concrete minimal bar (e.g. "no horizontal
   scroll, default mobile browser zoom/flow is sufficient") or should be explicitly
   descoped. (requirements, feasibility, scope)
5. **Empty-state display is underspecified.** "0 (or appropriate empty state)"
   doesn't pick one value/string, so no single test assertion can be written for
   it. (requirements, ambiguity, gaps)
6. **Accessibility is entirely unaddressed.** No requirement for keyboard
   operability, label/ARIA association on the input, live-region announcement
   behavior for the result (which also interacts with the live-vs-button decision
   above), or a no-JS fallback message. Needs at minimum an explicit "out of scope
   for v1" call, if that's the intent — currently it's just silent. (gaps, stakeholders)
7. **Named personas have unacknowledged conflicts with stated scope.** Teachers
   want reusable/presentable output but Non-Goals + Rough Approach block any
   export/print affordance; writers and word-game players plausibly work in
   non-English text but the ASCII-only Non-Goal excludes that. Not necessarily
   wrong calls, but the PRD presents these personas as fully served when scope
   actually trades off against their needs. (stakeholders)
8. **No decision-maker identified for "throwaway demo vs. reusable seed."** This
   open question affects how much to invest in the above items (accessibility,
   mobile, export) but nobody owns answering it. (stakeholders)

## Findings by dimension

### Requirements
- Core algorithm (A-Z/a-z, AEIOU excluded, case-insensitive, non-letters ignored)
  is precisely specified and testable for the happy path.
- No goal has a concrete, testable acceptance condition as written (live-vs-button,
  mobile usability, "maintainable by any contributor," static/no-server-roundtrip
  are all stated as goals without a pass/fail check).
- No acceptance condition for Non-Goal boundary behavior (e.g. what happens to
  accented/Unicode characters — silently ignored as "other"?).

### Gaps
- Empty/whitespace-only initial state, very long pasted input performance,
  keyboard accessibility, ARIA/live-region labeling, no-JS fallback, result
  selectability/copyability, page `<title>`/favicon, and IME/autocorrect
  composition-event behavior are all unaddressed.
- W has the same semivowel ambiguity as Y but isn't mentioned.

### Ambiguity
- Y-handling contradiction (Open Questions vs. Rough Approach) — see consolidated #1.
- Live-vs-button choice appears in both Goals (as "either") and Open Questions
  (as "which is preferred") without resolution.
- "Standard English letters" (Goals) vs. "ASCII A-Z/a-z only" (Non-Goals) agree
  once cross-referenced but "standard English" alone could mislead a reader into
  including accented borrowings (café, naïve).
- "Appropriate empty state" is undefined (0? blank? placeholder?).
- The breakdown-display Open Question asks readers to "confirm" something already
  declared a Non-Goal — unclear which section wins.

### Feasibility
- Plain HTML/CSS/JS with no build step is fully sufficient for every stated goal;
  this is correctly scoped technically.
- Large-paste live-counting is not actually a performance risk at realistic sizes
  (single-pass char loop is sub-millisecond even for very large strings).
- Repo confirmed to have zero existing frontend code (just README) — the real
  prerequisite this implies is pinning down an exact file path/entry point and
  serving method during planning, not at code-writing time.
- No hidden tooling/library dependency needed anywhere.

### Scope
- Live-vs-button duplication and the breakdown-display open question are the two
  concrete scope-creep vectors (see consolidated #2, #3).
- Mobile-usability wording invites disproportionate responsive-design effort
  relative to a one-textbox demo.
- Otherwise, Non-Goals (no Unicode, no persistence/backend, no native app) are
  solid and easy to enforce if challenged later (e.g. "add vowel count too").
- No single authoritative MVP cut is stated; two unresolved Open Questions block
  defining one.

### Stakeholders
- Teacher persona's need (reusable/presentable output) is structurally blocked by
  current Non-Goals/Rough-Approach — not flagged as a tradeoff in the PRD.
- Future maintainer/contributor stakeholder is well and consistently served
  (simplicity + no-build-step goals reinforce each other).
- Accessibility-dependent users are never considered, despite the live-vs-button
  decision having real accessibility implications (live regions firing on every
  keystroke can be disruptive).
- Non-English-text writers/word-game players are named as users but conflict with
  the ASCII-only Non-Goal.
- No named decision-maker for the throwaway-vs-reusable-seed question.

## Suggested next step

Route consolidated issues 1–8 above to human clarification before plan generation
(per the pipeline's human-clarify gate) rather than treating any of them as
implementation-detail decisions, since several (Y/W rule, live-vs-button, breakdown
display vs. Non-Goal, accessibility bar) change what the implementation plan would
actually build.

---
*Methodology note: produced by 6 independent review passes run directly in the
orchestrating session (via parallel sub-agent dispatch) rather than via the
`gt formula run mol-prd-review` polecat convoy, because that path is currently
broken in this installation (see bug gt-k46: missing `gt` binary, missing
mol-prd-review/design formulas, no --prompt/--mail-back in `gc sling`, no
polecat agent pool configured). Same 6 review dimensions, same independence
property (each pass only saw the PRD + its own dimension brief), different
dispatch mechanism. gt-k46 remains open to fix the underlying infra.*
