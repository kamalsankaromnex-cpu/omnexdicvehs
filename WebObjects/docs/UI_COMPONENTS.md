# DICV Shared UI Component Library

**Package:** `WebObjects/shared/styles/components.css`  
**Tokens:** `WebObjects/shared/styles/theme.css`  
**Typography:** `WebObjects/shared/styles/typography.css`  

---

## 1. Question Heading (`.daimler-header`)
* **Visual Style:** Dark Petrol linear gradient (`#004355` to `#00677F`), rounded corners ($18\text{px}$), 4px Daimler Yellow (`#FFFF40`) bottom accent bar.
* **Typography:** `font-family: 'Daimler CS'; font-weight: 700; font-style: normal;` (Upright Bold).
* **Text Color:** Pure White (`#FFFFFF`).

---

## 2. Instruction Text (`.daimler-instruction`)
* **Visual Style:** Clean, unobtrusive neutral text centered below the header.
* **Typography:** `font-family: 'Daimler CS'; font-weight: 400; font-style: normal; font-size: 17px;`
* **Color:** Dark Grey (`#444444`).
* **Rule:** Do NOT use dark graphite gaming pills unless explicitly requested and approved.

---

## 3. Answer Cards (`.daimler-card`)
* **Default State:**
  * Background: Pure White (`#FFFFFF`).
  * Border: $2\text{px}$ solid Petrol 40% (`#79AEBF`) or Light Grey (`#E6E6E6`).
  * Radius: $14\text{–}18\text{px}$.
  * Shadow: Soft corporate shadow `0 2px 8px rgba(0, 67, 85, 0.08)`.
* **Hover State:**
  * Border: Corporate Petrol (`#00677F`).
  * Background: `#FAFCFD`.
  * Transform: `translateY(-2px)`.
* **Selected State:**
  * **Border:** **$3\text{px}$ solid Corporate Petrol (`#00677F`)** (STRICT: Never use black borders).
  * **Background:** Soft Petrol tint (`#F0F7F9`).
  * Transform: `translateY(-2px)`.

---

## 4. Checkbox Indicator (`.daimler-checkbox`)
* **Default State:**
  * Size: $26\text{–}28\text{px}$ square, $6\text{px}$ border-radius.
  * Background: Pure White (`#FFFFFF`).
  * Border: $2.5\text{px}$ solid Petrol 40% (`#79AEBF`).
* **Selected State:**
  * **Background:** **Daimler Yellow (`#FFFF40`)** (STRICT: Never golden yellow or petrol).
  * **Border:** `#D6D600`.
  * **Checkmark:** Solid Black (`#000000`, SVG stroke $3.6\text{px}$).

---

## 5. Submit Button (`.daimler-btn-submit`)
* **Enabled State:**
  * Background: Corporate Petrol (`#00677F` gradient to `#004355`).
  * Typography: Daimler CS Bold (Upright), pure white `#FFFFFF`.
  * Shape: Stadium pill ($50\text{–}56\text{px}$ height, $28\text{px}$ radius).
  * Border: $2\text{px}$ solid `#FFFFFF`.
  * Arrow: Inline SVG chevron `>`.
* **Disabled State:**
  * Background: Light Grey (`#E6E6E6`).
  * Text Color: Mid Grey (`#888888`).
  * Cursor: `not-allowed`.

---

## 6. Post-Feedback Review State
* **Correct & Selected Option:**
  * Border: $3\text{px}$ solid Green (`#28A745`).
  * Background: Soft green tint (`#E8F7ED`).
  * Checkbox: Green fill (`#008248`) with white checkmark.
  * Badge: Upper-right pill with `"✓ Selected"`.
* **Missed Correct Option:**
  * Border: $3\text{px}$ solid Amber (`#E67E22`).
  * Background: Soft amber tint (`#FFF8E7`).
  * Checkbox: White fill, amber border, green checkmark (`#008248`).
  * Badge: Upper-right pill with `"Missed"`.
