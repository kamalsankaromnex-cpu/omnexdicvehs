# DICV Interactive Web Objects — Known Issues & Resolution Log

**Standard:** Permanent tracking of all technical defects, UI misalignments, and regressions.

---

### Record: DICV-QA-001
- **Date Discovered:** 2026-11-13
- **Affected Quizzes:** `Q002`
- **Category:** Storyline Integration
- **Severity:** High
- **Symptoms:** Feedback layer in Storyline 360 did not open when clicking Submit during testing.
- **Root Cause:**
  1. Desktop Preview sandbox: Articulate Storyline 360 blocks `window.parent.GetPlayer()` inside the internal desktop Preview window (F12) due to Chromium sandbox security.
  2. Double-toggle variable race condition in earlier script where `Q002_Done` was toggled rapidly 4 times.
  3. `Q002_Correct` was not committed before `Q002_Done` fired triggers.
- **Fix Implemented:**
  - Added 25ms delay between committing `Q002_Correct` and firing `Q002_Done`.
  - Added fail-safe postMessage dispatcher posting to `window.parent` and `window.top`.
  - Documented mandatory testing in Published Web output (`story.html`) rather than F12 preview.
- **Regression Prevention Test:** Test Q002 with `GetPlayer()` mock verifying `Q002_Correct` commits before `Q002_Done`.
- **Status:** Closed

---

### Record: DICV-QA-002
- **Date Discovered:** 2026-11-13
- **Affected Quizzes:** \Q002- **Category:** Storyline Integration / UI
- **Severity:** High
- **Symptoms:** Answers were not revealing after submission; slide always showed Incorrect layer.
- **Root Cause:**
  1. Incorrect layer was showing because tester only selected 1–2 cards; Q002 requires all 5 cards for Correct.
  2. Answer reveal was not working because \Set Q002_Revealed = True\ was placed only on Correct layer, not Incorrect layer.
  3. The Web Object had no active variable polling after initialization to detect when Storyline sets \Q002_Revealed = True\.
- **Fix Implemented:**
  - Added 150ms active polling watcher in \storyline-bridge.js\ to catch \Q002_Revealed\ dynamically.
  - Added 700ms auto-reveal transition in \index.html\ as a foolproof fallback.
- **Regression Prevention Test:** Simulate \Q002_Revealed = true\ dynamically and verify \pplyReviewMode()\ triggers.
- **Status:** Closed

---

### Record: DICV-QA-003
- **Date Discovered:** 2026-11-13
- **Affected Quizzes:** `Q001`, `Q002`
- **Category:** Corporate Design Compliance / UI
- **Severity:** Medium
- **Symptoms:** Misalignment between Q001 and Q002 (Q001 used petrol checkboxes & rectangular card; Q002 used golden yellow `#FFD100`, black borders `#11161B`, italic headings, and a dark pill).
- **Root Cause:** Styling and colors were copied from reference screenshots and user design feedback rather than strictly adhering to the Daimler Truck Design Guidelines PDF.
- **Fix Implemented:**
  - Standardized both quizzes on official **Daimler Yellow `#FFFF40`** checkboxes with dark checkmarks.
  - Replaced solid black card borders in Q002 with **Corporate Petrol `#00677F`**.
  - Replaced italic typography with **Daimler CS Bold (Upright)**.
  - Centralized global tokens in `shared/styles/theme.css` and `shared/styles/components.css`.
- **Regression Prevention Test:** Automated CSS audit checking that only approved Daimler hex codes and upright font styles are used.
- **Status:** Closed

---

### Record: DICV-QA-004
- **Date Discovered:** 2026-11-13
- **Affected Quizzes:** `Q005`, `Q006`
- **Category:** Storyline Bridge API / JavaScript Contract
- **Severity:** High
- **Symptoms:** JavaScript exception `TypeError: bridge.restoreState is not a function` during saved-state inspection.
- **Root Cause:** Caller code invoked `bridge.restoreState()` assuming an imperative getter, whereas `DICVStorylineBridge` exposes state reactively via `bridge.state` (`.submitted`, `.submittedSelection`, `.isCorrect`).
- **Fix Implemented:** Replaced calls with direct property access to `bridge.state` and verified with mock harness.
- **Regression Prevention Test:** Regression check in `committee-quiz.js` and automated headless state hydration check.
- **Status:** Closed

---

### Record: DICV-QA-005
- **Date Discovered:** 2026-11-13
- **Affected Quizzes:** `Q006`
- **Category:** Build & Headless Testing Tools
- **Severity:** Low
- **Symptoms:** Headless Chrome screenshot generation failed to overwrite target PNGs on Windows and took premature snapshots before web components rendered.
- **Root Cause:** Chrome on Windows locks or silently skips existing screenshot paths if present, and captures immediately before font loading / layout completion unless a virtual time budget is specified.
- **Fix Implemented:** Pre-deletion of existing target PNGs in Python capture scripts with `--virtual-time-budget=2000` argument.
- **Status:** Closed

---

### Record: DICV-QA-006
- **Date Discovered:** 2026-11-14
- **Affected Quizzes:** `Q001–Q006` (`shared/storyline/storyline-bridge.js`)
- **Category:** Storyline Bridge / SCORM Resume Serialization
- **Severity:** Critical (P0)
- **Symptoms:** On SCORM LMS resume, serialized string `"false"` values from `GetVar()` were coerced via `Boolean("false") === true`, falsely marking unsubmitted or unrevealed quizzes as submitted/revealed. Additionally, `Q006` singular `answer` variable mapping was ignored by `syncFromDirectPlayer()` and `submit()`, polling did not auto-stop after reveal, and `handleIncomingMessage()` did not reject foreign `event.source` or duplicate `QUIZ_REVEAL_ANSWERS` events.
- **Root Cause:** Direct `Boolean(raw)` coercion, hardcoded `answers` key lookup, missing `event.source` / reveal deduplication guards, and missing `pagehide` cleanup.
- **Fix Implemented:** Added `parseBoolVar()`, `variableMap.answers || variableMap.answer`, auto-stop polling on reveal, `destroy()` on `pagehide`, `lastSubmissionId` tracking, and `event.source` / duplicate-reveal guards in `WebObjects/shared/storyline/storyline-bridge.js`.
- **Regression Prevention Test:** `WebObjects/tests/regression/test_technical_integrity.js` (Bridge unit tests 1–3).
- **Status:** Closed

---

### Record: DICV-QA-007
- **Date Discovered:** 2026-11-14
- **Affected Quizzes:** `Q004_EHSFocusAreas`
- **Category:** Storyline Bridge API / Premature Reveal
- **Severity:** Critical (P0)
- **Symptoms:** `Q004` called `new DICVStorylineBridge('Q004', ...)` with two arguments instead of a single config object, causing `quizId` to default to `'UNKNOWN_QUIZ'` and callbacks (`onReveal`, `onStateRestored`) to be ignored. It also auto-revealed answers after 700ms and on unrevealed revisits.
- **Root Cause:** Signature mismatch with `DICVStorylineBridge(config)` and unguarded `setTimeout(..., 700)` fallback.
- **Fix Implemented:** Converted `Q004` to single-object `DICVStorylineBridge` initialization with `Q004_*` variable mapping, `parseQ004PlacementString()`, `applyQ004BridgeState()`, removed the 700ms auto-reveal timer, and gated revisit `review()` on `bridge.state.revealed`.
- **Regression Prevention Test:** `WebObjects/tests/regression/test_technical_integrity.js` (Static defect check 5).
- **Status:** Closed

---

### Record: DICV-QA-008
- **Date Discovered:** 2026-11-14
- **Affected Quizzes:** `Q001`, `Q002`, `Q003`, `Q005`, `Q006_R1/R2/R3`
- **Category:** Feedback Timing / Retry & Revisit State Integrity
- **Severity:** High (P1)
- **Symptoms:** `Q001` double-toggled `Q001_Done` inside `submitQuiz()` and failed to lock `isLocked`/`btnReset` on reveal; `Q002`/`Q003` auto-revealed answers after 700ms without Storyline authorization; `Q005`/`Q006` used invalid `onResetState` instead of `onResetAttempt`, omitted `onStateReceived`, and failed to restore `.card-status-badge` `display` on retry re-reveal; `Q005` left cards draggable on unrevealed revisit; `Q006` failed to match label strings like `"Sub Committee"` back to option IDs on revisit.
- **Root Cause:** Premature local fallback timers, callback name mismatch (`onResetState`), inline `display: none` not cleared on review, and missing label-to-ID normalization.
- **Fix Implemented:** Fixed `Q001` submission/reset/lock flow; removed 700ms fallback timers in `Q002`/`Q003`; standardized `onResetAttempt` + `onStateReceived` + badge display restoration in `Q005`/`Q006`; added card locking on `Q005` revisit and label normalization in `Q006`.
- **Regression Prevention Test:** `WebObjects/tests/regression/test_technical_integrity.js` (Tests 4–6).
- **Status:** Closed


---

### Record: DICV-QA-009
- **Date Discovered:** 2026-11-14
- **Affected Quizzes:** `Q004_EHSFocusAreas`
- **Category:** UI/UX Geometry & Drop-Zone Containment
- **Severity:** High (P2)
- **Symptoms:** Focus Area 2 and Focus Area 3 dashed drop zones extended outside their Teal and Daimler Yellow lobes, the yellow lobe was clipped at `x = 584`, the white `SAFETY Strategy` hub was squeezed, and the disabled Submit button used a dark petrol fill with yellow border/arrow.
- **Root Cause:** Asymmetrical hardcoded polygon path clipped at `x = 584` (`viewBox="0 0 585 585"`), oversized `262–320 px` drop zones positioned near lobe edges, and `opacity: 0.45` over active dark/yellow Submit styling.
- **Fix Implemented:** Replaced the SVG pinwheel with three 120°-symmetrical smooth arc lobes (`viewBox="0 0 640 640"`, `r = 84..300`), centered `.white-hub`, resized and centered `#zone-1..3` (`220×128 px`) completely inside their lobes with refined `2.5px` dashed borders, scaled compact placed cards inside zones, balanced right-panel card heights (`112px`), and styled `#submit:disabled` in neutral grey (`#E2E8EB` / `#CFD8DC` / `#6E7E85`).
- **Regression Prevention Test:** `WebObjects/tests/regression/test_design_system_compliance.py` and `WebObjects/tests/regression/test_technical_integrity.js`.
- **Status:** Closed

---

### Record: DICV-QA-010
- **Date Discovered:** 2026-11-18
- **Affected Quizzes:** `Q006_R2`, `Q006_R3`, `Q006_R1`, `Q003`
- **Category:** HUD Split-Mode Layout / Dist Sync
- **Severity:** Medium (P2)
- **Symptoms:**
  1. In `Q006` split feedback mode at `1024×576`, `.quiz-board` slightly overlapped the left edge of `#feedback-side-panel` (~10px).
  2. `dist/Q006_R*` retained `<script src="../shared/committee-data.js">` instead of local `committee-data.js`.
  3. `Q003` `.btn-submit` and `.footer-status-text` painted behind `.hud-panel-box` (`z-index: 1`).
- **Fix Implemented:**
  - Updated `committee-quiz.css` split transform (`translateX(-184px) scale(0.79)`) and `#feedback-side-panel` (`right: 14px; width: 352px;`).
  - Synced `committee-data.js` into `dist/Q006_R*` and updated `index.html` script reference.
  - Added `position: relative; z-index: 10;` to `.btn-submit` and `.footer-status-text` in `Q003`.
- **Status:** Closed

---

### Tracked Functional Discrepancies (Open / Preserved per Phase 0)
1. **`Q001` Life Deduction in `storyline-bridge.js`:** `StorylineBridge.submit()` currently decrements `LivesRemaining` by 1 on incorrect submission for all quizzes including `Q001`. Preserved without silent mutation during UI redesign.
2. **`Q004` Bonus Question One-Time Refill Guard:** `Q004` sets `LivesRemaining = 3` on a correct bonus answer without checking a once-per-module refill guard variable. Preserved without silent mutation during UI redesign.
3. **`Header2` Review Notes:** `Header2` defaults `Header2Title` to `'EHS Refresher Training'` (matching Header 1 unless Storyline sets `Header2Title`), has no `600ms` live poll (relies on load + `HEADER2_SYNC`), and uses `"Segoe UI", Arial, sans-serif` instead of `Daimler CS`.
