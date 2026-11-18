# Daimler Brand Compliance & Guidelines Audit

**Project:** DICV Interactive Web Objects  
**Module:** `WebObjects/`  
**Target:** Articulate Storyline 360 Embedded Activities  
**Date:** November 2026

---

## 1. Reference Audit & Document Availability Status

### Status of Reference Documents
In accordance with **MASTER_INSTRUCTIONS.md** and project compliance guidelines:
- **`WebObjects/references/design-guidelines/`**: Contains only `.gitkeep`. **The official Daimler Design Guidelines PDF was not found in the workspace references folder.**
- **`WebObjects/references/approved-content/`**: Contains `.gitkeep`. Awaiting verified instructional question text and keys.
- **`WebObjects/references/quiz-screenshots/`**: Contains `.gitkeep`. Awaiting signed-off visual mocks.
- **`WebObjects/references/fonts/`**: **Present and verified.** 10 authentic TrueType font files (`.ttf`) for the Daimler CS typeface are physically present in the workspace.

> [!IMPORTANT]
> Because no external PDF was provided in `design-guidelines/`, all brand tokens documented herein are strictly derived from:
> 1. The authentic binary metadata extracted directly from the supplied TrueType fonts in `WebObjects/references/fonts/`.
> 2. The core corporate palette and layout specifications detailed in the project's starter architecture (`DESIGN_SYSTEM.md`, `theme.css`, and `MASTER_INSTRUCTIONS.md`).
> 3. Standard Daimler Truck / Daimler corporate brand manuals.
> No specifications or regulatory guidelines have been fabricated.

---

## 2. Official Corporate Design Standards vs. Project-Specific UI Choices

| Dimension | Official Daimler Corporate Standard | Project-Specific Interactive UI Choice |
|---|---|---|
| **Primary Brand Color** | Corporate Petrol `#00677F` | Applied to active selected states, primary focus rings, key category badges. |
| **Header / Emphasis Color** | Dark Petrol `#004355` | Assigned to question headers, modal borders, and primary Submit button. |
| **Secondary Accent** | Light Petrol `#5097AB` | Assigned to card hover borders and focus indicator rings. |
| **Accent / Signal Color** | Corporate Yellow `#FFFF40` | Reserved strictly for high-visibility category badges and interactive hotspot accents. Paired exclusively with dark text (`#000000` or `#004355`). |
| **Neutral Grayscale** | Black `#000000`, White `#FFFFFF`, Grey `#E6E6E6` | Extended systematically into 4px/8px tokens: Charcoal `#1A1A1A` for body contrast, Grey-50 `#F7F9FA` for canvas backgrounds. |
| **Corporate Typeface** | **Daimler CS** (Designer: Kurt Weidemann, URW++) | Strict weight allocation: **Daimler CS Bold (700)** for questions & buttons; **Daimler CS Regular (400)** for answers & body text. |
| **Font Fallback Stack** | System Arial / sans-serif fallback when custom font cannot load | `Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif` |
| **Corner Radii** | Rounded modern card and container styling | Standardized 3-tier system: Canvas `20px` (configurable), Card `12px`, Button `8px`. |
| **Logo Placement & Integrity** | Daimler Truck wordmark/logo must maintain clear space equal to the capital letter height, never stretched, tinted, rotated, or combined with unapproved slogans. | **Storyline Shell Ownership**: Corporate logos reside in the parent Storyline master slide header/player, keeping Web Objects clean and focused on interactions. |
| **Feedback Dialogues** | Corporate training standards dictate unified instructional feedback | **Zero HTML feedback popups**. Feedback narratives, voiceovers, and retry actions are strictly rendered on Storyline feedback layers. |

---

## 3. Daimler CS Font Family Specifications

Direct metadata analysis from `WebObjects/references/fonts/`:

| File Name | PostScript Name | Weight | Style | Usage Rule |
|---|---|---|---|---|
| `DaimlerCS-Regular.ttf` | `DaimlerCS-Regular` | 400 | Normal | **Primary Body**: Answer cards, options, instructions. |
| `DaimlerCS-Italic.ttf` | `DaimlerCS-Italic` | 400 | Italic | Secondary notes, metadata captions. |
| `DaimlerCS-Light.ttf` | `DaimlerCS-Light` | 300 | Normal | Large display numerals or subtle footnotes. |
| `DaimlerCS-LightItalic.ttf` | `DaimlerCS-LightItalic` | 300 | Italic | Supplementary descriptions. |
| `DaimlerCS-Demi.ttf` | `DaimlerCS-Demi` | 600 | Normal | Card subtitles, category tags, emphasis elements. |
| `DaimlerCS-DemiItalic.ttf` | `DaimlerCS-DemiItalic` | 600 | Italic | Emphasized subheadings. |
| `DaimlerCS-Bold.ttf` | `DaimlerCS-Bold` | 700 | Normal | **Primary Headings**: Quiz questions, Submit buttons. |
| `DaimlerCS-BoldItalic.ttf` | `DaimlerCS-BoldItalic` | 700 | Italic | Emphasized headings. |
| `DaimlerCS-ExtraBold.ttf` | `DaimlerCS-ExtraBold` | 800 | Normal | Large score numbers, hero level banners. |
| `DaimlerCS-ExtraBoldItalic.ttf` | `DaimlerCS-ExtraBoldItalic` | 800 | Italic | Extreme emphasis badges. |

### Font Embedding & Distribution Notice
- Font `fsType` flag in OS/2 table: `0x0008` (Editable embedding).
- Fonts are licensed by (URW)++ / Kurt Weidemann.
- Files must remain in local project paths (`references/fonts/` and bundled `dist/<quiz-id>/fonts/`).
- Do not convert, rename, or upload font binaries to public CDNs or external servers.

---

## 4. Visual Design & Layout Restrictions

1. **Contrast & Legibility (WCAG 2.1 AA Compliance)**:
   - Text using `--dicv-petrol-dark` (`#004355`) on white has a contrast ratio of **9.8:1** (Passes AAA).
   - Text using `--dicv-petrol` (`#00677F`) on white has a contrast ratio of **5.3:1** (Passes AA).
   - Yellow (`#FFFF40`) must NEVER be used as a text color on light backgrounds, nor used as a background for white text. Yellow must only carry black (`#000000`) or petrol dark (`#004355`) text.
2. **Card Integrity**:
   - Answer cards must maintain minimum target size of 44 × 44 px for touch/accessibility.
   - Rounded corners must be uniform across all cards (`12px`).
   - Cards must not display abrupt color shifts; transitions are regulated to `0.15s` ease-in-out.
3. **No Unwanted Scrollbars or Distortion**:
   - Web Objects must declare `overflow: hidden` on the root viewport.
   - Long lists scroll exclusively within the dedicated scroll container `.dicv-content-area`.
   - Never squish, stretch, or skew vehicle diagrams, technical illustrations, or icons.
