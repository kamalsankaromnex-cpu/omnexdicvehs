# DICV Interactive Web Objects — Changelog

All notable changes to the DICV Interactive Quiz codebase are documented in this file.

---

## [3.0.0] - 2026-11-18
### Added & Changed
- **HUD Tech-Frame Redesign (`Q001–Q006`, All 8 Quiz Web Objects):**
  - Created shared [quiz-hud.css](../shared/styles/quiz-hud.css) defining HUD tokens (`--hud-panel-bg: rgba(12, 36, 49, 0.92)`, `--hud-panel-shadow`, `--hud-text-light`, `--hud-text-muted`, `--hud-text-dark`), `.hud-frame-svg`, `.rhombus-banner` (petrol gradient with `#FFFF40` stroke), and `.feedback-side-panel.is-two-portion` (Green `#008248` / Red `#D92323` top header + White bottom body + Dark Petrol `.btn-continue`).
  - Applied Dim Dark-Petrol HUD shell, inline `.hud-frame-svg`, Rhombus Petrol Question Banner, and yellow Submit button across **Q001**, **Q002**, **Q003**, **Q004**, **Q005**, and **Q006 (`R2 → R3 → R1`)**.
  - Preserved **Q001** Storyline-owned feedback (no HTML feedback panel / Continue button) and preserved **Q002–Q006** in-object Two-Portion Feedback Panels (`Qxxx_Continue`), **Q002** `1800×900` split media-sync (`Q002_ON_MEDIA_COMPLETE`), **Q003** `MAX_SELECTIONS = 4`, **Q004** Venn drag-and-drop + `#bonus-overlay`, and **Q005** `1110×640` Bradley curve ordering.
  - Fixed `Q006` split-mode overlap at `1024×576` (`body.is-feedback-split .quiz-board` scaled to `translateX(-184px) scale(0.79)`, `.feedback-side-panel` at `right: 14px; width: 352px;`) and fixed `dist/Q006_R*` `committee-data.js` path.
- **Header 1 & Module 1 Outro Heart/Star Animations:**
  - **`Header1` (`header1.css`, `header1.js`):** Added `lastLivesCount` tracking with `is-just-lost` (`headerHeartLost`) on heart reduction, `is-just-gained` (`headerHeartGained`) on heart increase, `#h1-life-val` `is-life-reduced` / `is-life-gained` pulses, and continuous staggered `headerStarShimmer` on active stars (with `prefers-reduced-motion` and Node VM `setTimeout` guards).
  - **`Module1_Outro` (`index.html`):** Added continuous `outroHeroStarPulse`, `outroStationStarPulse`, and `outroStarTwinkle` star animations, plus staggered `outroHeartBeat` on active hearts and `outroHeartLost` on lost hearts.
- **Distribution Sync & Regression Verification:**
  - Synchronized all 8 quiz packages + `Header1` + `Module1_Outro` in `WebObjects/dist/*`, updated `WebObjects/tests/screenshots/` and verified all 6 regression suites pass.
- **Header 1 Logo, Guidelines Icon, Header 2 Topic Names & Web Audio SFX:**
  - Updated `Header1` Daimler Truck logotype to white transparent PNG (`Daimler_Truck_Logotype_1L_White_RGB.png`) and replaced the Guidelines SVG with a clipboard/rules icon.
  - Updated `Header2` (`header2.js`, `index.html`) to resolve and display the active Module 1 topic name (`103`, `102`, `104`, `105`, `106`) with `600ms` live polling.
  - Increased font sizes and deepened the dim dark-petrol HUD backdrop (`rgba(6, 20, 29, 0.96)`) across `Q002–Q006`.
  - Added zero-dependency Web Audio API synthesizer [sfx.js](../shared/audio/sfx.js) (`click`, `select`, `deselect`, `drop`, `limit`, `correct`, `incorrect`, `heart_lost`, `heart_gain`, `star`) wired to `Header1` Mute (`SFX_MUTE_CHANGED` + `localStorage`), `Q001–Q006`, and `Module1_Outro`.

## [2.10.0] - 2026-11-18
### Added & Changed
- **Q002 (DICV Safety Commitments) 3-Stage Split Mode & Integrated Feedback Panel:**
  - Added `1800 × 900 px` Storyline Split Media-Sync Mode (`Stage 1` media-locked split → `Stage 2` expanded interactive via `Q002_ON_MEDIA_COMPLETE` → `Stage 3` left-shifted quiz + right-side feedback panel).
  - Built in-object **Feedback Side Panel** (`#feedback-side-panel`) with distinct **Correct** (green top accent, Tick `✓` SVG icon, `All 5 Commitments Selected` pill, `Well done!`) and **Missed / Incorrect** (red top accent `#D92323`, Cross `✕` SVG icon, `One or More Missed` pill, `Good thinking!`) states and non-repeating body copy.
  - Added **Continue →** button (`#btn-continue`) inside the feedback panel that sets Storyline variable `Q002_Continue = True` (synchronous if `False`, `250ms` reset-toggle if already `True`) and emits `QUIZ_CONTINUE_CLICKED`, eliminating the need for visual feedback layers in Storyline (only Base Layer audio triggers on `Q002_Done` + `Q002_Correct` and navigation on `Q002_Continue`).
  - Synced `WebObjects/dist/Q002_SafetyCommitments/` and verified all regression suites pass.

## [2.9.2] - 2026-11-14
### Changed
- **Q004 (DICV EHS Focus Areas) Pinwheel Geometry & Drop-Zone Containment Fix (`DICV-QA-009`):**
  - Replaced the clipped asymmetrical SVG pinwheel with three 120°-symmetrical smooth arc lobes (`viewBox="0 0 640 640"`, `r = 84..300`) so the Daimler Yellow lobe is completely unclipped and balanced with Dark Petrol and Petrol lobes.
  - Centered `.white-hub` (`SAFETY Strategy`) in the open white center (`168`-unit / `210px` diameter).
  - Resized `#zone-1`, `#zone-2`, and `#zone-3` (`220 × 128 px`, `2.5px` dashed border) and positioned them mathematically inside their respective lobes with zero boundary overflow, along with compact placed card sizing (`17.5px` label, `48×48` icon).
  - Balanced `.venn` and `.panel` heights (`867px`), increased option card height to `112px`, and updated `#submit:disabled` to a clearly neutral grey (`#E2E8EB` fill, `#CFD8DC` border, `#6E7E85` text/arrow).
  - Rebuilt `WebObjects/dist/Q004_EHSFocusAreas/` and verified all regression suites pass.

## [2.9.1] - 2026-11-14
### Fixed
- **Master Technical Review & Storyline/LMS Compatibility Hardening (`Q001–Q006`):**
  - **`WebObjects/shared/storyline/storyline-bridge.js`:** Added `parseBoolVar()` to prevent `Boolean("false") === true` SCORM resume corruption; supported singular `answer` mapping for `Q006`; auto-stopped polling upon reveal; added `pagehide` cleanup via `destroy()`; guarded against foreign `event.source`, missing payloads, and duplicate reveal triggers; recorded `lastSubmissionId`.
  - **`Q001_AccidentPrediction`:** Removed duplicate `Q001_Done` toggle inside `submitQuiz()`; added `resetQuiz(force)` so Storyline `onResetAttempt` can reset locked attempts while user Reset stays gated; locked `isSubmitted`, `isLocked`, `canvasEl`, `btnReset`, and `btnSubmit` in `revealApprovedAnswers()`.
  - **`Q002_SafetyCommitments` & `Q003_EHSCommitments`:** Removed premature 700ms `setTimeout` auto-reveal fallbacks so review mode waits for Storyline authorization.
  - **`Q004_EHSFocusAreas`:** Fixed broken two-argument `new DICVStorylineBridge('Q004', ...)` constructor to single-object config with `Q004_*` variable mappings, `onStateReceived`, `onRevealAnswers`, and `onResetAttempt`; added placement string parser for revisit recovery; removed 700ms auto-reveal fallback; gated revisit `review()` on `bridge.state.revealed`.
  - **`Q005_SafetyCultureMaturity`:** Fixed `onResetState` -> `onResetAttempt`; added `onStateReceived`; locked cards (`draggable="false"`, `.is-locked`) on unrevealed revisit; cleared `badgeEl.style.display = ''` in `revealReviewMode()`; added `bridge.notifyDraftChange(state.placements)`.
  - **`Q006_SafetyReviewStructure/shared/committee-quiz.js`:** Fixed `onResetState` -> `onResetAttempt`; added `onStateReceived`; normalized submitted label strings (`"Sub Committee"`, etc.) back to option IDs during revisit restoration; cleared `badge.style.display = ''` in `revealReviewMode()`.
  - Rebuilt all 8 standalone packages in `WebObjects/dist/` and added automated technical suite `WebObjects/tests/regression/test_technical_integrity.js` (6/6 passing alongside `test_design_system_compliance.py` and `test_q001_logic.js`).

## [2.9.0] - 2026-11-13
### Changed
- **Q004 (DICV EHS Focus Areas) Exact HTML Layout & Architecture Upgrade:**
  - Integrated the exact HTML structure, SVG pinwheel geometry, and auto-scaler from `Q004_Exact_HTML.zip`.
  - Added responsive scaling engine auto-fitting any iframe container ($1536 \times 1024\text{ px}$ stage baseline).
  - Enhanced vector icons for all four focus areas (`capability-management.svg`, `governance.svg`, `risk-management.svg`, `employee-engagement.svg`) with authentic Daimler styling and matching the approved reference design.
  - Linked official Daimler CS fonts via `fonts.css` and established strict compliance with Daimler Corporate Design tokens.
  - Connected bidirectional `DICVStorylineBridge` (`Q004_Done`, `Q004_Correct`, `Q004_Answers`, `Q004_Revealed`) while preserving backwards-compatible host `postMessage` protocol (`Q004_REQUEST_STATE`, `Q004_STATE`, `Q004_SUBMIT`, `Q004_REVEAL`, `Q004_RESET`).
  - Preserved atomic drag-and-drop replacement, swapping, dock return, order-independent 3-of-4 scoring, and review mode states.
  - Rebuilt standalone distribution in `WebObjects/dist/Q004_EHSFocusAreas/`.
  - Re-verified 100% pass across all quizzes (`Q001` through `Q006`) in automated regression test suite.

## [2.8.0] - 2026-11-13
### Added
- **Q006 (DICV Safety Review Structure) — 3-Scenario Modular Architecture:**
  - Implemented 3 independent scenario-based single-choice HTML Web Objects:
    - **`Q006_R1` (Organisation-wide Policy Review):** Apex Committee.
    - **`Q006_R2` (Critical Safety Performance Issue):** Sub Committee.
    - **`Q006_R3` (Machine-Guarding Improvement):** Ad-hoc Committee – Initiatives.
  - Implemented shared architecture template in `WebObjects/quizzes/Q006_SafetyReviewStructure/shared/` (`committee-data.js`, `committee-quiz.css`, `committee-quiz.js`).
  - Strict 16:9 widescreen layout ($1024 \times 576\text{ px}$) on 100% transparent viewport matching approved reference layout (`media_1794582148906_628c03ff.jpg`).
  - Visual components:
    - Dark Petrol top badge (`Safety Issue X of 3`).
    - 3-step numbered progress tracker with connecting line, completed checkmark badges, and active yellow ring.
    - Left scenario illustration box with high-resolution 3D industrial graphics and right scenario description text separated by a vertical Petrol divider.
    - Light Petrol question strip with custom dart target icon (`Which committee should review this issue?`).
    - 3 horizontally aligned committee cards with circular radio buttons, high-fidelity committee icons, and Daimler CS Bold typography.
    - Bottom-right Daimler stadium Submit button with forward arrow `→`, activated on choice selection.
  - Interactive radio selection, keyboard accessibility (Arrow keys, Space/Enter, Tab navigation), atomic state management, review mode badges (`✓ Correct`, `✗ Incorrect`), and locked post-submission state.
  - Bidirectional Articulate Storyline bridge variables per slide:
    - R1: `Q006_R1_Done`, `Q006_R1_Answer`, `Q006_R1_Correct`, `Q006_R1_Revealed`
    - R2: `Q006_R2_Done`, `Q006_R2_Answer`, `Q006_R2_Correct`, `Q006_R2_Revealed`
    - R3: `Q006_R3_Done`, `Q006_R3_Answer`, `Q006_R3_Correct`, `Q006_R3_Revealed`
  - Automated build script integration (`scripts/build_quiz.py`) packaging all 3 standalone Web Objects into `WebObjects/dist/Q006_R1/`, `dist/Q006_R2/`, and `dist/Q006_R3/`.
  - Added Q006 (R1, R2, R3) to automated regression test suite (`test_design_system_compliance.py`) with 100% pass across all quizzes.

## [2.7.0] - 2026-11-13
### Changed
- **Q005 (DICV Safety Culture Maturity) Readability & Layout Overhaul:**
  - Implemented vertical card structure matching reference architecture (icon centered on top, bold stage title centered on bottom).
  - Increased stage label typography to **`16px` upright Daimler CS Bold**, completely eliminating text truncation and word-wrapping for `Interdependent`.
  - Scaled drop targets to `198 × 88 px` with **`16.5px` high-contrast `"Drop here"` labels**.
  - Enhanced vertical clearance to maintain **19px clean separation** between Target 4 and the horizontal X-axis line.
  - Increased checkpoint marker numbers to **`22px` Daimler CS Bold** and Submit button text to **`21px`**.
  - Re-packaged standalone distribution in `WebObjects/dist/Q005_SafetyCultureMaturity/`.
  - Re-verified 100% pass across all 5 quizzes in automated regression test suite.

## [2.6.0] - 2026-11-13
### Changed
- **Q005 (DICV Safety Culture Maturity) UI Refinement:**
  - Removed redundant top capsule instruction banner per user directive to eliminate duplication with Storyline slide headers and keep slide characters completely unobstructed.
  - Sized canvas to an optimized widescreen format: `1110 × 600 px`.
  - Expanded graph area and raised the Bradley Injury Rate curve and drop targets, placing Target 4 comfortably 11px above the horizontal X-axis line.
  - Refined card typography and icon proportions so long labels (such as `Interdependent`) render on a single clean line without line breaks or ellipsis truncation.
  - Rebuilt standalone package in `WebObjects/dist/Q005_SafetyCultureMaturity/`.
  - Re-verified 100% pass across all 5 quizzes in automated regression test suite.

## [2.5.0] - 2026-11-13
### Added
- **Q005 (DICV Safety Culture Maturity):**
  - Implemented 4-stage drag-and-drop ordering along the Bradley Injury Rate curve ($1110 \times 660\text{ px}$ canvas).
  - SVG Injury Rate axes with capsule labels (`"Injury Rate"`, `"Increasing Safety Culture Maturity →"`).
  - Scalable descending Bradley Curve with smooth tapering right-arrow.
  - 4 numbered checkpoint markers (1, 2, 3, 4) in Daimler Yellow `#FFFF40` with Dark Petrol `#004355` border.
  - 4 descending drop targets (`stage-1`, `stage-2`, `stage-3`, `stage-4`) with dashed projection lines.
  - 4 draggable stage cards with vector SVG icons (`interdependent.svg`, `independent.svg`, `dependent.svg`, `reactive.svg`) in scrambled initial order.
  - Atomic drag engine supporting empty-target drop, occupied-target replacement, target-to-target swapping, and dock return.
  - Strict 100% sequence evaluation: `Reactive → Dependent → Independent → Interdependent`.
  - Review mode with per-target feedback badges (`✓ Correct`, `✕ Incorrect`, `Missed`) and authoritative correct sequence banner.
  - Bidirectional Storyline 360 bridge integration (`Q005_Done`, `Q005_Correct`, `Q005_Answers`, `Q005_Revealed`).
  - Added standalone export package in `WebObjects/dist/Q005_SafetyCultureMaturity/`.
  - Added Q005 to automated regression test suite (`test_design_system_compliance.py`) with 100% pass across Q001-Q005.

## [2.4.0] - 2026-11-13
### Changed
- **Q004 (DICV EHS Focus Areas) Reference Alignment:**
  - Replaced translucent Venn circles with the approved **3-color pinwheel cyclic Venn design**:
    - Top: Dark Petrol `#004355`
    - Bottom-Left: Petrol 80% `#007A93`
    - Bottom-Right: Daimler Yellow `#FFFF40`
  - Replaced flat intersection with elevated circular white **SAFETY Strategy** hub with shadow.
  - Implemented high-contrast in-zone dashed drop boxes (white on dark/petrol sections, dark petrol on yellow section).
  - Removed "OPTION A/B/C/D" prefixes from draggable cards; cards now display only the bold title, vector SVG icon, and a 6-dot drag handle grid (`:::`).
  - Added solid Dark Petrol `#004355` banner header to Focus Area Options panel with a thin Daimler Yellow `#FFFF40` underline (`3.5px`).
  - Updated Submit button to stadium pill with arrow icon (`Submit →`) and dynamic progress counter.
  - Re-packaged standalone distribution in `WebObjects/dist/Q004_EHSFocusAreas/`.
  - Re-verified 100% compliance across Q001-Q004 in automated regression suite.

## [2.3.0] - 2026-11-13
### Added
- **Q004 (DICV EHS Focus Areas):**
  - Implemented 3-zone drag-and-drop classification into a 3-circle symmetrical Venn diagram ($1110 \times 900\text{ px}$, 100% transparent outer viewport).
  - SVG Venn geometry ($r = 175\text{ px}$) with balanced equilateral layout and `pointer-events: none` on decorative circles to prevent drag interception.
  - Decorative central `"SAFETY Strategy"` intersection badge (non-droppable).
  - 4 standalone vector SVG icons: `capability-management.svg`, `governance.svg`, `risk-management.svg`, `employee-engagement.svg`.
  - Atomic drag state engine supporting empty-zone placement, occupied-zone replacement with displacement of 4th unplaced item back to pool, and zone-to-zone swapping.
  - Review mode Matrix: `CORRECT_SELECTED` (Green `#28A745`), `CORRECT_MISSED` (Amber `#E67E22`), `INCORRECT_SELECTED` (Red `#E03131`), `NEUTRAL` (Light Grey `#E6E6E6`).
  - Integrated bidirectional Storyline bridge (`Q004_Done`, `Q004_Correct`, `Q004_Answers`, `Q004_Revealed`).
  - Added standalone export package in `WebObjects/dist/Q004_EHSFocusAreas/`.
  - Included Q004 in automated regression test suite (`test_design_system_compliance.py`) with 100% pass across Q001-Q004.

## [2.2.0] - 2026-11-13
### Added
- **Q003 (DICV EHS Commitments):**
  - Implemented the modern **Frameless Floating Grid** ($1110 \times 900\text{ px}$) with 100% transparent viewport.
  - Removed question heading and instruction text from HTML per user directive to maximize visibility of Storyline characters and slide title.
  - Implemented crisp standalone **SVG icons** for all 5 options (`zero-harm.svg`, `safe-working-environment.svg`, `environmental-responsibility.svg`, `proactive-risk-prevention.svg`, `higher-production-output.svg`).
  - Implemented **Maximum 4 Selections State Machine**: dynamically dims the 5th card to `DISABLED_LIMIT` state ($40\%$ opacity, light-grey border, disabled cursor) when 4 selections are active.
  - Integrated bidirectional Storyline bridge (`Q003_Done`, `Q003_Correct`, `Q003_Answers`, `Q003_Revealed`).
  - Rebuilt standalone export package in `WebObjects/dist/Q003_EHSCommitments/`.
  - Added Q003 to automated regression test suite (`test_design_system_compliance.py`).

## [2.1.0] - 2026-11-13
### Added
- **Centralized Design System:** Created authoritative `theme.css`, `typography.css`, and `components.css` based strictly on the Daimler Truck Design Guidelines PDF.
- **Reference Image Interpretation Protocol:** Created `REFERENCE_INTERPRETATION.md` establishing that screenshots dictate structure only, while Daimler guidelines dictate visuals.
- **Master QA Framework:** Created `MASTER_QA_CHECKLIST.md`, `KNOWN_ISSUES.md`, and automated regression test suite.

### Changed
- **Q001 Harmonization:**
  - Standardized selected checkbox fill to **Daimler Yellow `#FFFF40`** with black checkmark.
  - Standardized card selected border to **Corporate Petrol `#00677F`** with soft petrol background `#F0F7F9`.
  - Harmonized typography to Daimler CS Bold (Upright).
- **Q002 Harmonization:**
  - Replaced golden yellow `#FFD100` / `#F0C020` with official **Daimler Yellow `#FFFF40`**.
  - Replaced solid black card outline `#11161B` with official **Corporate Petrol `#00677F`**.
  - Removed unapproved italics on question header and Submit button; standardized to **Daimler CS Bold (Upright)**.
  - Replaced dark graphite gaming pill with clean, professional corporate instruction typography.
  - Retained the 8-sided console contour with clean corporate white paneling and Daimler Yellow highlight.
- **Storyline Bridge Enhancement:**
  - Added 150ms active polling for `Qxxx_Revealed` variable changes.
  - Added 700ms auto-reveal fail-safe on submission.
  - Added 25ms delay between score commitment and submission trigger firing.

---

## [2.0.0] - 2026-11-13
### Added
- Initial implementation of Q002 (DICV Safety Commitments) with 3+2 grid and 5 icon cards.
- Bidirectional Storyline 360 bridge with variable persistence and review mode.
