# Antigravity Prompt — Q003 DICV EHS Commitments

**Quiz ID:** `Q003`  
**Quiz Title:** DICV EHS Commitments  
**Status:** Implemented & Verified against Master Daimler Corporate Guidelines  
**Target Canvas:** `1110 × 900 px` (Frameless Floating Grid, 100% Transparent Viewport)  
**Standalone Package:** `WebObjects/dist/Q003_EHSCommitments/`  
**Color Theme:** Official Daimler Truck Corporate Petrol (`#00677F`), Dark Petrol (`#004355`), Daimler Yellow (`#FFFF40`)  
**Interaction:** Multiple Response — Maximum 4 Selections (3 + 2 Grid Layout)

## Reproduction Instructions

1. **Canvas & Viewport**:
   - Canvas: `1110 × 900 px`, transparent background (`background-color: transparent`).
   - Question header bar and instruction text removed per directive (handled by Storyline scene).
   - Staggered entrance animation for cards and Submit button.

2. **Floating Answer Cards (3 + 2 Balanced Grid)**:
   - Top Row (3 Cards, $330 \times 275\text{ px}$, gap $26\text{ px}$):
     - Card A: *Zero harm to people* (`assets/icons/zero-harm.svg`)
     - Card B: *Safe working environment* (`assets/icons/safe-working-environment.svg`)
     - Card C: *Environmental responsibility* (`assets/icons/environmental-responsibility.svg`)
   - Bottom Row (2 Cards Centered, $410 \times 275\text{ px}$, gap $32\text{ px}$):
     - Card D: *Proactive risk prevention* (`assets/icons/proactive-risk-prevention.svg`)
     - Card E: *Higher production output* (`assets/icons/higher-production-output.svg`)
   - Surface: Pure white `#FFFFFF`, Petrol 40% outline (`#79AEBF`, $2\text{px}$), $18\text{px}$ border-radius.
   - Selected: Corporate Petrol outline (`3px solid #00677F`), soft petrol background (`#F0F7F9`).
   - Checkbox: Custom rounded square at upper-left ($28 \times 28\text{ px}$). Turns **Daimler Yellow (`#FFFF40`)** with solid black checkmark (`#000000`) on selection.
   - Typography: Daimler CS Bold Upright (`24px`), Charcoal `#000000`.

3. **Maximum 4 Selections State Machine**:
   - Learner can select up to 4 options.
   - When 4 cards are selected, the remaining 5th card enters `DISABLED_LIMIT`:
     - Faded to 40% opacity.
     - Light grey border (`#E6E6E6`).
     - Muted icon & label.
     - Cursor `not-allowed`, clicks ignored.
   - Deselecting any card restores the 5th card to available active state.

4. **Submit Button**:
   - Centered below cards, Corporate Petrol gradient (`#00677F` to `#004355`), $260 \times 64\text{ px}$ stadium pill ($32\text{px}$ radius), 3px white border, white Daimler CS Bold Upright text (`24px`) + right chevron `>`.
   - Disabled until 1 to 4 options are selected.

5. **Post-Feedback Review Mode**:
   - `CORRECT_SELECTED` (A, B, C, D selected): Green outline (`#28A745`), green fill, `"✓ Selected"` badge.
   - `CORRECT_MISSED` (A, B, C, D omitted): Amber outline (`#E67E22`), soft amber fill, `"Missed"` badge.
   - `INCORRECT_SELECTED` (E selected): Red outline (`#E03131`), soft red fill, `"✕ Incorrect"` badge.
   - `NEUTRAL` (E omitted): Light grey outline, unselected checkbox.

6. **Storyline Variables**:
   - `Q003_Done` (Boolean), `Q003_Answers` (Text / JSON), `Q003_Correct` (Boolean), `Q003_Revealed` (Boolean).
