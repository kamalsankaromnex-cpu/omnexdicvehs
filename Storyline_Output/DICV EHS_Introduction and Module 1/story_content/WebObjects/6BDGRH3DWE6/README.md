# Q004 — DICV EHS Focus Areas

**Status:** Fully Implemented & Compliance Tested against Master Daimler Corporate Design Guidelines & Reference Architecture  
**Quiz ID:** `Q004`  
**Quiz Title:** DICV EHS Focus Areas  
**Standalone Package:** `WebObjects/dist/Q004_EHSFocusAreas/`  
**Canvas Dimensions:** `1110 × 900 px` (Left Venn / Right Options Split, 100% Transparent Outer Viewport)  
**Type:** Three-Zone Drag-and-Drop Classification into a 3-Color Pinwheel Cyclic Venn Diagram  
**Approved Answer Key:** `{"A": true, "B": true, "C": true, "D": false}` (A: Capability Management, B: Governance, C: Risk Management correct; D: Employee Engagement distractor)  
**Scoring Rule:** 100% Match (A, B, C placed in any arrangement; D unplaced). No partial credit.

---

## 1. Visual & Layout Architecture

- **Frameless 100% Transparent Viewport (`1110 × 900 px`)**: Outer canvas has zero background fill, ensuring Storyline's Daimler shopfloor background, Meister & Torq characters, and top slide title strip remain completely unobstructed.
- **Left Column: 3-Color Pinwheel Cyclic Venn Diagram**:
  - **Color-Coded Symmetrical Lobes ($r = 185\text{ px}$)**:
    - **Zone 1 (Top Center)**: Deep Dark Petrol `#004355`
    - **Zone 2 (Bottom Left)**: Vibrant Petrol 80% `#007A93`
    - **Zone 3 (Bottom Right)**: High-Contrast Daimler Yellow `#FFFF40`
  - **Pinwheel Cyclic Overlap Geometry**: Smooth cyclic layering where Top overlaps Bottom-Right, Bottom-Left overlaps Top, and Bottom-Right overlaps Bottom-Left.
  - **Elevated Central Hub**: Circular pure white badge ($r = 56\text{ px}$) elevated with drop shadow reading **SAFETY Strategy** (`SAFETY` in bold uppercase, `Strategy` in title case).
  - **High-Contrast Drop Targets**:
    - Zone 1 & 2: White dashed border (`2px dashed rgba(255,255,255,0.85)`), white `+` icon, white labels.
    - Zone 3: Dark Petrol dashed border (`2px dashed rgba(0,67,85,0.85)`), dark petrol `+` icon, dark petrol labels.
- **Right Column: Focus Area Options Panel ($440\text{ px}$ width)**:
  - **Header Banner**: Solid Dark Petrol `#004355` banner strip with Daimler CS Bold title (`Focus Area Options`).
  - **Accent Stripe**: Thin Daimler Yellow horizontal bar (`3.5px`, `#FFFF40`) directly below the header banner.
  - **Draggable Cards (Clean, No "OPTION A/B/C/D")**:
    - **Capability Management** (`assets/icons/capability-management.svg`)
    - **Governance** (`assets/icons/governance.svg`)
    - **Risk Management** (`assets/icons/risk-management.svg`)
    - **Employee Engagement** (`assets/icons/employee-engagement.svg`)
    - Each card features an icon container, bold upright title, and a 6-dot drag handle grid (`:::`) on the right.
  - **Submit Button**:
    - Stadium pill button with arrow `Submit →`.
    - Disabled when $< 3$ items are placed (soft grey `#E6E6E6`, `#888888` text).
    - Enabled when all 3 zones are filled (Corporate Dark Petrol gradient `#00677F` to `#004355`, `#FFFFFF` text).
    - Progress counter below button: `"0 of 3 focus areas placed."` dynamically updating.

---

## 2. Drag-and-Drop State Machine & Physics

- **Atomic State Function `placeItem(itemId, targetZone)`**:
  - **Empty-Zone Placement**: Placed cleanly; removed from source or pool.
  - **Occupied-Zone Displacement**: When all three zones are full and the learner drags the 4th unplaced option (e.g. Card D) into an occupied zone, the current occupant is atomically evicted back to the Focus Area Options pool without breaking the 3-item limit.
  - **Placed-Item Swapping**: When an already placed card in Zone 1 is dragged into occupied Zone 2, the two cards atomically swap positions (`Zone 1 <-> Zone 2`).
  - **Return to Source**: Learners can drag a placed card back onto the options pool to unplace it.
  - **Click-to-Move Fallback**: Full accessibility support for click/touch selection and keyboard targeting if drag-and-drop is restricted.

---

## 3. Post-Feedback Revealed / Review Mode

When `Q004_Revealed = true` is signaled by Storyline or query param `?state=review`:

| Card / Condition | Visual Treatment | Badge |
| :--- | :--- | :--- |
| **A, B, C (Placed)** | Corporate Green border (`#28A745`), soft green tint (`#E8F7ED`) | `"✓ Correct"` |
| **A, B, C (Missed / in Pool)** | Amber border (`#E67E22`), soft amber tint (`#FFF8E7`) | `"Missed"` |
| **D (Placed in Venn)** | Corporate Red border (`#E03131`), soft red tint (`#FDF0F0`) | `"✕ Incorrect"` |
| **D (Left in Pool)** | Neutral light-grey border (`#E6E6E6`), semi-translucent | *(None)* |

---

## 4. Storyline 360 Variables & Bridge Contract

| Variable Name | Type | Default Value | Purpose |
| :--- | :--- | :--- | :--- |
| `Q004_Done` | **True/False** | `False` | Triggered when learner clicks Submit; tells Storyline to show Feedback layer |
| `Q004_Correct` | **True/False** | `False` | Evaluated strictly: `True` only if `{A, B, C}` placed and D unplaced; `False` otherwise |
| `Q004_Answers` | **Text** | `""` | JSON string e.g. `{"zone-1":"A","zone-2":"B","zone-3":"C"}` |
| `Q004_Revealed` | **True/False** | `False` | Activated by Storyline feedback layer; activates review mode |
