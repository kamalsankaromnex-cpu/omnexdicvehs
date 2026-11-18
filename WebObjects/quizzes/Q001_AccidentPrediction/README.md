# Q001 — Accident Prediction Quiz

**Status:** Fully Harmonized & Verified against Master Daimler Corporate Design Guidelines  
**Quiz ID:** `Q001`  
**Quiz Title:** Accident Prediction Quiz  
**Standalone Package:** `WebObjects/dist/Q001_AccidentPrediction/`  
**Canvas Dimensions:** `806 × 962 px` (Radius: `18px`)  
**Type:** Multiple Response (Checkbox Selection)  
**Approved Answer Key:** `["A", "B", "C", "D"]` (All options represent real accident risks)  

---

## 1. Visual Design Compliance

Harmonized with the official Daimler Truck Corporate Design Guidelines:
- **Header**: Corporate Petrol linear gradient (`#004355` to `#00677F`), bold white single-line title:
  *"Which of these people will experience the next accident?"* (`30px` Daimler CS Bold, Upright), underlined with Daimler Yellow accent line (`#FFFF40`, `5px`). Sits on an unbroken, authoritative line with zero line breaks.
- **Instruction**: Centered neutral gray instruction text (`#444444`): *"Select the option(s) you think apply."* (`17px` Daimler CS Regular, Upright).
- **Answer Cards (4 Vertically Stacked)**:
  - **A.** Employee walking (`assets/thumb_employee_walking.png`)
  - **B.** MHE operator (`assets/thumb_mhe_operator.png`)
  - **C.** Maintenance technician (`assets/thumb_maintenance_tech.png`)
  - **D.** Employee using a ladder (`assets/thumb_employee_ladder.png`)
  - **Typography**: Option letters `26px` Daimler CS Bold (`#00677F`), Option titles `26px` Daimler CS Bold (`#000000`).
  - **Selected Card Border**: Corporate Petrol (`#00677F`, $2.5\text{px}$) with soft petrol tint (`#F0F7F9`).
  - **Selected Checkbox**: **Daimler Yellow (`#FFFF40`)** with solid black checkmark (`#000000`), scale bounce ($1.08\times$).
- **Buttons**:
  - **Reset Button**: $110 \times 50\text{ px}$, white background, petrol text, Daimler CS Bold upright.
  - **Submit Button**: $150 \times 50\text{ px}$, Corporate Petrol gradient (`#00677F` to `#004355`), white text (`18px` Daimler CS Bold Upright), right arrow `→`. Disabled until at least 1 option is selected.

---

## 2. Storyline 360 Variables Contract

| Variable Name | Type | Default Value | Purpose |
| :--- | :--- | :--- | :--- |
| `Q001_Done` | **True/False** | `False` | Tracks submission status. Triggers feedback layer opening. |
| `Q001_Answers` | **Text** | `""` | JSON string array of selections e.g. `["A","B"]`. |
| `Q001_Correct` | **True/False** | `False` | Result evaluation (`True` if valid selection made). |
| `Q001_Revealed` | **True/False** | `False` | Triggered by Storyline to display review mode in Web Object. |
