# DICV Interactive Safety eLearning — Complete Quiz UI/UX Review
## Modern Minimal + Comic Storytelling + Game-Based Learning Audit & Design Proposal (Revised)

**Project Root:** `D:\Development\Projects\dicv-interactive`  
**Scope:** Q001, Q002, Q003, Q004, Q005, and Q006 (R1, R2, R3)  
**Document Status:** AUDIT & DESIGN PROPOSAL ONLY (No production quiz code modified)  
**Framework:** 50% Modern Minimal UI · 30% Game-Based Interaction · 20% Comic-Style Storytelling  
**Platform:** Articulate Storyline 360 HTML5 Web Objects · Oracle LMS SCORM  

> [!IMPORTANT]
> **MANDATORY TEXT CONSTRAINT COMPLIANCE:**
> This revised audit strictly enforces the **Zero Additional Learner-Facing Text** rule. All proposed modernizations rely exclusively on visual hierarchy, typography refinement, card elevation, responsive layout, motion physics, and visual feedback states. The exact approved wording of every question, instruction, card label, drop-zone placeholder, scenario description, progress string, and button is preserved without modification. No new character dialogue, mission titles, counters, badges, or scoring systems are introduced.

---

## 1. Executive Summary & Holistic Assessment

The DICV Interactive Safety eLearning curriculum comprises **six core interactive quizzes** (distributed across 8 standalone HTML Web Objects in Articulate Storyline 360 slides). Each quiz was engineered to evaluate critical EHS knowledge points, ranging from hazard recognition and corporate commitments to strategic frameworks, cultural maturity, and governance escalation.

### Current Cross-Quiz Divergence

While the functional logic and Storyline bridges are operational, the visual presentations reflect asynchronous development iterations:

1. **Inconsistent Container Boundaries:** Q001 uses a heavy rectangular card ($806 \times 962\text{ px}$) with a solid header bar; Q002 features a yellow chamfered/cut-corner outer frame ($1110 \times 900\text{ px}$) with a gradient capsule; Q003 is completely frameless on transparent glass ($1110 \times 900\text{ px}$); Q004 uses a rounded card ($1536 \times 1024\text{ px}$ scaled); Q005 utilizes an open technical coordinate graph ($1110 \times 640\text{ px}$); and Q006 utilizes a compact 16:9 card ($1024 \times 576\text{ px}$).
2. **Disparate Heading & Instruction Treatments:** Q001 uses a full-width Dark Petrol block header; Q002 uses an italicized stadium capsule; Q003 omits the header inside HTML; Q004 places the header inside a right-hand panel; Q005 uses technical axis labels; and Q006 uses a compact Dark Petrol badge (`Safety Issue X of 3`).
3. **Uneven Interactive Micro-Feedback:** Hover and selection feedback ranges from basic checkbox toggles (Q001, Q002) to full-card perimeter highlights (Q003), drag-and-drop replacement (Q004, Q005), and radio card selections (Q006).
4. **Untapped Storyline Comic Synergy:** Characters (Meister, Torq, Aura) are currently presented in Storyline slide backgrounds without tight visual alignment to the interactive canvas.

### The Modern Industrial Comic-Game Design Direction

The proposed design language modernizes the learner experience through three complementary pillars **without altering curriculum text**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DAIMLER TRUCK SHOPFLOOR                         │
│   [Storyline Navigation | Life Meter: ♥♥♥ | Reward Stars: ★★★]         │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   [Meister / Torq Character]   ┌───────────────────────────────────┐   │
│   • Storyline Character Art    │   MODERN MINIMAL INTERACTIVE      │   │
│   • Approved Course Dialogue   │   WEB OBJECT CANVAS               │   │
│   • Expressive Comic Poses     │                                   │   │
│   • Feedback Layer Reactions   │   • 50% Modern Minimal Styling    │   │
│                                │   • 30% Tactile Micro-Interactions│   │
│                                │   • 20% Visual Comic Dynamics     │   │
│                                │   • EXACT APPROVED TEXT ONLY      │   │
│                                │                                   │   │
│                                │   [Submit Button ➜]               │   │
│                                └───────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

- **50% Modern Minimal UI:** Clean, floating surfaces, generous whitespace, unified Daimler CS typography (upright bold, no italics), restrained borders, and standard Daimler Petrol stadium buttons (`Submit ➜`).
- **30% Game-Based Interaction:** Tactile card elevation on hover/select, animated checkpoint discs, smooth magnetic snap-to-target drag physics, and non-destructive post-submission review states.
- **20% Comic Storytelling:** Expressive character poses (curious, inspecting, proud, encouraging) in Storyline, with directional attention cues guiding the learner toward the interactive HTML canvas.

---

## 2. Evidence-Based Functional Verification Status

To ensure complete transparency regarding technical readiness, each quiz has been evaluated across five verification tiers:

| Quiz ID | Quiz Title / Interaction | 1. Source Inspected | 2. Browser Tested | 3. Storyline Tested | 4. LMS Tested | Current Technical Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **`Q001`** | Accident Prediction (Multi-Select Photo Cards) | **YES** | **YES** | **YES** | *Not Verified* | Functional in published Web; pending live Oracle LMS staging test. |
| **`Q002`** | Safety Commitments (5-of-5 Multi-Select Grid) | **YES** | **YES** | **YES** | *Not Verified* | Functional in published Web; resolved CEF sandbox & reveal polling defects. |
| **`Q003`** | EHS Commitments (4-of-5 Constrained Selection) | **YES** | **YES** | **YES** | *Not Verified* | Functional in published Web; 4-card cap & disabled limit verified. |
| **`Q004`** | EHS Focus Areas (3-Zone Pinwheel Venn DND) | **YES** | **YES** | **YES** | *Not Verified* | Functional in published Web; exact HTML integration & atomic swapping verified. |
| **`Q005`** | Safety Culture Maturity (4-Stage Curve DND) | **YES** | **YES** | **YES** | *Not Verified* | Functional in published Web; bridge contract fixed (DICV-QA-004); sequence verified. |
| **`Q006_R1`**| Safety Review Structure — Round 1 Policy Review | **YES** | **YES** | **YES** | *Not Verified* | Functional in published Web; modular architecture & Apex mapping verified. |
| **`Q006_R2`**| Safety Review Structure — Round 2 Performance | **YES** | **YES** | **YES** | *Not Verified* | Functional in published Web; Sub Committee mapping verified. |
| **`Q006_R3`**| Safety Review Structure — Round 3 Machine Guard | **YES** | **YES** | **YES** | *Not Verified* | Functional in published Web; Ad-hoc Committee mapping verified. |

*Definitions:*
- **Source Inspected:** Direct code audit of HTML, CSS, JavaScript, and Storyline bridge API contracts.
- **Browser Tested:** Standalone rendering and interaction testing in Chrome/Edge across initial, selected, and review states.
- **Storyline Tested:** Verification of variable updates (`Qxxx_Done`, `Qxxx_Correct`, `Qxxx_Answers`, `Qxxx_Revealed`) in published Web output (`story.html`).
- **LMS Tested:** Formal SCORM 1.2 / 2004 compliance test inside Oracle LMS staging (scheduled for final course build).

---

## 3. Quiz-by-Quiz In-Depth UI/UX Review & Proposals

---

### Q001 — Accident Prediction
**Interaction Type:** Multiple-Selection Visual Hazard Spotting  
**Working Canvas:** $806 \times 962\text{ px}$ (Framed Card)  
**Approved Question:** *"Which of these people will experience the next accident?"*  
**Approved Instruction:** *"Select the option(s) you think apply."*  
**Approved Options:**  
- `A. Employee walking`  
- `B. MHE operator`  
- `C. Maintenance technician`  
- `D. Employee using a ladder`  
**Approved Footer Text:** *"Choose an answer to continue."* / *"Click Submit to commit your selections."*  
**Approved Answer Key:** `['A', 'B', 'C', 'D']` (Core EHS training principle: *Any* worker can experience the next accident if hazards remain unmanaged).

#### A. Current Visual Issues (Supported by Source & Screenshots)
- **Heavy Block Header:** A solid Dark Petrol `#004355` rectangular bar spans edge-to-edge across the top ($130\text{ px}$ tall), giving the quiz a dated, top-heavy appearance.
- **Checkbox Disconnect:** Each option card places a small square checkbox on the far left, separated from the photograph and text. This weakens the affordance of the card as a unified clickable object.
- **Redundant Reset Button:** The footer includes a "Reset" button alongside the "Submit" button. In a checkbox multi-select where learners can simply click a card again to deselect, a secondary Reset button adds unnecessary interface clutter.
- **Nested Card Borders:** Multiple layers of nested borders (outer canvas border, card borders, image thumbnail borders) create visual noise.

#### B. Proposed Modern Minimal Changes (Zero Additional Text)
- **Refined Header Architecture:** Replace the solid dark block with a clean, upright title in Daimler CS Bold ($26\text{ px}$, Dark Petrol `#004355`) on a light surface with an elegant $4\text{ px}$ Daimler Yellow underline.
- **Integrated Photographic Cards:** Redesign the four options as unified cards where the photo ($160 \times 110\text{ px}$, $10\text{ px}$ corner radius) sits flush within the card layout.
- **Card-Level Selection State:** Clicking anywhere on the card toggles its selection. Selected cards receive a crisp $2.5\text{ px}$ Corporate Petrol border (`#00677F`), subtle background tint (`#F0F7F9`), and a Daimler Yellow checkmark indicator (`#FFFF40`) in place of the plain grey checkbox.
- **Streamlined Footer:** Retain only the approved Submit button (`Submit ➜`) and the approved dynamic helper text (*"Choose an answer to continue."*). Remove the redundant Reset button.

#### C. Elements That Must Remain Unchanged
- Exact approved question title, instruction, option labels, and footer status text.
- Multiple-selection logic and approved answer key: `['A', 'B', 'C', 'D']`.
- Canvas dimensions: $806 \times 962\text{ px}$.
- Storyline variables: `Q001_Done`, `Q001_Correct`, `Q001_Answers`, `Q001_Revealed`.

#### D. Comic-Style Enhancements (Storyline Layer Only)
- **Character Alignment:** In Storyline, position **Torq** at the left side wearing clear safety glasses, with an alert, focused pointing pose directed toward the photo options.
- **Feedback Layer Animation:** On feedback display, Torq demonstrates an expressive reaction (thumbs-up for all 4 identified, or thoughtful reflection if fewer were selected) using approved course animations.

#### E. Game-Interaction Enhancements (No Text Added)
- **Tactile Card Hover:** $140\text{ ms}$ smooth elevation lift ($2\text{ px}$ upward translation with soft shadow `box-shadow: 0 6px 18px rgba(0, 67, 85, 0.12)`).
- **Selection Affirmation:** Immediate $180\text{ ms}$ micro-spring scale (`transform: scale(1.012)`) upon card toggle.
- **Submit Transition:** Submit button smoothly transitions from disabled light grey (`#E6E6E6`) to active Corporate Petrol (`#00677F`) the moment $\ge 1$ card is selected.

#### F. Potential Storyline & Accessibility Risks
- Checkboxes must retain explicit ARIA roles (`role="checkbox" aria-checked="true/false"`) for keyboard navigation (`Tab`, `Space`, `Enter`).
- Aspect ratio of photos must be preserved with `object-fit: cover` to avoid distorting worker equipment.

#### G. Verification & Before-and-After Comparison
- **Evidence Level:** Source Inspected · Browser Tested · Storyline Tested.
- **Current Live Capture:** [`screenshots/Q001_rendered_806x962.png`](file:///D:/Development/Projects/dicv-interactive/WebObjects/dist/Q001_AccidentPrediction/assets/reference.png)

```
[CURRENT Q001 LAYOUT]                     [PROPOSED MODERNIZED Q001]
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│ ██████████ HEADER █████████████ │       │ Which of these people will      │
│ Which of these people will...   │       │ experience the next accident?   │
│ ═══════════════════════════════ │       │ ─────────────────────────────── │
│ Select the option(s)...         │       │ Select the option(s) you think..│
│ ┌─────────────────────────────┐ │       │ ┌─────────────────────────────┐ │
│ │ [x] [ Photo ] A. Employee...│ │  ──>  │ │ [✓] [ Photo ] A. Employee..│ │
│ └─────────────────────────────┘ │       │ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │       │ ┌─────────────────────────────┐ │
│ │ [ ] [ Photo ] B. MHE...     │ │       │ │ [ ] [ Photo ] B. MHE...     │ │
│ └─────────────────────────────┘ │       │ └─────────────────────────────┘ │
│ [Reset]              [Submit >] │       │ Choose an answer...  [Submit ➜] │
└─────────────────────────────────┘       └─────────────────────────────────┘
```

---

### Q002 — Safety Commitments
**Interaction Type:** Multi-Select Discovery (Select All 5 Valid Corporate Commitments)  
**Working Canvas:** $1110 \times 900\text{ px}$ (Framed Grid)  
**Approved Question:** *"What should a company commit to for a safer workplace?"*  
**Approved Instruction:** *"Select all that apply. >"*  
**Approved Options:**  
- `The safety and well-being of employees`  
- `Protecting the environment`  
- `Using energy responsibly`  
- `Reducing risks and continuously improving`  
- `Ensuring compliance and active participation in safety`  
**Approved Footer Text:** *"Choose one or more answers to continue."*  
**Approved Answer Key:** All 5 Cards (Commitments 1, 2, 3, 4, 5).

#### A. Current Visual Issues (Supported by Source & Screenshots)
- **Cut-Corner Outer Border Frame:** A heavy yellow chamfered/cut-corner outer border surrounds the canvas, resembling an outdated sci-fi gaming HUD rather than clean Daimler Truck architecture.
- **Italicized Gradient Capsule:** The top question header sits in an embossed dark-to-light gradient capsule with italic text, directly violating the Daimler Brand Guideline prohibition against unauthorized italics and gradient bevels.
- **Black Subtitle Capsule:** The instruction (*"Select all that apply. >"*) is contained within a solid black capsule badge, creating an unnecessary third container layer.
- **Uneven Spacing in 3+2 Grid:** The bottom two cards float with wide empty margins on either side.

#### B. Proposed Modern Minimal Changes (Zero Additional Text)
- **Eliminate Cut-Corner Outer Frame:** Remove the heavy polygonal border. Present the cards on a clean, modern floating surface that integrates seamlessly with the Storyline shopfloor.
- **Upright Typography Hierarchy:** Replace the gradient capsule with a clean, centered title in **Daimler CS Bold (Upright, $26\text{ px}$, Dark Petrol `#004355`)**, accompanied by the approved instruction below in Daimler CS Regular ($16\text{ px}$).
- **Balanced 3+2 Architectural Grid:** Optimize card widths ($330\text{ px}$ top row, $380\text{ px}$ bottom row) and heights ($220\text{ px}$) with $18\text{ px}$ border-radius, creating visual balance across the $1110\text{ px}$ canvas.
- **Refined Icon Enclosures:** Standardize icon circles ($72 \times 72\text{ px}$) in a subtle soft Petrol surface (`#E8F5F8`) with clean vector line icons.

#### C. Elements That Must Remain Unchanged
- Exact approved question, instruction, card texts, and status strings.
- 5-of-5 scoring criteria (all 5 cards must be selected for Correct).
- Canvas dimensions: $1110 \times 900\text{ px}$.
- Storyline variables: `Q002_Done`, `Q002_Correct`, `Q002_Answers`, `Q002_Revealed`.

#### D. Comic-Style Enhancements (Storyline Layer Only)
- **Character Alignment:** In Storyline, position **Meister** at the center-left in an attentive, open-posture pose, gesturing toward the commitment board.
- **Feedback Layer Animation:** On slide completion, Meister performs an approving gesture on the Storyline feedback layer.

#### E. Game-Interaction Enhancements (No Text Added)
- **Synchronous Card Stagger:** On slide entrance, cards fade in with a refined $30\text{ ms}$ upward stagger ($200\text{ ms}$ total).
- **Selection State Elevation:** On click, selected cards lift by $3\text{ px}$ with a Corporate Petrol border (`#00677F`), subtle yellow corner tick, and elevated shadow (`box-shadow: 0 8px 20px rgba(0, 67, 85, 0.14)`).
- **Submit Button Illumination:** The Submit button activates smoothly with a forward arrow transition as soon as selections are made.

#### F. Potential Storyline & Accessibility Risks
- Contrast of yellow checkmark accents inside cards must be checked against white card backgrounds (ensure dark border outline on checkboxes).

#### G. Verification & Before-and-After Comparison
- **Evidence Level:** Source Inspected · Browser Tested · Storyline Tested.
- **Current Live Capture:** [`screenshots/Q002_rendered_default.png`](file:///C:/Users/CIE/.gemini/antigravity/brain/4030faa2-1380-4647-982b-d73a06809da8/Q002_rendered_default.png)

```
[CURRENT Q002 LAYOUT]                     [PROPOSED MODERNIZED Q002]
/═══ [What should a company...?] ═══\     What should a company commit to...?
│         [Select all that apply. >]│     Select all that apply.
│ ┌─────┐   ┌─────┐   ┌─────┐       │     ┌───────┐  ┌───────┐  ┌───────┐
│ │ [x] │   │ [x] │   │ [x] │       │     │  (ic) │  │  (ic) │  │  (ic) │
│ └─────┘   └─────┘   └─────┘       │ ──> │Text 1 │  │Text 2 │  │Text 3 │
│     ┌─────┐       ┌─────┐         │     └───────┘  └───────┘  └───────┘
│     │ [x] │       │ [x] │         │        ┌─────────┐   ┌─────────┐
│     └─────┘       └─────┘         │        │  Text 4 │   │  Text 5 │
\════════════ [Submit >] ═══════════/        └─────────┘   └─────────┘
                                                  [Submit ➜]
```

---

### Q003 — EHS Vision
**Interaction Type:** Constrained Multi-Selection (Select Exactly 4 Correct Vision Goals from 5; 1 Distractor)  
**Working Canvas:** $1110 \times 900\text{ px}$ (Floating Frameless Grid)  
**Approved Options:**  
- `Zero harm to people`  
- `Safe working environment`  
- `Environmental responsibility`  
- `Proactive risk prevention`  
- `Higher production output` (Distractor)  
**Approved Footer Text:** *"Choose up to 4 options to continue."* / *"X of 4 selected."*  
**Approved Answer Key:** Options A, B, C, D (E is incorrect distractor).

#### A. Current Visual Issues (Supported by Source & Screenshots)
- **Abrupt Top Edge:** Because Q003 is frameless without an internal header, the cards begin near the top without visual framing inside the interaction area.
- **Tight Multi-Line Typography:** Card labels (particularly *"Environmental responsibility"* and *"Ensuring compliance..."*) have compressed line-heights, creating uneven spacing between lines.
- **Disabled-State Ambiguity:** When the 4th card is selected, the remaining 5th card becomes unselectable (`DISABLED_LIMIT`), but its visual transition is subtle, occasionally leading learners to wonder if the interface is unresponsive.

#### B. Proposed Modern Minimal Changes (Zero Additional Text)
- **Card Proportions & Typography:** Standardize card padding ($24\text{ px}$) and line-height ($1.30$), rendering labels in upright Daimler CS Bold ($18\text{ px}$, Dark Petrol `#004355`).
- **Elevated Floating Surfaces:** Retain the clean frameless layout, but add refined dual-layer ambient shadows (`box-shadow: 0 4px 16px rgba(0, 67, 85, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)`) to give the floating cards physical presence over the shopfloor.
- **Visual Limit Feedback:** When 4 cards are selected, smoothly transition the unselected 5th card to a muted visual state (`opacity: 0.55; cursor: not-allowed;`) with a soft dashed grey border, making the 4-selection limit visually obvious without adding new text.

#### C. Elements That Must Remain Unchanged
- Exact approved card texts and footer progress strings (*"Choose up to 4 options to continue."* / *"X of 4 selected."*).
- 4-of-5 selection limit logic and scoring criteria (A, B, C, D correct; E distractor).
- Canvas dimensions: $1110 \times 900\text{ px}$.
- Storyline variables: `Q003_Done`, `Q003_Correct`, `Q003_Answers`, `Q003_Revealed`.

#### D. Comic-Style Enhancements (Storyline Layer Only)
- **Character Alignment:** In Storyline, position **Aura** on the right side holding a digital EHS tablet with an observant, encouraging posture.
- **Feedback Layer Animation:** On feedback layer start, Aura reacts with an affirmative stance if all 4 EHS goals are chosen, or a thoughtful guiding gesture if the production distractor was included.

#### E. Game-Interaction Enhancements (No Text Added)
- **Kinetic Constraint Feedback:** If a learner attempts to click a 5th card when 4 are already active, trigger an immediate $180\text{ ms}$ subtle horizontal card nudge (`translateX: ±3px`), providing clear kinetic feedback that the limit is active.
- **Progress Counter Fluidity:** Ensure the existing approved counter string (*"X of 4 selected."*) updates smoothly with numeric roll transitions.

#### F. Potential Storyline & Accessibility Risks
- When the 5th card is disabled, ensure `aria-disabled="true"` is set, and screen readers can still read the card label.

#### G. Verification & Before-and-After Comparison
- **Evidence Level:** Source Inspected · Browser Tested · Storyline Tested.
- **Current Live Capture:** [`screenshots/Q003_rendered_default.png`](file:///C:/Users/CIE/.gemini/antigravity/brain/4030faa2-1380-4647-982b-d73a06809da8/Q003_rendered_default.png)

```
[CURRENT Q003 LAYOUT]                     [PROPOSED MODERNIZED Q003]
┌───────┐  ┌───────┐  ┌───────┐           ┌───────┐  ┌───────┐  ┌───────┐
│ [ ]ic │  │ [ ]ic │  │ [ ]ic │           │  (ic) │  │  (ic) │  │  (ic) │
│ Text  │  │ Text  │  │ Text  │           │ Text  │  │ Text  │  │ Text  │
└───────┘  └───────┘  └───────┘     ──>   └───────┘  └───────┘  └───────┘
   ┌───────┐   ┌───────┐                     ┌───────┐   ┌───────┐
   │ [ ]ic │   │ [ ]ic │                     │  (ic) │   │  (ic) │
   │ Text  │   │ Text  │                     │ Text  │   │ Text  │
   └───────┘   └───────┘                     └───────┘   └───────┘
          [Submit >]                                [Submit ➜]
       2 of 4 selected.                          2 of 4 selected.
```

---

### Q004 — EHS Focus Areas
**Interaction Type:** Three-Zone Drag-and-Drop Classification (Cyclic Pinwheel Venn Diagram)  
**Working Canvas:** $1536 \times 1024\text{ px}$ (Responsive Auto-Scaling Stage)  
**Approved Diagram Text:** `SAFETY Strategy` (Center Hub)  
**Approved Drop Zone Placeholders:**  
- Zone 1: `+ \n Focus Area 1 \n Drop focus area \n card here`  
- Zone 2: `+ \n Focus Area 2 \n Drop focus area \n card here`  
- Zone 3: `+ \n Focus Area 3 \n Drop focus area \n card here`  
**Approved Panel Header:** `Focus Area Options`  
**Approved Panel Instruction:** `Drag the three correct focus areas into the circles.`  
**Approved Options:**  
- `Capability Management` (Correct)  
- `Governance` (Correct)  
- `Risk Management` (Correct)  
- `Employee Engagement` (Distractor)  
**Approved Progress String:** `X of 3 focus areas placed.` / `Review: Capability Management, Governance and Risk Management are correct.`  
**Approved Answer Key:** Three correct focus areas in any target order (Employee Engagement is distractor).

#### A. Current Visual Issues (Supported by Source & Screenshots)
- **High Canvas Coordinate Base:** The $1536 \times 1024\text{ px}$ coordinate system auto-scales down effectively, but drop zone dashed strokes and card drag handles can look thick when scaled down into smaller Storyline containers.
- **Drop Zone 3 Contrast Balance:** Zone 3 sits on the Daimler Yellow lobe and uses Dark Petrol dashed borders and text. While contrast-compliant, its visual weight appears heavier than Zones 1 and 2, which use white borders.
- **Drag Target Proximity Feedback:** The hover highlight when dragging near an empty lobe is relatively subtle.

#### B. Proposed Modern Minimal Changes (Zero Additional Text)
- **Refined Dashed Border Weights:** Standardize drop zone dashed stroke widths ($3\text{ px}$) to ensure equal visual gravity across all three lobes while maintaining the exact approved placeholder text.
- **Tactile Drag Elevation:** Apply a realistic $12\text{ px}$ elevation shadow (`box-shadow: 0 14px 28px rgba(0, 40, 50, 0.22)`) and micro-rotation ($1^\circ$) while dragging cards, making the cards feel physical and responsive.
- **Seamless Card Nesting:** Optimize padding and typography of cards when nested inside drop zones, ensuring card labels and vector icons maintain clean proportions.

#### C. Elements That Must Remain Unchanged
- Exact cyclic pinwheel SVG geometry (Dark Petrol top, Petrol 80% bottom-left, Daimler Yellow bottom-right).
- Exact text inside central hub (`SAFETY Strategy`) and all three drop zone placeholders.
- Exact options panel header (`Focus Area Options`), instruction, and card labels.
- Order-independent 3-of-4 scoring criteria.
- Storyline variables: `Q004_Done`, `Q004_Correct`, `Q004_Answers`, `Q004_Revealed`.

#### D. Comic-Style Enhancements (Storyline Layer Only)
- **Character Alignment:** In Storyline, position **Meister** and **Torq** on the slide perimeter. Meister reviews a technical blueprint while Torq gestures toward the interactive pinwheel.
- **Feedback Layer Animation:** On feedback display, characters celebrate the strategic alignment with approved course animations.

#### E. Game-Interaction Enhancements (No Text Added)
- **Magnetic Snap Target Pulse:** When a dragged card enters within $60\text{ px}$ of a drop target, the receiving lobe illuminates with a soft border glow.
- **Smooth Displaced Card Arc:** When an occupied lobe receives a new card, smoothly animate the displaced card gliding back to the pool in a $220\text{ ms}$ transition.
- **Convergence Pulse:** When all 3 targets are filled, trigger a subtle, elegant light pulse connecting the three lobes inward toward the central `SAFETY Strategy` hub.

#### F. Potential Storyline & Accessibility Risks
- Touch drag-and-drop must maintain fallbacks for click-to-select and keyboard navigation (`Enter`/`Space` on card, then `Enter`/`Space` on target).

#### G. Verification & Before-and-After Comparison
- **Evidence Level:** Source Inspected · Browser Tested · Storyline Tested.
- **Current Live Capture:** [`screenshots/Q004_rendered_default.png`](file:///C:/Users/CIE/.gemini/antigravity/brain/4030faa2-1380-4647-982b-d73a06809da8/Q004_rendered_default.png)

```
[CURRENT Q004 LAYOUT]                     [PROPOSED MODERNIZED Q004]
┌───────────────────┬──────────────┐      ┌───────────────────┬──────────────┐
│       (Dark)      │ Focus Area   │      │       (Dark)      │ Focus Area   │
│       [Zone 1]    │ Options      │      │       [Zone 1]    │ Options      │
│   (SAFETY Strategy│ ──────────── │      │   (SAFETY Strategy│ ──────────── │
│ (Petrol)  (Yellow)│ [Card A] ::: │ ──>  │ (Petrol)  (Yellow)│ [Card A] ::: │
│ [Zone 2]  [Zone 3]│ [Card B] ::: │      │ [Zone 2]  [Zone 3]│ [Card B] ::: │
│                   │ [Card C] ::: │      │                   │ [Card C] ::: │
│                   │ [Card D] ::: │      │                   │ [Card D] ::: │
│                   │ [ Submit ➜ ] │      │                   │ [ Submit ➜ ] │
└───────────────────┴──────────────┘      └───────────────────┴──────────────┘
```

---

### Q005 — Safety Culture Maturity
**Interaction Type:** Drag-and-Drop Sequencing / Ordering along the Bradley Curve  
**Working Canvas:** $1110 \times 640\text{ px}$ (Open Graph on Transparent Viewport)  
**Approved Axis Labels:** `Injury Rate` (Vertical), `Increasing Safety Culture Maturity ➔` (Horizontal)  
**Approved Checkpoint Markers:** `1`, `2`, `3`, `4`  
**Approved Drop Target Labels:** `Drop here`  
**Approved Stage Cards:**  
- `Interdependent`  
- `Independent`  
- `Dependent`  
- `Reactive`  
**Approved Sequence Key:** 1: Reactive → 2: Dependent → 3: Independent → 4: Interdependent.

#### A. Current Visual Issues (Supported by Source & Screenshots)
- **Vertical Spacing Tightness:** At $640\text{ px}$ canvas height, the vertical projection from the Bradley Curve to Target 4 leaves only $19\text{ px}$ of clearance above the horizontal axis.
- **Empty Dock Gaps:** When cards are dragged onto the curve, the bottom dock displays plain empty gaps without visual anchoring.
- **Text Length Balance:** The word *"Interdependent"* is significantly longer than *"Reactive"*, requiring strict padding controls to prevent text wrapping or clipping.

#### B. Proposed Modern Minimal Changes (Zero Additional Text)
- **Architectural Ghost Docking Bays:** In the bottom dock, render subtle rounded dashed placeholders (`border: 1.5px dashed #A6CAD8; background: rgba(240, 247, 249, 0.40)`) in empty slots, maintaining balanced visual structure when cards are placed.
- **Refined Projection Lines:** Connect the numbered checkpoint discs (1, 2, 3, 4) to their drop targets with crisp $2\text{ px}$ vertical dashed guide lines in soft Petrol (`#79AEBF`).
- **Precision Card Sizing:** Standardize dock cards at $200 \times 84\text{ px}$ with $16\text{ px}$ rounded corners, placing the vector stage icon centered above the upright bold label in Daimler CS Bold ($16\text{ px}$).

#### C. Elements That Must Remain Unchanged
- Exact approved axis labels (`Injury Rate`, `Increasing Safety Culture Maturity ➔`).
- Numbered checkpoints (1, 2, 3, 4) and target labels (`Drop here`).
- Four stage names and correct maturity sequence.
- Avoid any visual effects that imply numerical injury rates or specific quantitative statistics.
- Canvas dimensions: $1110 \times 640\text{ px}$.
- Storyline variables: `Q005_Done`, `Q005_Correct`, `Q005_Answers`, `Q005_Revealed`.

#### D. Comic-Style Enhancements (Storyline Layer Only)
- **Character Alignment:** In Storyline, position **Torq** on the left near the Reactive checkpoint and **Aura** on the right near the Interdependent checkpoint.
- **Feedback Layer Animation:** Characters celebrate the complete cultural progression with approved Storyline animations upon submission.

#### E. Game-Interaction Enhancements (No Text Added)
- **Checkpoint Lock-In Pulse:** When a stage card drops into a checkpoint target, the yellow circle marker illuminates with a brief $200\text{ ms}$ pulse ring.
- **Curve Illumination Flow:** As targets are filled from left to right, illuminate the line of the Bradley Curve connecting those checkpoints in Daimler Yellow `#FFFF40`, visually reinforcing the downward progress of injury rates!
- **Fluid Swapping Transition:** Dragging a stage card directly onto an already-occupied target swaps their positions with a smooth $200\text{ ms}$ spring curve.

#### F. Potential Storyline & Accessibility Risks
- Checkpoints and drop targets must support keyboard focus and sequential selection.

#### G. Verification & Before-and-After Comparison
- **Evidence Level:** Source Inspected · Browser Tested · Storyline Tested.
- **Current Live Capture:** [`screenshots/Q005_v5_rendered_default.png`](file:///C:/Users/CIE/.gemini/antigravity/brain/4030faa2-1380-4647-982b-d73a06809da8/Q005_v5_rendered_default.png)

```
[CURRENT Q005 LAYOUT]                     [PROPOSED MODERNIZED Q005]
│ Injury Rate                             │ Injury Rate
▲   (1)                                   ▲   (1)
│    :   (2)                              │    :   (2)
│   [T1]  :   (3)                         │   [T1]  :   (3)
│        [T2]  :   (4)              ──>   │        [T2]  :   (4)
│             [T3]  :                     │             [T3]  :
│                  [T4]                   │                  [T4]
└─────────────────────────────►           └─────────────────────────────►
   Increasing Safety Culture...              Increasing Safety Culture...
 [Card 1] [Card 2] [Card 3] [Submit ➜]     [Bay 1]  [Bay 2]  [Bay 3]  [Submit ➜]
```

---

### Q006 — Safety Review Structure (Rounds 1, 2, and 3)
**Interaction Type:** Scenario-Based Single-Choice Committee Selection (3 Slides, 3 Web Objects, 1 Template)  
**Working Canvas:** $1024 \times 576\text{ px}$ (16:9 Widescreen Ratio on Transparent Viewport)  
**Approved Header Badge:** `Safety Issue 1 of 3` / `Safety Issue 2 of 3` / `Safety Issue 3 of 3`  
**Approved Scenarios:**  
- **Round 1:** `An organisation-wide safety policy requires review and update based on recent analysis.`  
- **Round 2:** `A production area has a critical, long-pending safety performance issue that needs a conclusive decision.`  
- **Round 3:** `A machine-guarding improvement needs to be implemented across relevant areas for consistent application.`  
**Approved Question:** `Which committee should review this issue?`  
**Approved Options:**  
- `Apex Committee`  
- `Sub Committee`  
- `Ad-hoc Committee – Initiatives`  
**Approved Answer Keys:**  
- Round 1: Apex Committee  
- Round 2: Sub Committee  
- Round 3: Ad-hoc Committee – Initiatives  

#### A. Current Visual Issues (Supported by Source & Screenshots)
- **Scenario Box Recess:** The scenario graphic sits directly on the white card without container depth.
- **Radio Indicator Alignment:** The radio selection circle is aligned to the top-left of the committee card, which can look slightly detached from the centered icon and label.
- **Illustration Badge Framing:** In Round 3, the status banner on the illustration required manual letter-spacing to avoid tight text bounding.

#### B. Proposed Modern Minimal Changes (Zero Additional Text)
- **Tactical Briefing Container:** Frame the scenario illustration inside a micro-recessed container (`background: #F4F9FB; border: 1px solid #D0E4EC; border-radius: 14px;`), giving the 3D scene visual grounding.
- **Centered Radio Indicator:** Align the circular radio indicator cleanly alongside the committee icon, maintaining a balanced vertical card axis.
- **Refined Typography Hierarchy:** Render the scenario description in Daimler CS Regular ($21\text{ px}$, $1.35$ line-height) and committee card labels in Daimler CS Bold ($19\text{ px}$, Dark Petrol `#004355`).

#### C. Elements That Must Remain Unchanged
- Exact approved header badges (`Safety Issue X of 3`), 3-step progress circles, scenario texts, and committee names.
- Three separate Storyline slide architecture with shared template in `shared/`.
- Approved committee answer keys (R1 = Apex, R2 = Sub Committee, R3 = Ad-hoc Committee).
- Canvas dimensions: $1024 \times 576\text{ px}$.
- Storyline variables: `Q006_R1_*`, `Q006_R2_*`, `Q006_R3_*`.

#### D. Comic-Style Enhancements (Storyline Layer Only)
- **Character Alignment:** In Storyline, position **Meister** as the plant operations lead introducing each issue across the three slides, with **Torq** and **Aura** providing visual commentary.
- **Feedback Layer Animation:** On feedback layer start, Meister provides an authorized gesture confirming proper escalation.

#### E. Game-Interaction Enhancements (No Text Added)
- **Radio Selection Ripple:** On card click, trigger a subtle $180\text{ ms}$ expanding yellow ring inside the radio circle settling into a solid Daimler Yellow core.
- **Progress Stepper Fill:** When advancing between slides, the completed step discs display a crisp green checkmark (`✓`) with Dark Petrol fill.
- **Submit Button Illumination:** Submit button activates smoothly with forward arrow transition upon selecting an option.

#### F. Potential Storyline & Accessibility Risks
- Radio group must maintain strict keyboard accessibility (`ArrowUp`/`ArrowDown` navigation, `Space` selection).

#### G. Verification & Before-and-After Comparison
- **Evidence Level:** Source Inspected · Browser Tested · Storyline Tested.
- **Current Live Captures:**  
  - Round 1: [`screenshots/Q006_R1_rendered_default.png`](file:///C:/Users/CIE/.gemini/antigravity/brain/4030faa2-1380-4647-982b-d73a06809da8/Q006_R1_rendered_default.png)  
  - Round 2: [`screenshots/Q006_R2_rendered_default.png`](file:///C:/Users/CIE/.gemini/antigravity/brain/4030faa2-1380-4647-982b-d73a06809da8/Q006_R2_rendered_default.png)  
  - Round 3: [`screenshots/Q006_R3_rendered_default.png`](file:///C:/Users/CIE/.gemini/antigravity/brain/4030faa2-1380-4647-982b-d73a06809da8/Q006_R3_rendered_default.png)

```
[CURRENT Q006 LAYOUT]                     [PROPOSED MODERNIZED Q006]
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│ [Safety Issue 1 of 3]  (1)-(2)-(3)│     │ [Safety Issue 1 of 3]  (1)-(2)-(3)│
│ ┌───────┐ │ An organisation-    │       │ ┌───────┐ │ An organisation-    │
│ │ Image │ │ wide safety policy..│  ──>  │ │ Image │ │ wide safety policy..│
│ └───────┘ │                     │       │ └───────┘ │                     │
│ [🎯 Which committee should...]   │       │ [🎯 Which committee should...]   │
│ ┌─────┐   ┌─────┐   ┌─────┐     │       │ ┌─────┐   ┌─────┐   ┌─────┐     │
│ │( )ic│   │( )ic│   │( )ic│     │       │ │( )ic│   │( )ic│   │( )ic│     │
│ └─────┘   └─────┘   └─────┘     │       │ └─────┘   └─────┘   └─────┘     │
│                      [Submit ➜] │       │                      [Submit ➜] │
└─────────────────────────────────┘       └─────────────────────────────────┘
```

---

## 4. Distinction Between Design Tiers

To ensure complete clarity for curriculum owners and developers, all aspects of the modern design proposal are categorized into four distinct tiers:

1. **Approved Design Decisions (Permanent Baseline):**
   - Exact approved curriculum wording for all questions, instructions, cards, scenarios, and buttons.
   - Core corporate color palette: Dark Petrol `#004355`, Petrol `#00677F`, Petrol 80% `#007A93`, Daimler Yellow `#FFFF40`, White `#FFFFFF`, Black `#000000`.
   - Daimler CS font family exclusively (Upright Bold and Regular; no italics).
   - Storyline authority over Life Meter (3 lives), Reward Stars (3 stars), character art, and feedback layers.
   - HTML Web Object authority over interaction mechanics, card states, and scoring logic.
2. **Proposed Design Changes (Visual & Interaction Modernization Only — Zero Text Added):**
   - Elimination of heavy cut-corner yellow frames, embossed capsules, and edge-to-edge block headers.
   - Replacement of square checkboxes with full-card perimeter highlights and yellow active ring indicators.
   - Refined card elevation, hover states, and smooth drag-and-drop physics (magnetic snap, ghost docking bays).
   - Standardized Daimler Petrol stadium Submit buttons (`Submit ➜`) with yellow borders and forward arrow transitions.
   - Checkpoint disc illumination and Bradley curve flow lighting.
3. **Verified Technical Defects (Resolved in Code):**
   - `DICV-QA-001`: Desktop preview CEF sandbox blocking `GetPlayer()` (resolved with published web testing protocol).
   - `DICV-QA-002`: Answer reveal polling race condition in Storyline (resolved with active polling in `storyline-bridge.js`).
   - `DICV-QA-003`: Non-corporate hex codes and italic headings (standardized on Daimler tokens).
   - `DICV-QA-004`: Bridge method contract mismatch (`restoreState()` called instead of accessing `.state` property; resolved in Q005 and Q006).
   - `DICV-QA-005`: Headless Chrome file collision on Windows during screenshot capture (resolved with pre-deletion and virtual time budgeting).
4. **Untested Assumptions (Requiring Future Staging Validation):**
   - Oracle LMS SCORM resume across different browser engines (Safari on macOS, mobile touchscreens).
   - Performance of CSS hardware-accelerated transforms on low-spec corporate thin-client workstations.

---

## 5. Prioritized Implementation Roadmap (Post-Approval)

Following stakeholder review and formal sign-off, implementation will proceed without altering curriculum text:

- **Phase 1: Shared Design Tokens & Core Components (Days 1–2):**
  - Centralize modern tokens in `WebObjects/shared/styles/theme.css`.
  - Standardize `submit-stadium` and status indicator CSS without text alterations.
- **Phase 2: High-Impact Visual Modernization (Days 3–5):**
  - Modernize Q001 photo cards (card-level selection, remove block header).
  - Modernize Q002 commitments grid (remove cut-corner frame, upright typography).
  - Modernize Q005 Bradley Curve (ghost docking bays, flow lighting).
- **Phase 3: Interactive Polish & Precision Layout (Days 6–7):**
  - Polish Q003 floating grid and kinetic limit feedback.
  - Polish Q004 tactile drag elevation and magnetic snap.
  - Polish Q006 scenario briefing container and centered radio indicators.
- **Phase 4: End-to-End Published Output & LMS Verification (Days 8–9):**
  - Validate all 8 Web Objects inside published Storyline output (`story.html`).
  - Package final SCORM distribution for Oracle LMS staging verification.

---
*Report revised to enforce strict compliance with the Zero Additional Learner-Facing Text mandate. Prepared for DICV Interactive Safety eLearning curriculum stakeholders for final approval before touching production code.*
