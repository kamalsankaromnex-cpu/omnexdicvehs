# Q002 — DICV Safety Commitments

**Status:** Fully Harmonized & Verified against Master Daimler Corporate Design Guidelines  
**Quiz ID:** `Q002`  
**Quiz Title:** DICV Safety Commitments  
**Standalone Package:** `WebObjects/dist/Q002_SafetyCommitments/`  
**Canvas Dimensions:** `1110 × 900 px` (Transparent Outer Viewport, Clean Corporate White Panel)  
**Type:** Multiple Response (Select All That Apply)  
**Approved Answer Key:** `["A", "B", "C", "D", "E"]` (All 5 commitments apply)  
**Scoring Rule:** 100% Match (A+B+C+D+E required for Correct; $< 5$ is Incorrect, no partial credit)

---

## 1. Visual Design Compliance

Harmonized with the official Daimler Truck Corporate Design Guidelines:
- **Header**: Corporate Petrol linear gradient (`#004355` to `#00677F`), bold white single-line title:
  *"What should a company commit to for a safer workplace?"* (`32px` Daimler CS Bold, **Upright**).
- **Instruction**: Centered neutral gray instruction text (`#444444`): *"Select all that apply."* (`18px` Daimler CS Regular, **Upright**).
- **Background Shape**: Layered 8-sided console contour (`1040 × 710 px`) in pure white (`#FFFFFF`) with **Daimler Yellow border (`#FFFF40`, 3.2px)** and subtle inner accent contour (`#79AEBF`, 1.5px).
- **Answer Cards (3 + 2 Balanced Grid)**:
  - **Top Row (3 Cards, 316 × 255 px, gap 24 px)**:
    - **A.** The safety and well-being of employees (`assets/icons/employees.png`)
    - **B.** Protecting the environment (`assets/icons/environment.png`)
    - **C.** Using energy responsibly (`assets/icons/energy.png`)
  - **Bottom Row (2 Cards Centered, 388 × 255 px, gap 28 px)**:
    - **D.** Reducing risks and continuously improving (`assets/icons/risk-reduction.png`)
    - **E.** Ensuring compliance and active participation in safety (`assets/icons/compliance.png`)
  - **Card Outline**: Corporate Petrol 40% (`2px solid #79AEBF`) in default; **turns Corporate Petrol (`3px solid #00677F`) when selected** (NO heavy black outlines); rounded corners (`20px`).
  - **Selected Checkbox**: **Daimler Yellow (`#FFFF40`)** with solid black checkmark (`#000000`), scale bounce ($1.08\times$).
  - **Typography**: Daimler CS Bold (`26px` on cards A–D, `23.5px` on card E), dark charcoal/black text (`#000000`).
- **Submit Button**:
  - Centered below cards ($260 \times 64\text{ px}$), Corporate Petrol gradient (`#00677F` to `#004355`), 3.5px white border, white upright text (`24px` Daimler CS Bold, **Upright**) + right chevron `>`.

---

## 2. Post-Feedback Revealed / Review Mode

- **Selected by Learner**:
  - Border: Green (`3.5px solid #28A745`)
  - Background: Soft green tint (`#E8F7ED`)
  - Checkbox: Green fill (`#008248`) with white checkmark
  - Badge: Upper-right `✓ Selected` badge in green (`#008248`)
- **Missed by Learner**:
  - Border: Amber (`3.5px solid #E67E22`)
  - Background: Soft amber tint (`#FFF8E7`)
  - Checkbox: Amber outline (`#E67E22`) with green correct checkmark (`#008248`)
  - Badge: Upper-right `Missed` badge in amber (`#D97706`)

---

## 3. Storyline 360 Variables Contract

| Variable Name | Type | Default Value | Purpose |
| :--- | :--- | :--- | :--- |
| `Q002_Done` | **True/False** | `False` | Fired when learner clicks Submit; triggers Storyline audio (`Q002_Correct` = True/False) |
| `Q002_Correct` | **True/False** | `False` | `True` if all 5 selected (A+B+C+D+E); `False` otherwise |
| `Q002_Answers` | **Text** | `""` | JSON string array of selections e.g. `["A","B","C","D","E"]` |
| `Q002_Revealed` | **True/False** | `False` | Set on review/revisit to persist card badges |
| `Q002_Continue` | **True/False** | `False` | Fired when learner clicks `Continue →` inside the feedback panel; jumps to next slide |

---

## 4. Storyline 360 Split Media-Sync & In-Object Feedback Mode (`1800 × 900 px`)

When embedded in an `1800 × 900 px` Storyline Web Object (or `?mode=split`), `Q002_SafetyCommitments` runs a 3-stage interactive flow without requiring visual feedback layers in Storyline:

1. **Stage 1 — Media-Locked Split:** Quiz starts scaled on the right while Storyline plays the intro video on the left.
2. **Stage 2 — Expanded Interactive:** Storyline calls `Q002_ON_MEDIA_COMPLETE()` (or posts `Q002_MEDIA_COMPLETE`) when the video ends; the quiz expands and unlocks all 5 cards.
3. **Stage 3 — Right-Side Feedback Panel:** On **Submit**, the quiz shifts left and displays the integrated right-side feedback panel:
   - **Correct (All 5 Selected):** Green top accent (`#008248`), green Tick (`✓`) icon, `All 5 Commitments Selected` pill, `Well done!` heading, and feedback copy.
   - **Missed / Incorrect:** Red top accent (`#D92323`), red Cross (`✕`) icon, `One or More Missed` pill, `Good thinking!` heading, and feedback copy.
   - **Continue → Button:** Sets `Q002_Continue = True` (synchronously if `False`, or `250ms` reset-toggle if already `True`) so Storyline's Base Layer trigger jumps directly to the next slide while Aura's feedback audio plays on `Q002_Done`.
