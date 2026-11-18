# DICV Interactive Web Objects — Master QA Checklist

**Scope:** Mandatory permanent verification for Q001, Q002, and all future quizzes.  
**Execution:** Run before sign-off and upon any code modification.

---

## Category A: Corporate Design Compliance
- [ ] **Colors:** Exclusively approved Daimler Truck corporate palette (`#00677F`, `#004355`, `#FFFF40`, `#000000`, `#FFFFFF`, `#E6E6E6`, `#444444`).
- [ ] **Yellow Accuracy:** Selected checkboxes and highlight accents use **Daimler Yellow `#FFFF40`** (NOT golden yellow `#FFD100` or `#F0C020`).
- [ ] **Selected Card Border:** Selected cards use **Corporate Petrol `#00677F`** (NOT solid black `#000000` or `#11161B`).
- [ ] **Typography:** Exclusively licensed **Daimler CS Regular** and **Daimler CS Bold**. No fallback fonts (Arial, Roboto, Montserrat) in production.
- [ ] **Italic Ban:** Headers, question titles, cards, and buttons are **Upright Bold (normal)**. No unapproved italics.
- [ ] **Submit Button:** Corporate Petrol stadium pill with white bold upright text and right arrow.

---

## Category B: Canvas & Visual Geometry
- [ ] **Dimensions:** Exact canvas sizing rendered ($806 \times 962\text{ px}$ for Q001; $1110 \times 900\text{ px}$ for Q002).
- [ ] **No Scrolling:** `overflow: hidden;` with zero unwanted scrollbars.
- [ ] **No Clipping:** Headers, cards, text, icons, and buttons are fully visible with uniform margins.
- [ ] **Transparency:** Viewport background is transparent where Storyline shopfloor and characters exist.

---

## Category C: Interaction & Logic
- [ ] **Interaction Mode:** Selection toggles smoothly via mouse click and keyboard (`Tab`, `Space`, `Enter`).
- [ ] **Submit State:** Submit button disabled until valid selection is made; enables immediately upon selection.
- [ ] **Single Submission:** Submit button locks immediately upon click; prevents duplicate submissions.
- [ ] **Correct Answer Key:** Strict evaluation against approved key (Q001: 4 photos; Q002: all 5 commitments).

---

## Category D: Storyline 360 Integration
- [ ] **Variables Created:** Variables created in Storyline with correct types (`Qxxx_Done` = True/False; `Qxxx_Correct` = True/False; `Qxxx_Answers` = Text; `Qxxx_Revealed` = True/False).
- [ ] **Trigger Ordering:** `Qxxx_Correct` set in Storyline memory before `Qxxx_Done` fires triggers.
- [ ] **Feedback Layers:** Storyline shows Correct layer when score matches; shows Incorrect layer when incomplete.
- [ ] **Active Polling:** Bridge actively polls `Qxxx_Revealed` every 150ms to catch feedback layer display.
- [ ] **Auto-Reveal Fallback:** Quiz automatically transitions into review mode after submission.
- [ ] **Revisit State:** Revisiting slide restores locked review state without re-awarding stars/lives.

---

## Category E: Assets & Packaging
- [ ] **Local Assets:** All icons and photos load from local `assets/` relative paths. Zero CDN or external dependencies.
- [ ] **Aspect Ratios:** Images and icons maintain authentic proportions with `object-fit: contain` or `cover`.
- [ ] **Fonts Bundled:** `fonts/` directory contains `DaimlerCS-Regular.ttf` and `DaimlerCS-Bold.ttf`.
- [x] **Self-Contained Dist:** Standalone `WebObjects/dist/` package contains everything needed for offline Storyline import (verified for all 8 targets).
- [x] **Bridge & SCORM String Resume:** `DICVStorylineBridge` safely parses `"false"`/`"true"` SCORM strings, supports singular `answer` (`Q006`), deduplicates reveals, and stops polling after reveal.
- [x] **Storyline-Authoritative Reveal:** No quiz (`Q001–Q006`) auto-reveals answers on a local timer before Storyline feedback completion.
- [ ] **Live Storyline 360 & Oracle LMS Execution:** Blocked in workspace (no `.story`, `story.html`, or `imsmanifest.xml` present); must be executed in Storyline/Oracle LMS staging.
