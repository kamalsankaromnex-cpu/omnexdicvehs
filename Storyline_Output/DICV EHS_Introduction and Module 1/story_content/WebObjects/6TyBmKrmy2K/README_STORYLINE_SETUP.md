# Storyline 360 Setup Guide — Option B Six-Topic Module 1

Follow these steps in **Articulate Storyline 360** to wire the Course Map for the six Module 1 topics in the existing 1–22 slide sequence.

---

## Step 1: Create the Storyline Variables

Open **Manage Project Variables** (`X` icon in the Triggers panel) and create these exact variables:

| Variable Name | Type | Default Value | Purpose |
| :--- | :--- | :--- | :--- |
| `NavigationMode` | **True/False** | `False` | `False` = Restricted (default), `True` = Free mode |
| `CourseProgressData` | **Text** | *(leave blank)* | Stores compact JSON progress (`0`, `1`, `2`) |
| `RequestedMission` | **Number** | `0` | Destination ID (`101`, `103`, `102`, `104`, `105`, `106`) |
| `CourseMapCloseRequested` | **True/False** | `False` | Changes each time the learner returns to the current lesson |

---

## Step 2: Set Up the Slide Master Layer `CourseMapOverlay`

1. Go to **View → Slide Master** and select your main **Master Slide**.
2. Create a new Slide Layer named **`CourseMapOverlay`**.
3. On `CourseMapOverlay`, go to **Insert → Web Object**, browse to `WebObjects/dist/CourseMap/`, and choose **Display in slide** (`1820 × 900`).
4. On the Master base layer, add a **Map** button in the header with trigger:
   - **Action:** `Show layer` → `CourseMapOverlay` → **When:** `User clicks` → `Map Button`.
5. On `CourseMapOverlay`, add a trigger to **Hide layer → This layer** when the variable `CourseMapCloseRequested` changes. Leave the trigger unconditional so both Boolean values can close the layer.

---

## Step 3: Load the Storyline Host Helper & Reset `RequestedMission`

On the **Master Slide** (`When timeline starts`):
1. **Trigger 1 (`Execute JavaScript`):** Paste contents of `coursemap-data.js`.
2. **Trigger 2 (`Execute JavaScript`):** Paste contents of `coursemap-storyline-host.js`.
3. **Trigger 3 (`Adjust variable`):** `Set RequestedMission to value 0` — **When:** `Timeline starts on This slide`.
   - **PRECAUTION (Verify in Published Storyline Output):** Test carefully in published Storyline output to confirm that the Master Slide timeline-start reset executes on the *destination* slide after `Jump to slide` and does **not** clear `RequestedMission` before `CourseMapOverlay`'s jump triggers read it.

---

## Step 4: Safe `CourseMapOverlay` Navigation Handshake

On `CourseMapOverlay`, place **`Hide layer`** **BEFORE** the **`Jump to slide`** triggers (because Storyline stops executing trailing triggers on the same layer once `Jump to slide` fires):

1. `Hide layer` → `This layer` — **When:** `Variable changes` → `RequestedMission` (**If** `RequestedMission > 0`)
2. `Jump to slide` → **Slide 2 (`Why Safety Matters – Introduction`)** — **When:** `Variable changes` → `RequestedMission` (**If** `RequestedMission == 101`)
3. `Jump to slide` → **Slide 10 (`What Makes a Safer Workplace?`)** — **When:** `Variable changes` → `RequestedMission` (**If** `RequestedMission == 103`)
4. `Jump to slide` → **Slide 12 (`EHS Vision – Interactive Question`)** — **When:** `Variable changes` → `RequestedMission` (**If** `RequestedMission == 102`)
5. `Jump to slide` → **Slide 14 (`Safety Strategy – Drag and Drop`)** — **When:** `Variable changes` → `RequestedMission` (**If** `RequestedMission == 104`)
6. `Jump to slide` → **Slide 16 (`Safety Culture – Drag and Drop`)** — **When:** `Variable changes` → `RequestedMission` (**If** `RequestedMission == 105`)
7. `Jump to slide` → **Slide 18 (`Safety Review Structure – Question 1`)** — **When:** `Variable changes` → `RequestedMission` (**If** `RequestedMission == 106`)

*(Verify that **Slide 8: EHS Training Journey** does not reset `CourseProgressData` on revisit.)*

---

## Step 5: Topic Completion Checkpoints (No Unearned Completion)

Only call `markTopicStatus(id, 2)` after the required quiz/activity completes:
- **Slide 4 (`Why Safety Matters – Answer Reveal`):** **If** `Q001_Done == True` → `if (window.DICV_CourseMapHost) window.DICV_CourseMapHost.markTopicStatus(101, 2);`
- **Slide 11 (`DICV's Commitment`):** **If** `Q002_Done == True` → `if (window.DICV_CourseMapHost) window.DICV_CourseMapHost.markTopicStatus(103, 2);`
- **Slide 13 (`EHS Vision – Explanation`):** **If** `Q003_Done == True` → `if (window.DICV_CourseMapHost) window.DICV_CourseMapHost.markTopicStatus(102, 2);`
- **Slide 15 (`Safety Strategy – Three Pillars`):** **If** `Q004_Done == True` → `if (window.DICV_CourseMapHost) window.DICV_CourseMapHost.markTopicStatus(104, 2);`
- **Slide 17 (`Safety Culture – Bradley Curve`):** **If** `Q005_Done == True` → `if (window.DICV_CourseMapHost) window.DICV_CourseMapHost.markTopicStatus(105, 2);`
- **Slide 21 (`Safety Review Structure – Explanation`):** **ONLY if** `Q006_R1_Done == True` **AND** `Q006_R2_Done == True` **AND** `Q006_R3_Done == True` and the explanation completes → `if (window.DICV_CourseMapHost) window.DICV_CourseMapHost.markTopicStatus(106, 2);` *(Gate Reward Stars so revisiting Slide 21 does not replay rewards.)*

---

## Step 6: `L` Key Shortcut (Master Slide Only)
- **Action:** `Execute JavaScript` → **When user presses key: `L`**
  ```javascript
  if (window.DICV_CourseMapHost) window.DICV_CourseMapHost.toggleNavigationMode();
  ```

---

## Step 7: Testing & Verification Status
- **Do NOT test in Storyline Desktop Preview (F12)** — Desktop Preview blocks `GetPlayer()`.
- **Local JS & UI Tests:** Verified in Node + Headless Chrome.
- **Published Storyline Navigation & Trigger Order:** **NOT VERIFIED** until tested in published Storyline 360 Web/Review 360 output.
- **Oracle LMS / SCORM Resume:** **NOT VERIFIED** until tested in published SCORM output on Oracle LMS.
