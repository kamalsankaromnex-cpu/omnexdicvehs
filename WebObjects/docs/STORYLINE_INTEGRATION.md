# Storyline 360 Integration Protocol — Architecture & Runbook

This document defines the authoritative communication contract between DICV HTML5 Web Objects and Articulate Storyline 360, including lifecycle rules, variable binding, slide advance patterns, and common authoring pitfalls.

---

## 1. Core Architecture & Authority

1. **Canonical State Authority**: Articulate Storyline is the single durable state owner for learner submissions, scores, attempt IDs, and LMS resume persistence. The HTML Web Object iframe is transient and synchronizes with Storyline.
2. **Dual-Mode Communication**:
   - **Primary (Direct JS API)**: Dynamic on-demand resolution of `window.parent.GetPlayer()` and `window.top.GetPlayer()`.
   - **Secondary (postMessage Fallback)**: Bidirectional `postMessage` protocol for cross-domain or sandboxed LMS environments.

---

## 2. Direct Slide Advance vs. Feedback Layer Modes

Depending on instructional design requirements, a quiz operates in one of two modes:

### Mode A: Direct Slide Advance (Zero Feedback)
- Used when curriculum specifies immediate progression to the next slide upon clicking Submit without intermediate HTML popups or feedback layers.
- **Web Object Action**: Upon submission, the bridge sets `Qxxx_Done = false` followed immediately by `Qxxx_Done = true`.
- **Storyline Trigger**:
  - **Action**: `Jump to slide` -> `Next slide`
  - **When**: `Variable changes`
  - **Variable**: `Qxxx_Done`
  - **Condition**: *(Optional / leave blank, or `If Qxxx_Done == True`)*

### Mode B: Feedback Layer & Answer Reveal
- Storyline displays its own native Correct or Incorrect feedback layer.
- After learner dismisses the feedback layer, Storyline signals the Web Object via `QUIZ_REVEAL_ANSWERS` or sets `Qxxx_Revealed = true`.
- Web Object applies non-destructive `.is-revealed-correct` and `.is-revealed-incorrect` styling.

---

## 3. Critical Authoring Pitfalls & How They Are Resolved

### Pitfall 1: Storyline Desktop "Preview" Sandbox (Most Common)
> [!WARNING]
> **Web Objects DO NOT communicate with Storyline during Desktop Preview (F12 / Preview Slide).**
> Articulate Storyline 360's built-in desktop preview runs inside a sandboxed CEF container where `window.parent.GetPlayer` is blocked by CORS/sandbox restrictions (`SecurityError: Blocked a frame with origin "null"`).
> 
> **Testing Rule**: Web Object communication and slide advance MUST be tested in published output:
> 1. **Publish > Web** (opened in a local browser), OR
> 2. **Publish > Review 360**, OR
> 3. **Publish > LMS (SCORM 1.2 / 2004)**.

### Pitfall 2: The "Variable Was Already True" Storyline Trigger Quirk
In Storyline 360, the trigger *"When variable changes"* **only fires if the variable value transitions from its current value to a different value**.
- If `Qxxx_Done` was already `True` (from a previous test run or default variable value), executing `player.SetVar('Qxxx_Done', true)` is treated as a **no-op** by Storyline and the slide jump trigger will NOT execute.
- **The Codified Solution**: The bridge always executes a forced toggle:
  ```javascript
  p.SetVar('Qxxx_Done', false);
  p.SetVar('Qxxx_Done', true);
  ```
  This forces Storyline's internal event listener to fire on every submission.

### Pitfall 3: Asynchronous Player Initialization
At `t = 0` when the Web Object iframe loads, the Storyline parent window may still be initializing its JavaScript engine.
- If `GetPlayer()` is checked only once at initialization, the bridge captures `null` and never updates variables.
- **The Codified Solution**: The bridge dynamically queries `getPlayer()` on-demand at the exact moment the learner clicks Submit, traversing `window.parent`, `window.top`, and parent frame trees.

### Pitfall 4: Cross-Domain LMS Sandboxes (The postMessage Bridge)
If an LMS (like SAP SuccessFactors or Canvas) hosts SCORM content across different subdomains or strict sandbox iframes where direct `GetPlayer()` is blocked, the Web Object broadcasts a `postMessage`.
- **Storyline Slide Listener (100% Fail-Proof Fallback)**:
  Add an **Execute JavaScript** trigger on the slide (*When Timeline starts on this slide*):
  ```javascript
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'QUIZ_SUBMIT_REQUEST') {
      var p = GetPlayer();
      p.SetVar('Q001_Done', true);
    }
  });
  ```

---

## 4. Per-Quiz Variables Specification

| Variable Name | Type | Default | Purpose |
|---|---|---|---|
| `Qxxx_Done` | True/False | `False` | Submission flag. Triggers slide advance or feedback layer. |
| `Qxxx_Answers` | Text | `""` | JSON string of learner's selections (e.g. `["A","B"]`). |
| `Qxxx_Correct` | True/False | `False` | Correctness evaluation against approved curriculum key. |
| `Qxxx_Revealed` | True/False | `False` | Set after feedback dismiss to reveal approved answers in locked review mode. |

> [!NOTE]
> Variable names in Storyline are **case-sensitive**. Always verify that the variable created in Storyline matches `Qxxx_Done` exactly. As a defensive fallback, the bridge also sets lowercase `qxxx_done`.

---

## 5. Complete Web Object Inventory & Storyline Variable Contract

### 5.1 Quizzes (`Q001` – `Q006`)
| Web Object | Dist Folder | Format | Feedback Owner | Storyline Variables | Special Integration Notes |
|---|---|---|---|---|---|
| **Q001** Accident Prediction | `dist/Q001_AccidentPrediction/` | `1110×900` | **Storyline-owned** (no HTML feedback panel / Continue) | `Q001_Done`, `Q001_Answers`, `Q001_Correct`, `Q001_Revealed` | 4-option multi-select (`A+B+C+D`). Storyline shows feedback layers on `Q001_Done` + `Q001_Correct`. |
| **Q002** Safety Commitments | `dist/Q002_SafetyCommitments/` | `1110×900` / `1800×900` split | **In-object Two-Portion Panel** | `Q002_Done`, `Q002_Answers`, `Q002_Correct`, `Q002_Revealed`, `Q002_Continue`, `Q002_MEDIA_COMPLETE` | 5-option multi-select (`A+B+C+D+E`). Locked in split mode until Storyline calls `Q002_ON_MEDIA_COMPLETE()` / sets `Q002_MEDIA_COMPLETE`. |
| **Q003** EHS Commitments | `dist/Q003_EHSCommitments/` | `1110×900` | **In-object Two-Portion Panel** | `Q003_Done`, `Q003_Answers`, `Q003_Correct`, `Q003_Revealed`, `Q003_Continue` | 5-option multi-select with `MAX_SELECTIONS = 4` (`A+B+C+D`). |
| **Q004** EHS Focus Areas | `dist/Q004_EHSFocusAreas/` | `1536×1024` | **In-object Two-Portion Panel** + `#bonus-overlay` | `Q004_Done`, `Q004_Answers`, `Q004_Correct`, `Q004_Revealed`, `Q004_BonusCorrect`, `Q004_Continue`, `LivesRemaining` | Venn drag-and-drop / click-to-place (`A,B,C` in any 3 circles; `D` distractor). Bonus sets `LivesRemaining = 3` and `Q004_BonusCorrect`. |
| **Q005** Safety Culture Maturity | `dist/Q005_SafetyCultureMaturity/` | `1110×640` | **In-object Two-Portion Panel** | `Q005_Done`, `Q005_Answers`, `Q005_Correct`, `Q005_Revealed`, `Q005_Continue` | 4-stage Bradley curve sequence ordering (`1: reactive`, `2: dependent`, `3: independent`, `4: interdependent`). |
| **Q006_R2** Performance Issue | `dist/Q006_R2/` | `1024×576` | **In-object Two-Portion Panel** | `Q006_R2_Done`, `Q006_R2_Answer`, `Q006_R2_Correct`, `Q006_R2_Revealed`, `Q006_R2_Continue` | Round 1 of 3 (`R2 → R3 → R1` approved sequence). Correct: `sub` (`Sub Committee`). |
| **Q006_R3** Machine Guarding | `dist/Q006_R3/` | `1024×576` | **In-object Two-Portion Panel** | `Q006_R3_Done`, `Q006_R3_Answer`, `Q006_R3_Correct`, `Q006_R3_Revealed`, `Q006_R3_Continue` | Round 2 of 3. Correct: `adhoc` (`Ad-hoc Committee – Initiatives`). |
| **Q006_R1** Policy Review | `dist/Q006_R1/` | `1024×576` | **In-object Two-Portion Panel** | `Q006_R1_Done`, `Q006_R1_Answer`, `Q006_R1_Correct`, `Q006_R1_Revealed`, `Q006_R1_Continue` | Round 3 of 3. Correct: `apex` (`Apex Committee`). |

> [!NOTE]
> For `Q002–Q006`, clicking **Continue** inside the Two-Portion Feedback Panel sets `Qxxx_Continue = True` (using a `250ms` `false → true` reset-toggle if already `True`) and posts `QUIZ_CONTINUE_CLICKED`. Storyline should jump to the next slide when `Qxxx_Continue` changes, without showing duplicate Storyline visual feedback layers.

### 5.2 Global Headers, Course Map & Module Intro/Outro
| Web Object | Dist Folder | Storyline Variables Read / Written | Sync & Event Contract |
|---|---|---|---|
| **Header 1** | `dist/Header1/` | Reads `HeaderProfile`, `CourseProgressData`, `StarsEarned` (fallback `ModuleStars`), `LivesRemaining`. Writes `HeaderAction` (`OPEN_GUIDELINES`, `OPEN_MAP`, `TOGGLE_MUTE`, `EXIT_COURSE`, `TOGGLE_FULLSCREEN`). | Polls every `600ms` when embedded + listens for `HEADER1_SYNC` / `HEADER1_SET_PROFILE`; emits `HEADER1_READY` and `HEADER_ACTION`. |
| **Header 2** | `dist/Header2/` | Reads `CourseProgressData`, `M1_CompletedCount`, `Header2Title`. | Syncs on load + listens for `HEADER2_SYNC`; emits `HEADER2_READY`. |
| **Course Map** | `dist/CourseMap/` | Reads/writes `NavigationMode`, `CourseProgressData`, `RequestedMission`, `CourseMapCloseRequested`. | See [README_STORYLINE_SETUP.md](../coursemap/README_STORYLINE_SETUP.md) for Slide Master `CourseMapOverlay` triggers. |
| **Module 1 Intro** | `dist/Module1_Intro/` | Writes `M1_Intro_Done`, `M1_Intro_Continue`. | Conveyor-belt module intro; triggers slide advance on continue. |
| **Module 1 Outro** | `dist/Module1_Outro/` | Reads `LivesRemaining`. Writes `M1_Outro_Done`, `M1_Outro_Continue`. | Summary card + Star 1 celebration + animated hearts/stars; triggers advance on continue. |

### 5.3 Shared Web Audio SFX (`shared/audio/sfx.js`)
- Every quiz (`Q001–Q006`), `Header1`, and `Module1_Outro` bundles `sfx.js` (synthesized Web Audio API, zero external `.mp3`/`.wav` assets, 100% offline/SCORM-safe).
- Clicking **Mute** in `Header1` updates `localStorage` (`dicv_sfx_muted`) and broadcasts `{ type: 'SFX_MUTE_CHANGED', muted }` across sibling frames so Web Object SFX (`click`, `select`, `deselect`, `drop`, `limit`, `correct`, `incorrect`, `heart_lost`, `heart_gain`, `star`) mute in sync with Storyline audio.
