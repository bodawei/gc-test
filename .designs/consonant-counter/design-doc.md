# Design Doc: Consonant Counter Web Page

Source PRD (with human clarifications): `.prd-reviews/consonant-counter/prd-draft.md`
Method: 6 independent design explorations (api, data, ux, scale, security, integration),
synthesized below. Same workaround as the PRD review (see gt-k46): dispatched via
Claude Code's native Agent tool rather than `gt formula run design`, since the `gt`
binary and `design` formula are unavailable in this installation.

## Summary

This is a single static HTML/CSS/JS page, no backend, no build step, no framework,
no persistence. Most "design dimensions" are intentionally thin for a feature this
small — the doc says so explicitly rather than padding. The one substantive change
from default assumptions is that printing/export is now in scope (PRD clarification
Q7), which introduces the only real security consideration (never render user text
via `innerHTML`).

## File layout & hosting (integration)

- Flat root layout: `index.html`, `style.css`, `script.js`. No `/src`, no
  subdirectories, no manifest — nothing to bundle, so directories only add
  navigation overhead for one page.
- Repo has a GitHub remote (`bodawei/gc-test`), so GitHub Pages is the concrete
  hosting recommendation: zero new infra, free, serves static files from `main`.
  Local dev: open `index.html` directly (no server needed, no fetch/CORS
  dependency).
- Naming precedent for this repo's first frontend code: lowercase hyphenated
  filenames, no `.min.js`, no CDN-hosted libraries, markup/style/behavior kept in
  separate files (not inlined) — consistent with "maintained component, not
  throwaway" (PRD Q8).

## Interface / code structure (api)

- One pure function, decoupled from the DOM:
  ```js
  function countConsonants(str): number
  ```
  Iterates characters, counts A-Z/a-z minus AEIOU; Y and W always count (Q1);
  non-ASCII/non-letters ignored (Non-Goals, Q7). Empty string → `0` (Q5).
  Kept pure and DOM-free so it stays independently testable later even though no
  test suite is required now (Q9).
- DOM/event boundary: an `input`-event handler (no button — live-typing only,
  Q2) reads the textarea's value, calls `countConsonants`, writes the result via
  a trivial render step. No counting logic inline in the handler; no
  event-delegation or pub/sub system needed for one listener.
- No network API, no module imports/exports — nothing external to version as a
  contract.

## Data model (data)

- Not applicable, by design. Non-Goals explicitly rule out persistence, accounts,
  history, analytics, and any backend/database (unchanged by Q3/Q9).
- The only "state" is the textarea's `.value`, owned by the DOM. Consonant count
  is a pure derived value recomputed on every `input` event — no state object,
  cache, or memoization needed at this input scale. Empty state (`0`, Q5) falls
  out of the same derivation with no special-cased branch.
- Recommendation: do not introduce a state container or reducer. One listener
  reading input and writing output is the entire "data layer."

## UX (ux)

- Layout: single column — label → textarea (4-6 rows, fluid width up to
  ~600-700px) → a visually prominent result region ("Consonants: **0**"). No
  button; exactly two interactive/display regions.
- Result region content model (resolves an ambiguity the mockup alone left
  open): the "Consonants: " label is static text, a sibling of a nested
  `<span id="count">` that carries only the bare digit. Only `#count` carries
  `aria-live="polite"` + `role="status"` — not the static label text. This
  keeps each announcement to just the changing number rather than
  re-announcing "Consonants:" on every keystroke, consistent with the
  `polite`/no-debounce reasoning below, while the visible label stays
  permanently on-screen since it's never reassigned.
- Mobile acceptance bar (Q4, concrete and minimal): no horizontal scroll down to
  ~320px viewport (fluid widths, not fixed px); `viewport` meta tag present;
  stacked normal-flow layout (no fixed/absolute positioning over the keyboard);
  textarea font-size ≥16px to avoid iOS auto-zoom-on-focus.
- Accessibility minimum bar (Q6, concrete and minimal): native `<textarea>` for
  free keyboard operability; explicit `<label for>` association (not placeholder
  text); `#count` carries `aria-live="polite"` + `role="status"` so screen
  readers announce updates without the keystroke-by-keystroke disruption noted
  in the PRD review — `polite` naturally coalesces rapid changes, no JS debounce
  needed for this.
- Mobile result visibility (closes the loop on the "usable on a phone" user
  story beyond pure CSS sizing, per PRD alignment round 1): keep the textarea
  modest (4-6 rows) so the result element stays visible, or at most a short
  scroll away, when the on-screen keyboard reduces visible viewport height. No
  JS viewport-height workarounds needed — the textarea is already a large,
  naturally-sized tap target, so no separate touch-target sizing is required.
- Print view (Q7): no dedicated print stylesheet required beyond minor
  `@media print` touch-ups; browsers print textarea content as-is, which is an
  acceptable baseline. A print-only plain-text rendering is a nice-to-have, not
  required for the minimum bar.

## Performance (scale)

- Not a meaningful risk at this scale; no mitigation needed. A single-pass O(n)
  character classification costs about one comparison + increment per
  character — tens of millions of chars/sec even on low-end mobile CPUs. A
  500K-character paste (a generous worst case for a textarea) resolves in
  comfortably under 50ms.
- No accumulation across keystrokes (each `input` event is one fresh pass), no
  memory growth, no network/IO.
- Recommendation: plain single-pass loop, no debounce/throttle — debouncing
  would conflict with the binding live-as-you-type requirement (Q2) by adding
  perceptible lag to normal typing, with no real problem to justify it.

## Security (security)

- The one real risk: rendering user-typed/pasted text back into the page via
  `innerHTML`/`insertAdjacentHTML`/`document.write` is a DOM-based XSS vector.
  This becomes relevant now that printing/export is in scope (Q7), since a print
  view likely re-renders the input text rather than just its derived count.
  **Concrete rule:** always write user-supplied text via `textContent`/
  `innerText` (or text nodes), never an HTML-parsing sink. If the print view
  reuses the same `<textarea>` rather than a separate rendered block, it's
  inherently safe since textarea content isn't parsed as HTML.
- The consonant count itself is a derived non-negative integer — no injection
  path, same `textContent` rule applies trivially.
- No other meaningful attack surface: no network calls, no storage, no backend,
  no third-party scripts. Optional defense-in-depth: a basic CSP meta tag
  (`default-src 'self'`) if served rather than opened as a local file — not
  required given the trivial attack surface.

## Open questions check

Most PRD open questions were resolved by the human clarifications (Q1-Q9).
Two original open questions were not covered by Q1-Q9 (they didn't surface as
cross-dimension issues in the PRD review synthesis) and are resolved here
directly, as implementation-level decisions consistent with everything already
established — not escalated back to the human, per the pipeline's single
human-gate design:

- **Visual/branding requirements:** none. Plain, functional/minimal styling is
  acceptable for v1, consistent with the "simple enough to be understood and
  maintained by any contributor" goal and the no-CDN, no-framework conventions
  already adopted.
- **Target browsers:** modern evergreen browsers only (current Chrome,
  Firefox, Safari, Edge). Consistent with the
  no-build-step constraint — there's no transpilation/polyfill safety net for
  older browsers, and every API used (`<textarea>`, `input` events,
  `aria-live`, `textContent`, `@media print`) is long-standing and
  evergreen-safe with no legacy shims needed.

The print-view rendering approach (reuse `<textarea>` vs. a separate rendered
block) is the one implementation detail left to the build step, with a safe
default recommended above (reuse `<textarea>`, or if using a separate block,
use `textContent` only).

## Implementation plan (derived from the above)

Scope constraint that applies throughout (not a sequenced step): no build
tooling, no test suite (Q9), no backend, no storage.

1. `index.html` — structure: label, textarea, and a result region containing
   static text "Consonants: " plus a nested `<span id="count">` defaulting to
   `0` in its static markup (so the empty/initial state per Q5 is correct on
   page load, before any `input` event fires) — only `#count` carries
   `aria-live="polite"`/`role="status"`, per the UX section's content-model
   note. Also: viewport meta tag, link to `style.css` and `script.js`. Fixes
   the element structure/selectors that step 3 depends on.
2. `style.css` — fluid single-column layout, mobile-safe sizing
   (font-size ≥16px on textarea, max-width container, modest 4-6 row textarea
   height so the result stays visible with the on-screen keyboard open), minor
   `@media print` rule if needed.
3. `script.js` — pure `countConsonants(str)` function implementing the exact
   rule: count A-Z/a-z, excluding A/E/I/O/U, **including Y and W as
   consonants** (Q1), case-insensitive, ignoring all non-letters and non-ASCII
   characters (Q7); empty string returns `0`. The function can assume its
   argument is always a string — it's only ever called with the textarea's
   `.value`, which the DOM guarantees is a string — so no defensive
   type-checking/coercion is needed. Wire an `input`-event handler to the
   textarea (depends on step 1's element structure) that calls it and writes
   the result via `#count`'s `textContent` only — never the result region's
   outer container (which also holds the static "Consonants: " label), and
   never `innerHTML` (per the security rule above — this also applies if a
   separate print-only block is added later instead of reusing the textarea
   for print, per the Open questions check). Either rely on the static markup
   already showing `0` (per step 1) or call the handler once on load —
   either is acceptable as long as the rendered initial state is `0` before
   the first keystroke.
4. Commit and push `index.html`/`style.css`/`script.js` to `main`, and update
   `README.md` so it contains at minimum: the page's one-line purpose, and
   instructions to open `index.html` directly. If step 5 (Pages) is already
   done, also include the live Pages URL; otherwise leave a placeholder note
   ("GitHub Pages URL — add once enabled") so the omission stays visible
   rather than silent. Acceptance: a first-time visitor could open the page
   from the README's instructions alone. A near-zero-cost addition consistent
   with Q8 (maintained, reusable component) — the repo's only existing doc
   should describe what's in the repo.
5. Enable GitHub Pages on `main` for hosting. This is a manual, one-time
   repo-settings action (Settings → Pages → deploy from `main`), not a code
   change — it has no dependency on steps 1-4 and can happen at any point, but
   needs step 4's push to `main` before it serves anything meaningful. After
   enabling, load the published URL directly (not just locally) and confirm
   it serves the current page rather than a 404 — initial propagation can
   take a minute or two, so retry briefly before treating a 404 as broken.
   If Pages is unavailable — whether for technical/policy reasons or because the
   person doing the work lacks settings access on this repo — local-file
   usage (open `index.html` directly, already noted above) is the documented
   fallback either way; no blocking dependency on Pages for the page to be
   useful/correct.
6. Verify: open `index.html` locally (fast feedback loop, no server needed)
   and, once Pages is enabled, the published Pages URL (see step 5's serving
   check). Confirm: a known short test string's count matches a manual
   count — e.g. "Yellow Wax" → 6 consonants (Y, l, l, w, W, x), which
   exercises the Q1 Y/W rule directly; clearing the textarea shows `0`;
   resizing to ~320px width shows no horizontal scroll and the result stays
   visible with the on-screen keyboard open; tapping into the textarea on an
   actual mobile device or devtools device-emulation does not trigger
   auto-zoom (confirms the ≥16px font-size bar); clicking the label moves
   focus to the textarea (confirms `<label for>` is wired to the textarea's
   `id`, not just adjacent text); `#count` announces via `aria-live="polite"`
   without requiring focus to move; and triggering print preview (Ctrl/Cmd+P)
   with sample text entered shows the typed text rendered, not a broken or
   empty block. This is a manual checklist, not an automated test suite
   (Q9 — no test suite required). If any check fails, fix the relevant file
   from steps 1-3 and re-verify — there's no migration or deployed state to
   roll back, just files to edit and reload.
