# DICV Interactive — Quiz Integration & Review Hub (User Guide)

Welcome to the centralized **Quiz Integration & Review Hub** for the DICV Interactive Safety eLearning project (`Q001–Q006`).
This dashboard is designed for instructional designers, Storyline 360 authors, QA reviewers, and project stakeholders—no coding knowledge required.

---

## How to Launch Locally (Recommended)

Because modern browsers restrict some local `file://` iframe interactions, start a **localhost-only** server from `D:\Development\Projects\dicv-interactive`:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8765/ReviewHub/index.html
```

> **Security Note:** `--bind 127.0.0.1` keeps the hub accessible **only** on your own computer and does not expose it on the local network.

---

## What You Can Do in the Hub

1. **Project Overview:** Check verified counts (`6` quizzes, `8` Web Objects, `3` Q006 slides) and current build, Storyline, animation, and Oracle LMS statuses.
2. **Quiz Library & Detail Pages:** Browse `Q001` through `Q006_R3`, inspect answer keys, preview each live HTML quiz in an isolated sandbox, and simulate Storyline reveal/reset signals safely.
3. **Storyline Integration Wizard:** Follow the 9-step guide tailored to whichever quiz (`Q001–Q006_R3`) you are building.
4. **Variables & Flow:** View the interactive Storyline lifecycle diagram (normal, incorrect, revisit, interrupted, LMS resume) and exact variable names.
5. **Animation Library:** Preview proposed & existing motion behaviors and check their approval status.
6. **Testing & Status / Troubleshooting / Files & Docs:** Check verified test matrices, resolve common Storyline/LMS symptoms, and download `WebObjects/dist/*.zip` packages.

---

## Important Boundaries

- **Isolated Preview:** Previews inside `ReviewHub` never write to production Storyline variables or Oracle LMS.
- **Desktop Preview Warning:** Never use Articulate Storyline's **Preview (F12)** to test Web Object submission—always test using **Publish → Web**, **Review 360**, or **Publish → LMS (SCORM)**.
