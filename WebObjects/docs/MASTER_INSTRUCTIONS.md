# MASTER INSTRUCTIONS — DICV Interactive Web Object System

**Project:** `D:\Development\Projects\dicv-interactive`
**Module:** `WebObjects/`
**Use:** Multiple independent HTML/CSS/JS Web Objects embedded in Articulate Storyline 360 and delivered via the organization's approved Oracle LMS publishing setup.

## Non-negotiable rules
- Inspect workspace before changing anything; preserve all existing unrelated files.
- **Asset Integrity & Immutability**: NEVER overwrite, downscale, or replace user-provided or production assets in `assets/` with mock crops. Treat high-resolution production assets ($314 \times 176\text{ px}$ or higher) as the immutable single source of truth.
- **Zero-404 SCORM LMS Delivery**: Standalone distribution bundles (`dist/<quiz-id>/index.html`) MUST inline all images and fonts as Base64 Data URIs to eliminate broken images caused by LMS iframe relative-path issues or IIS `.ttf` MIME-type restrictions.
- **Canvas-Scaled Typography Hierarchy**: Scale typography proportionally to canvas dimensions. For wide/tall canvases ($800-960\text{ px}$), Question Headline must be $\mathbf{28-30\text{ px}}$, Option Letters/Titles must be $\mathbf{24-26\text{ px}}$, Instructions must be $\mathbf{16-17\text{ px}}$, and Buttons must be $\mathbf{18\text{ px}}$ ($50\text{ px}$ height). Never use tiny font sizes ($< 22\text{ px}$ options) on large Storyline canvases.
- **Single-Line Headline Rule**: In wide canvases ($\ge 800\text{ px}$), ensure question headlines span across a single continuous line without hardcoded `<br>` tags or premature line wraps.
- Every quiz has a unique stable ID, own source folder, `quiz.json`, `README.md`, `PROMPT.md`, and independent distributable `dist/<quiz-id>/index.html`.
- Shared design/system code in development; embed/bundle everything necessary into each publishable Web Object. No runtime paths outside its distribution folder; no CDNs.
- Different exact pixel canvas sizes are allowed per quiz. Dimensions are configured per quiz. **Do not stretch** or crop essential controls or content.
- All outer quiz canvases and cards use rounded corners; consistent controls, fonts, colors, interaction states, and animation guidelines.
- Corporate fonts: use supplied, licensed Daimler CS Regular/Bold only once file metadata and packaging rights have been checked. If missing or unlicensed for embedding, use clearly documented fallback and flag for approval. Do not copy or upload fonts elsewhere.
- Feedback (Correct/Incorrect narrative, voice, and explanations) appears **only on Storyline feedback layers** (or direct slide advance if configured). The HTML base quiz reveals correct-answer indicators when Storyline commands it, not a duplicate HTML feedback popup.
- No guessing of correct answers, policies, machine operation, or safety training content. Source approval required.
- One submission per quiz per authorized attempt. No duplicate lives/stars/score events. Revisit restores state and locks submitted quizzes.
- Review 360 can test interactions, but LMS resume must be tested separately in a compliant SCORM/LMS launch.

## Responsibilities
**HTML:** render, input, validation of basic allowed interaction and approved keys when explicitly designed, submit event, synchronized selection, readonly/reveal visuals.
**Storyline:** authoritative submitted/answer/reveal state, feedback layer, scoring, lives, stars, navigation, retry policy and LMS suspend/resume. **One approved canonical answer key** must drive consistent result and reveal behavior; document whether evaluation is in JS or Storyline, never maintain unsynchronized duplicate keys.

## Implementation phases
1. Audit workspace + references; report missing inputs and conflicts.
2. Implement central design tokens and accessible shared UI components.
3. Implement bridge protocol and parent simulation harness including negative cases.
4. Implement Q001 with approved inputs and exact canvas.
5. Package as standalone folder and verify assets work in published location.
6. Validate Storyline layer overlay and command handshake; revisit and persistence.
7. Pilot a second quiz with different type/canvas; then scale across types.

## Per-quiz mandatory files
- `index.html`: local development entry, linked to shared code in source only
- `quiz.json`: ID, type, dimensions, answer assets, key source, reveal policy, variable mapping
- `assets/`: quiz-specific images/icons
- `README.md`: specification, source approval, imports and status
- `PROMPT.md`: reproducible instructions for Antigravity, including UI screenshots and exact behavior
- `dist/<quiz-id>/index.html` plus self-contained assets (created by build)

## Submission and revisit requirements
On load, the quiz is visually disabled until Storyline sends authoritative state. If available, restore draft selections. When submitted, lock editing and Submit/Reset. Display saved answer selection and, once feedback acknowledged/dismissed, reveal correct answers. On revisit do not replay feedback or apply new life/reward. On authorized **new attempt only**, clear prior state. If Storyline state unavailable, report recoverable UI error; never silently reset/unlock a previously submitted quiz. Handle event idempotency, retries/timeouts, and duplicate iframe loads.

## Definition of done
Written code, automated/unit tests, screenshot check at each exact canvas, build package inspection, manual Storyline integration checklist and evidence. Do not mark LMS resume as passed until tested on target LMS. Update each quiz README and PROMPT when implementation changes.
