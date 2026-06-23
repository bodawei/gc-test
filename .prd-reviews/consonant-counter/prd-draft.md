# PRD: Consonant Counter Web Page

## Problem Statement
Users sometimes need a quick way to count the number of consonants in a piece
of text (students checking exercises, writers doing text analysis, puzzle/word-game
players, teachers building materials). There's no existing tool in this project
that does this. We want a simple, self-contained web page where a user types or
pastes text and immediately sees how many consonant characters it contains.

## Goals
- A single web page with a text input (or textarea) where a user enters a string.
- The page displays the count of consonants in that string, updating either live
  as the user types or on a clear "Count" action.
- Counting is correct for standard English letters, case-insensitive (treats
  'B' and 'b' both as consonants).
- Works as a static, client-side page (no server round-trip required to compute
  the count).
- Simple enough to be understood and maintained by any contributor to this repo.

## Non-Goals
- No support for non-English alphabets / Unicode letter classification (e.g.,
  accented letters, Cyrillic, CJK) in v1 — only ASCII A-Z/a-z classified as
  vowel/consonant/other.
- No persistence, accounts, history, or analytics of past inputs.
- No backend API, database, or server-side processing.
- No additional text statistics (word count, vowel count, letter frequency,
  etc.) beyond consonant count — those are explicitly out of scope for this PRD.
- No mobile app / native packaging.

## User Stories / Scenarios
- As a visitor, I open the page, type or paste a sentence into a text box, and
  see the number of consonants in that text.
- As a visitor, I clear the text box and the count resets to 0 (or appropriate
  empty state).
- As a visitor, I enter text with numbers, punctuation, and spaces, and only
  alphabetic consonant characters are counted — everything else is ignored.
- As a visitor on a phone or small screen, the page is still usable.

## Constraints
- Should fit this repo's existing conventions (currently a near-empty repo with
  just a README — no established frontend framework yet, so this likely
  introduces the first frontend code).
- No stated framework/tooling requirement yet — open question for the
  implementation plan phase (plain HTML/CSS/JS vs. a framework).
- No specified hosting/deploy target yet.

## Open Questions
- Should "y" be treated as a consonant always, sometimes (semivowel), or
  configurable? (Default assumption: treat y as a consonant, since that's the
  common simple convention, but flagging for review.)
- Live count-as-you-type vs. explicit button — which is preferred?
- Any requirement for a minimal test suite or is this a throwaway demo page?
- Any visual/branding requirements, or is plain/minimal styling acceptable?
- Should the tool show additional breakdowns (e.g., vowels vs. consonants vs.
  other) even though only consonant count is required, for context? (Currently
  a non-goal, but worth confirming.)
- Target browsers — modern evergreen browsers only, or broader compatibility?

## Rough Approach
A single static HTML file with embedded (or linked) CSS and JavaScript:
- A `<textarea>` or `<input>` for the user's string.
- A JS function that iterates over the characters, classifies each
  alphabetic character as vowel or consonant (A, E, I, O, U excluded; the
  rest of A-Z/a-z counted as consonants), and ignores non-letter characters.
- An on-input event handler (or a button) that recomputes and displays the
  count in a result element.
- No build step required — open the HTML file directly or serve it via any
  static file server.

## Clarifications from Human Review

**Q1: Y/W consonant rule.** Should Y always count as a consonant? Should W
get the same explicit treatment (currently unmentioned, same semivowel ambiguity)?
A: Y and W are both always treated as consonants.

**Q2: Live-typing vs. button.**
A: Live count-as-you-type. No button — drop that option.

**Q3: Additional breakdowns vs. stated Non-Goal.** Drop the open question, or
amend the Non-Goal to allow a vowel/consonant/other breakdown?
A: Consonant count only. The open question is dropped; the Non-Goal (no
additional text statistics) stands as originally written.

**Q4: Mobile/small-screen usability acceptance bar.** Define a concrete
minimal bar, or descope mobile entirely for v1?
A: Mobile must be supported — not descoped. Implementation plan should define
a concrete minimal acceptance bar (e.g., no horizontal scroll, usable at
default mobile browser zoom/flow).

**Q5: Empty-state display.** What exact value/string for the empty/initial state?
A: `0`.

**Q6: Accessibility.** Explicitly out of scope for v1, or a minimum bar?
A: In scope. Implementation plan should include a minimum accessibility bar
(keyboard operability, label/ARIA association on the input, appropriate
live-region behavior for the live-updating result).

**Q7: Persona conflicts (export/print, non-English text).** Acceptable
tradeoffs as originally scoped, or adjust scope?
A: Allow printing — amend the Non-Goals to permit a print-friendly view
(serves the teacher persona). Remains ASCII-only — no Unicode/non-English
letter support; the tradeoff against non-English-text writers/word-game
players is accepted as-is.

**Q8: Throwaway demo vs. reusable seed.** Affects how much to invest in
items above.
A: This is a maintained, reusable component, not a throwaway demo.

**Q9: Test suite.**
A: No test suite required.
