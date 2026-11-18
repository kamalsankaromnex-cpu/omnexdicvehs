# Q003 — DICV EHS Commitments

**Status:** Fully Implemented & Compliance Tested against Master Daimler Corporate Design Guidelines  
**Quiz ID:** `Q003`  
**Quiz Title:** DICV EHS Commitments  
**Standalone Package:** `WebObjects/dist/Q003_EHSCommitments/`  
**Canvas Dimensions:** `1110 × 900 px` (Frameless Floating Grid, 100% Transparent Outer Viewport)  
**Type:** Multiple Response — Maximum 4 Selections  
**Approved Answer Key:** `["A", "B", "C", "D"]` (A, B, C, D correct; E is higher production output, incorrect)  
**Scoring Rule:** 100% Match (A+B+C+D required for Correct; $< 4$ or including E is Incorrect)

---

## 1. Visual & Layout Architecture

- **Frameless Floating Grid**: Completely removed outer background bounding boxes, gaming bevels, question banners, and subtitle text per directive. Storyline shopfloor, Meister & Torq characters, and slide title strip remain 100% unobstructed.
- **Answer Cards (3 + 2 Balanced Grid)**:
  - **Top Row (3 Cards, $330 \times 275\text{ px}$, gap $26\text{ px}$)**:
    - **A.** Zero harm to people (`assets/icons/zero-harm.svg`)
    - **B.** Safe working environment (`assets/icons/safe-working-environment.svg`)
    - **C.** Environmental responsibility (`assets/icons/environmental-responsibility.svg`)
  - **Bottom Row (2 Cards Centered, $410 \times 275\text{ px}$, gap $32\text{ px}$)**:
    - **D.** Proactive risk prevention (`assets/icons/proactive-risk-prevention.svg`)
    - **E.** Higher production output (`assets/icons/higher-production-output.svg`)
- **Card Styling**:
  - Default: Pure white `#FFFFFF` surface, Petrol 40% outline (`#79AEBF`, $2\text{px}$), soft corporate shadow.
  - Selected: **Deep Dark Petrol `#004355` outline ($3.5\text{px}$ solid)**, crisp pure white background (`#FFFFFF`), dimensional shadow (`0 10px 28px rgba(0, 67, 85, 0.18)`).
  - Checkbox: **High-Visibility Yellow `#FFD100` fill** with solid black `#000000` checkmark.
  - Typography: Daimler CS Bold (Upright, $24\text{px}$), Charcoal `#000000`.
- **Maximum 4 Selections State Machine (`DISABLED_LIMIT`)**:
  - When the learner selects 4 options, the 5th unselected card automatically dims to $40\%$ opacity (`is-limit-disabled`), turns light-grey, changes cursor to `not-allowed`, and ignores clicks.
  - When any selected card is unchecked, the 5th card instantly restores to active `AVAILABLE` status.
- **Submit Button**:
  - Centered below the cards, Corporate Petrol gradient (`#00677F` to `#004355`), $260 \times 64\text{ px}$ stadium pill ($32\text{px}$ radius), white Daimler CS Bold Upright text (`24px`) + right chevron `>`.

---

## 2. Post-Feedback Revealed / Review Mode

| Condition | Visual Treatment | Badge |
| :--- | :--- | :--- |
| **Correct & Selected (A, B, C, D)** | Green border (`#28A745`), soft green tint (`#E8F7ED`), green checkbox | `"✓ Selected"` |
| **Correct & Missed (A, B, C, D omitted)** | Amber border (`#E67E22`), soft amber tint (`#FFF8E7`), green checkmark | `"Missed"` |
| **Incorrect & Selected (E chosen)** | Red border (`#E03131`), soft red tint (`#FDF0F0`), red checkbox | `"✕ Incorrect"` |
| **Incorrect & Not Selected (E avoided)** | Neutral light-grey border (`#E6E6E6`), unselected checkbox | *(None)* |

---

## 3. Storyline 360 Variables & Bridge Contract

| Variable Name | Type | Default Value | Purpose |
| :--- | :--- | :--- | :--- |
| `Q003_Done` | **True/False** | `False` | Fired when learner clicks Submit; triggers feedback layer opening |
| `Q003_Correct` | **True/False** | `False` | `True` if exactly A+B+C+D selected; `False` otherwise |
| `Q003_Answers` | **Text** | `""` | JSON string array of selections e.g. `["A","B","C","D"]` |
| `Q003_Revealed` | **True/False** | `False` | Set on feedback layers to persist review mode |
