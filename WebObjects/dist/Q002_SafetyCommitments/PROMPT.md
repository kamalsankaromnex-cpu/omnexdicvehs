# Antigravity Prompt — Q002 DICV Safety Commitments

**Quiz ID:** `Q002`  
**Quiz Title:** DICV Safety Commitments  
**Status:** Implemented, Tested & Verified Working in Storyline 360  
**Target Canvas:** `1110 × 900 px` (Transparent Outer Viewport, Diagonal Chamfered White Panel)  
**Standalone Package:** `WebObjects/dist/Q002_SafetyCommitments/`  
**Color Theme:** Daimler Corporate Petrol (`#00677F`, `#028DA6`, `#004F63`, `#003644`) — Harmonized with Quiz 1  
**Interaction:** Multiple Response (3 + 2 Grid Layout)

## Reproduction Instructions

1. **Canvas & Viewport**:
   - Canvas: `1110 × 900 px`, transparent background (`background-color: transparent`).
   - Do NOT include the Daimler shopfloor background, character art (Meister, Torq, Aura), or navigation headers inside HTML.
   - Cascading one-by-one entrance animation: Header ($0.05\text{s}$) $\to$ Instruction ($0.14\text{s}$) $\to$ Cards A–E ($0.22\text{s} \to 0.54\text{s}$) $\to$ Submit button ($0.62\text{s}$).

2. **Background Panel Shape**:
   - Layered 8-sided SVG vector polygon with diagonal chamfers on **all 4 corners** (`1040 × 710 px`).
   - Pure white `#FFFFFF` surface with **Daimler Golden Yellow border** (`#F0C020`, 3.5px) and inner accent contour (`#FFF2BF`, 1.8px), double drop shadow, matching the user's annotated polygon drawing.

3. **Question Heading Tab**:
   - Corporate Petrol gradient capsule banner (`#029AB5` to `#003F4E`), width `940px`, height `84px`, rounded corners (`42px`), 3.5px white border.
   - White Daimler CS Bold Italic title: *"What should a company commit to for a safer workplace?"* (`32px`, single line, centered). **Target bullseye icon and divider line removed.**

4. **Instruction Row**:
   - High-visibility dark graphite pill (`#1A2025`) with bright yellow chevron (`#FFD100`): *"Select all that apply."* (`17.5px` Daimler CS Bold Italic).

5. **Answer Cards (3 + 2 Balanced Grid)**:
   - Top Row (3 Cards, $316 \times 255\text{ px}$, gap $24\text{ px}$):
     - Card A: *The safety and well-being of employees* (`assets/icons/employees.png`)
     - Card B: *Protecting the environment* (`assets/icons/environment.png`)
     - Card C: *Using energy responsibly* (`assets/icons/energy.png`)
   - Bottom Row (2 Cards Centered, $388 \times 255\text{ px}$, gap $28\text{ px}$):
     - Card D: *Reducing risks and continuously improving* (`assets/icons/risk-reduction.png`)
     - Card E: *Ensuring compliance and active participation in safety* (`assets/icons/compliance.png`)
   - Background: Pure white, Corporate Petrol border (`3px solid #00677F`) in default state; **turns solid Black (`3.8px solid #11161B`) when selected**; rounded corners (`20px`).
   - Checkbox: Custom rounded square at upper-left ($34 \times 34\text{ px}$). **Turns Daimler Golden Yellow (`#FFD100`) with high-contrast charcoal checkmark (`#11161B`) when selected.**
   - Icons: Loaded as separate local transparent PNG files (`assets/icons/*.png`), displayed in unified $105 \times 84\text{ px}$ containers (max-height $72\text{ px}$).
   - Typography: Daimler CS Bold (`26px` on cards A–D, `23.5px` on card E), Charcoal `#0E1418`.

6. **Submit Button**:
   - Centered below cards with reduced gap ($22\text{ px}$), Corporate Petrol gradient (`#00A8C9` to `#004354`), 3.5px white border, white italic text ($25\text{ px}$ Daimler CS Bold Italic) + right chevron `>`.
   - Disabled state: high-contrast petrol-tinted muted style.
   - Enabled state: high-contrast, vivid petrol gradient, dimensional shadow, and hover motion.

7. **Post-Feedback Review Mode**:
   - Options selected by learner: Green border (`#28A745`), green background tint (`#E8F7ED`), green checkbox (`#008248`), `✓ Selected` badge.
   - Options missed by learner: Amber border (`#E67E22`), amber background tint (`#FFF8E7`), green checkmark (`#008248`), `Missed` badge (`#D97706`).
   - Controls locked permanently after submission.
   - Fail-safe trigger: Automatic reveal transition 700ms after submit + continuous 150ms `Q002_Revealed` polling.

8. **Storyline Variables & Triggers**:
   - `Q002_Done` (Boolean / True-False): Submission event trigger.
   - `Q002_Correct` (Boolean / True-False): Evaluation result (`True` only if all 5 cards selected).
   - `Q002_Answers` (Text / JSON): Array of submitted choices.
   - `Q002_Revealed` (Boolean / True-False): Persists review mode on slide revisit.
