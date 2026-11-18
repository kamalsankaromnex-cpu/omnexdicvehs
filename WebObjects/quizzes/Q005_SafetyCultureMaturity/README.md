# Q005 — DICV Safety Culture Maturity

**Status:** Fully Implemented & Compliance Tested against Master Daimler Corporate Design Guidelines  
**Quiz ID:** `Q005`  
**Quiz Title:** DICV Safety Culture Maturity  
**Standalone Package:** `WebObjects/dist/Q005_SafetyCultureMaturity/`  
**Canvas Dimensions:** `1110 × 600 px` (100% Transparent Outer Viewport, Frameless Board)  
**Interaction Type:** Drag-and-Drop Sequencing / Ordering along the Bradley Curve  
**Approved Answer Order:**
1. **Reactive** (`stage-1`)
2. **Dependent** (`stage-2`)
3. **Independent** (`stage-3`)
4. **Interdependent** (`stage-4`)  
**Scoring Rule:** 100% Match (All 4 stages in exact ascending maturity sequence). No partial credit.

---

## 1. Visual & Layout Architecture

- **Frameless Viewport (`1110 × 600 px`)**: Removed duplicate top capsule instruction banner per user directive to ensure zero obstruction of Storyline slide titles, characters (Meister, Torq, Aura), and audio dialogue.
- **Outer Board Surface**: Crisp white card (`border: 1.5px solid #79AEBF`, radius `20px`) with Daimler corporate drop shadow.
- **Bradley Injury Rate Graph & Drop Targets**:
  - **Y-Axis**: Vertical axis with upward arrow and capsule badge `"Injury Rate"`.
  - **X-Axis**: Horizontal axis with rightward arrow and capsule badge `"Increasing Safety Culture Maturity →"`.
  - **Bradley Injury Rate Curve**: Smooth descending SVG curve (`stroke: #007A93`, width `4.5px`) starting high on the left and tapering downward to the right.
  - **Numbered Checkpoints**: 4 circular markers ($r = 22\text{ px}$) in Daimler Yellow `#FFFF40` with Dark Petrol `#004355` border and bold numbers `1`, `2`, `3`, `4`.
  - **Dashed Projection Drop Lines**: Vertical dashed lines from each checkpoint leading to its drop target.
  - **4 Drop Targets (`stage-1`, `stage-2`, `stage-3`, `stage-4`)**: Arranged in a descending staircase below the curve, comfortably elevated 11px above the horizontal X-axis line.
- **Lower Area: Draggable Cards Dock & Submit Control**:
  - Horizontal tray holding the 4 stage cards in initial scrambled order:
    1. **Interdependent** (`assets/icons/interdependent.svg`)
    2. **Independent** (`assets/icons/independent.svg`)
    3. **Dependent** (`assets/icons/dependent.svg`)
    4. **Reactive** (`assets/icons/reactive.svg`)
  - Each card features a local vector SVG icon, bold stage title (single line, no truncation), and a 6-dot drag handle (`:::`).
  - **Submit Button**: Daimler stadium pill (`175 × 56 px`), enabled only when all 4 targets are occupied.

---

## 2. Drag-and-Drop State Machine & Physics

- **Atomic State Function `placeItem(stageId, targetId)`**:
  - **Empty-Target Placement**: Moves card from dock into target cleanly.
  - **Occupied-Target Displacement**: Dropping an unplaced card from dock onto an occupied target evicts current occupant back to dock.
  - **Placed-Target Swapping**: Dropping an already placed card onto another occupied target atomically swaps the two cards.
  - **Return to Source Dock**: Dropping or clicking back onto dock unplaces the item (`targetId = null`).
  - **Click-to-Move Fallback**: Fully accessible with touch and keyboard navigation.

---

## 3. Post-Feedback Revealed / Review Mode

When `Q005_Revealed = true` is signaled by Storyline or query param `?state=review`:

| Card State | Visual Treatment | Badge |
| :--- | :--- | :--- |
| **Correctly Placed** | Corporate Green border (`#28A745`), soft green tint (`#E8F7ED`) | `"✓ Correct"` |
| **Incorrectly Placed** | Corporate Red border (`#E03131`), soft red tint (`#FDF0F0`) | `"✕ Incorrect"` |
| **Unplaced / Missed** | Amber border (`#E67E22`), soft amber tint (`#FFF8E7`) | `"Missed"` |

An authoritative review banner displays:  
`"Correct Sequence: 1. Reactive → 2. Dependent → 3. Independent → 4. Interdependent"`

---

## 4. Storyline 360 Variables & Bridge Contract

| Variable Name | Type | Default Value | Purpose |
| :--- | :--- | :--- | :--- |
| `Q005_Done` | **True/False** | `False` | Fired when learner clicks Submit; tells Storyline to show Feedback layer |
| `Q005_Correct` | **True/False** | `False` | `True` only if sequence is exactly Reactive → Dependent → Independent → Interdependent |
| `Q005_Answers` | **Text** | `""` | JSON string e.g. `{"stage-1":"Reactive","stage-2":"Dependent",...}` |
| `Q005_Revealed` | **True/False** | `False` | Set on Storyline feedback layer; activates review mode |
