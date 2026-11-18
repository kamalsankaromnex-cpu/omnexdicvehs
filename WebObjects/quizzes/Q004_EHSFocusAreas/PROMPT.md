# Q004 — DICV EHS Focus Areas
## FINAL MASTER DEVELOPMENT PROMPT — GOOGLE ANTIGRAVITY

**Project:** DICV Interactive Safety eLearning  
**Project root:** `D:\Development\Projects\dicv-interactive`  
**Quiz ID:** `Q004`  
**Folder:** `WebObjects/quizzes/Q004_EHSFocusAreas/`  
**Interaction:** Three-zone drag-and-drop classification  
**Platform:** Articulate Storyline 360 HTML Web Object  
**Deployment:** Oracle LMS through Storyline SCORM  

---

## 1. PRIMARY OBJECTIVE

Develop Q004 as a professional, reusable, standalone HTML Web Object.

The learner must identify the **three correct DICV EHS focus areas** from four options and drag them into three overlapping Venn diagram circles.

After submission:

1. Storyline displays the appropriate feedback layer.
2. Storyline reveals the Safety Strategy content.
3. The quiz remains locked.
4. On slide revisit, the learner can review the correct answers without resubmitting.

Reuse the shared DICV design system and Storyline communication architecture.
Do not modify previously developed quizzes unnecessarily.

---

## 2. EXACT ANSWER OPTIONS & SCORING RULE

Display four draggable cards in the right-side panel titled:

**Focus Area Options**

- **A. Capability Management** — Correct
- **B. Governance** — Correct
- **C. Risk Management** — Correct
- **D. Employee Engagement** — Incorrect distractor

A submission is **Correct** only when:
- Exactly three items are placed.
- The placed item set is A, B and C.
- D remains unplaced.

The order of the three correct options does not matter.
A submission is **Incorrect** when D is among the three placed items or any of A, B, C is omitted.
No partial credit.

---

## 3. DRAG-AND-DROP BEHAVIOR & ATOMIC STATE RULES

- Empty-zone placement: Learner can drop any unplaced card into an empty zone.
- Occupied-zone replacement: The 4th unplaced option remains draggable even when all 3 zones are occupied. Dropping an unplaced item into an occupied zone atomically displaces the current occupant back to the options panel.
- Placed-item swapping: When an already placed item is dragged onto another occupied zone, swap the two items atomically.
- Central Venn intersection is decorative and rejects drops.
