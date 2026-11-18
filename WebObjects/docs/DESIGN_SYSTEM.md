# DICV Interactive Safety eLearning — Master Design System

**Authoritative Standard:** Daimler Truck Corporate Design Guidelines  
**Platform:** HTML5/CSS3/JavaScript Web Objects inside Articulate Storyline 360  
**LMS Target:** Oracle LMS  

---

## 1. Golden Principle

> **REFERENCE IMAGES DEFINE WHAT GOES WHERE.**  
> **THE DAIMLER DESIGN SYSTEM DEFINES HOW EVERYTHING LOOKS.**

When a reference screenshot is provided, extract structural layout, interaction type, card count, and approved text.  
**DO NOT** copy arbitrary colors, non-corporate fonts, italics, gaming bevels, or styling from the reference. The Daimler corporate palette and typography always override reference image visuals.

---

## 2. Mandatory Corporate Color System

All colors must originate from centralized design tokens (`theme.css`).

| Token Name | CSS Variable | Hex Code | Purpose / Strict Usage |
| :--- | :--- | :--- | :--- |
| **Petrol** | `--daimler-petrol` | `#00677F` | Primary interactive elements, selected card borders, Submit button |
| **Dark Petrol** | `--daimler-petrol-dark` | `#004355` | Question headers, emphasized surfaces, base gradient |
| **Petrol +20K** | `--daimler-petrol-plus-20k` | `#00566A` | Hover states and secondary dark surfaces |
| **Petrol 80%** | `--daimler-petrol-80` | `#007A93` | Supporting UI elements |
| **Petrol 60%** | `--daimler-petrol-60` | `#5097AB` | Secondary accents, focus indicators |
| **Petrol 40%** | `--daimler-petrol-40` | `#79AEBF` | Subtle card borders, dividers |
| **Petrol 20%** | `--daimler-petrol-20` | `#A6CAD8` | Soft backgrounds, muted cards |
| **Daimler Yellow** | `--daimler-yellow` | `#FFFF40` | **Selection indicators (checkboxes)**, key highlight lines |
| **Black** | `--daimler-black` | `#000000` | Primary text, checkmark icons, corporate navigation |
| **Dark Grey** | `--daimler-dark-grey` | `#444444` | Supporting descriptive text, instruction text |
| **Light Grey** | `--daimler-light-grey` | `#E6E6E6` | Disabled surfaces, neutral card borders |
| **White** | `--daimler-white` | `#FFFFFF` | Card backgrounds, header titles, contrast typography |

### Strict Restrictions:
- **Never use Red** as a default quiz accent.
- **Never use Golden Yellow `#FFD100` or `#F0C020`** in place of official Daimler Yellow `#FFFF40`.
- **Never use heavy solid black outlines (`#000000` / `#11161B`)** for selected cards. Selected cards always use Petrol (`#00677F`).
- **Never introduce arbitrary gradients or bevel effects.**

---

## 3. Global Typography Standards

* **Daimler CS Regular (400):** Body copy, card descriptions, instruction text, status labels.
* **Daimler CS Bold (700, Normal):** Question headers, card titles, option prefixes (A, B, C), Submit buttons.
* **Italic Ban:** Avoid `Daimler CS Bold Italic` across standard quiz UI. Keep headings, cards, and buttons upright and clear.
* **No Third-Party Fonts:** Never fall back to Arial, Roboto, Montserrat, or Poppins in production.

---

## 4. Component Standards

### A. Question Header
* Background: Dark Petrol `#004355` to Petrol `#00677F`.
* Title: Daimler CS Bold (Upright), pure white `#FFFFFF`.
* Accent: Daimler Yellow `#FFFF40` line (3–5px) underneath.

### B. Answer Cards
* Background: Pure white `#FFFFFF`.
* Default Border: Petrol 40% (`#79AEBF`) or Light Grey (`#E6E6E6`), $1.5\text{–}2\text{px}$.
* Hover: Petrol (`#00677F`), subtle lift (`-2px`).
* **Selected Border:** Corporate Petrol (`#00677F`, $2.5\text{–}3\text{px}$ solid).
* **Selected Background:** Soft petrol tint (`#F0F7F9`).

### C. Checkbox Indicator
* Size: $26\text{–}30\text{px}$ square, $5\text{–}6\text{px}$ border radius.
* Default: Pure white background, Petrol 40% border.
* **Selected Fill:** **Daimler Yellow `#FFFF40`** (NOT petrol, NOT golden yellow).
* **Selected Checkmark:** Solid Black (`#000000`, stroke $3.6\text{px}$).

### D. Submit Button
* Background: Corporate Petrol `#00677F` (gradient to `#004355`).
* Typography: Daimler CS Bold (Upright), pure white `#FFFFFF`.
* Shape: Stadium pill ($50\text{–}56\text{px}$ height, $28\text{px}$ radius).
* Icon: White right chevron / arrow (`>`).
* State: Disabled until a valid selection is made.

### E. Post-Feedback Review Mode
* **Selected by Learner & Correct:** Green outline (`#28A745`), soft green tint (`#E8F7ED`), green checkbox (`#008248`), white checkmark, `✓ Selected` badge.
* **Missed by Learner (Correct answer omitted):** Amber outline (`#E67E22`), soft amber tint (`#FFF8E7`), white checkbox with green checkmark (`#008248`), `Missed` badge (`#D97706`).

---

## 5. HUD Tech-Frame Redesign System (`quiz-hud.css`, v3.0)

All 8 quiz Web Objects (`Q001–Q006`) share [quiz-hud.css](../shared/styles/quiz-hud.css) for unified visual framing while preserving each quiz's interaction model and dimensions:

* **HUD Container Shell:** Dim Dark-Petrol (`--hud-panel-bg: rgba(12, 36, 49, 0.92)`, `--hud-panel-shadow: 0 18px 42px rgba(0, 0, 0, 0.35)`) with an inline decorative `.hud-frame-svg` (`pointer-events: none; z-index: 1`).
* **Question Banner:** `.rhombus-banner` with petrol gradient fill and Daimler Yellow (`#FFFF40`) stroke, white `Daimler CS Bold` title.
* **Primary Action Button:** Daimler Yellow (`#FFFF40`) upright Submit button with dark petrol/black text (`#0A1419`) and arrow; neutral muted slate when disabled.
* **Two-Portion Feedback Panel (`Q002–Q006`):** `.feedback-side-panel.is-two-portion` featuring a colored `.feedback-top-portion` header (Green `#008248` for Correct, Red `#D92323` for Incorrect/Missed) and a crisp white `.feedback-bottom-portion` body with Dark Petrol `.btn-continue`. (`Q001` retains Storyline-owned feedback.)
* **Life & Star Motion (`Header1` & `Module1_Outro`):** `Header1` animates heart loss (`is-just-lost`) and gain/refill (`is-just-gained`) alongside continuous `headerStarShimmer` on active stars; `Module1_Outro` animates `outroHeroStarPulse`, `outroStationStarPulse`, `outroStarTwinkle`, `outroHeartBeat`, and `outroHeartLost` (all disabled under `prefers-reduced-motion: reduce`).
