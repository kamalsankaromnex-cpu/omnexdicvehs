# Antigravity Prompt — Q001 Pilot

**Quiz ID:** `Q001`  
**Quiz Title:** Accident Prediction Quiz  
**Status:** Implemented & Verified  
**Reference Screenshot:** `WebObjects/references/quiz-screenshots/Q001_reference.png`  
**Standalone Package:** `WebObjects/dist/Q001_AccidentPrediction/`  
**Canvas Dimensions:** `806 × 962 px` (Radius: `18px`)  
**SCORM Delivery Standard:** Zero-404 Base64 Inlining (All assets and fonts embedded directly)

## Reproduction Instructions

1. **Exact Canvas Dimensions**: `806 × 962 px` with `18px` corner radius.
2. **Direct Slide Advance**: Clicking Submit immediately sets `Q001_Done = true` to trigger Storyline's native slide advance without any HTML feedback popups or delays.
3. **Header**:
   - Corporate Petrol linear gradient (`#003644` to `#004355` to `#00677F`), height `105px` (`100px` content + `5px` Daimler Yellow `#FFFF40` accent bar).
   - Headline: *"Which of these people will experience the next accident?"* (Daimler CS Bold, **`30px`**, White `#FFFFFF`, single continuous line without `<br>`).
4. **Instruction Row**:
   - *"Select the option(s) you think apply."* (Daimler CS Regular, **`17px`**, subtle gray-blue `#64717B`, height `59px`, centered).
5. **Answer Cards (4 Vertically Stacked)**:
   - Dimensions: $750 \times 140\text{ px}$, $14\text{ px}$ radius, $1.5\text{ px}$ border `#CFDEE3`, uniform $35\text{ px}$ gaps.
   - Checkbox: $24 \times 24\text{ px}$, rounded square ($5\text{ px}$ radius). Turns Petrol `#00677F` with white checkmark when checked.
   - Thumbnails: $178 \times 100\text{ px}$ ($1.78 : 1$ aspect ratio) matching authentic $314 \times 176\text{ px}$ production assets without distortion.
   - Letters: `A.`, `B.`, `C.`, `D.` in Daimler CS Bold, **`26px`**, Petrol `#00677F`.
   - Text: `Employee walking`, `MHE operator`, `Maintenance technician`, `Employee using a ladder` in Daimler CS Bold, **`26px`**, Charcoal `#171B1F`.
6. **Footer**:
   - Height: `136px`, horizontal alignment guides at $X = 28\text{ px}$ and $X = 778\text{ px}$.
   - Left: Status text *"Choose an answer to continue."* (Daimler CS Regular, **`17px`**, `#64717B`).
   - Right: Reset button ($110 \times 50\text{ px}$, **`18px`** Bold) + Submit button ($150 \times 50\text{ px}$, **`18px`** Bold, Petrol gradient with arrow `→`).
   - Vertical balance: $40\text{ px}$ gap above buttons, $42\text{ px}$ bottom margin below buttons.
7. **Asset Integrity & SCORM Packaging**:
   - Original production assets ($314 \times 176\text{ px}$) preserved in both `quizzes/.../assets/` and `dist/.../assets/`.
   - `dist/index.html` embeds all image thumbnails as Base64 Data URIs (`src="data:image/png;base64,..."`) for 100% fail-proof loading across all SCORM LMS platforms.
   - Fonts embedded in `fonts.css` via Base64 Data URIs.
8. **Storyline Variables**:
   - `Q001_Done`, `Q001_Answers`, `Q001_Correct`, `Q001_Revealed`.
