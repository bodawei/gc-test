# Plan Self-Review Round 2: risk + scope-creep

Plan reviewed: `.designs/consonant-counter/design-doc.md` (post self-review round 1)
Method: 2 independent reviews (risk, scope-creep), dispatched via Claude
Code's native Agent tool (same workaround as prior rounds, see gt-k46).

## Risk report — summary

Confirmed N/A (not invented): third-party API stability, complex
integrations, data migration, library/dependency drift, concurrency/scale,
and a dedicated rollback section — none apply to a 3-file static page with no
backend, no dependencies, and no deployed state. No spike/POC items
warranted anywhere; the two candidates considered (counting rule, print-view
choice) are both single-sentence decisions with no real technical
uncertainty.

- **Must-fix:** none.
- **Should-fix (4):**
  1. The exact letter classification rule was stated in prose twice with
     slightly different phrasing, inviting a typo-class implementation bug
     (e.g., reverting to the more common "Y is sometimes a vowel"
     convention).
  2. The print-view rendering choice is deferred to build time with two
     options offered; if a builder picks "separate rendered block" without
     re-reading the security section, they could reach for `innerHTML` out
     of habit and reopen the doc's one real XSS finding.
  3. Step 5 (GitHub Pages) names no owner and doesn't address the case where
     the executor lacks settings/admin access to the repo.
  4. Step 6's verification checklist has no stated "what to do if this
     fails" branch.

## Scope-creep report — summary

The plan was found "unusually disciplined" — most sections actively argue
against extra work. Round 1's three additions (README update, verification
checklist, split Pages/verify steps) were explicitly re-examined and
confirmed justified, not creep (each traces to a binding PRD/Q-clarification
or is a pure dependency-correctness fix with zero new tasks). The CSP
meta-tag mention was considered and left as-is — it's narrative-only,
already labeled optional, and correctly excluded from the numbered plan.

- **Must-fix:** none.
- **Should-fix (2), both prose-only trims with no effect on numbered tasks:**
  1. "Extends cleanly later (`page2.html` reusing `style.css`)" — justified
     the flat-layout decision by appeal to a hypothetical future page never
     mentioned in the PRD.
  2. "roughly 2 versions back" browser-version policy — added unrequested
     precision beyond the PRD's actual open question ("evergreen vs. broader
     compatibility"), with no corresponding task that uses the number.

## Fixes applied to `.designs/consonant-counter/design-doc.md`

1. Step 6 now gives a concrete worked example ("Yellow Wax" → 6 consonants:
   Y, l, l, w, W, x) in place of a generic "a known short test string",
   making the Q1 rule self-checking rather than relying on prose alone
   (risk #1).
2. Step 3 now explicitly restates that the `textContent`-only rule also
   applies if a separate print-only block is added, rather than leaving that
   constraint only in the Open questions check section (risk #2).
3. Step 5 now states the local-file fallback applies whether Pages is
   unavailable for technical/policy reasons or due to lacking settings
   access — the plan doesn't need to know in advance which case applies
   (risk #3).
4. Step 6 now ends with "If any check fails, fix the relevant file from
   steps 1-3 and re-verify — there's no migration or deployed state to roll
   back" (risk #4).
5. Removed the speculative "Extends cleanly later (page2.html...)" clause
   from the File layout & hosting section (scope-creep #1).
6. Trimmed "roughly 2 versions back" from the Target Browsers resolution,
   leaving "modern evergreen browsers only (current Chrome, Firefox, Safari,
   Edge)" (scope-creep #2).

All must-fix and should-fix items from both reports have been applied. No
items deferred.
