# DICV Interactive — WebObjects starter package

**Target workspace:** `D:\Development\Projects\dicv-interactive`

Extract this ZIP into the existing workspace so its top-level `WebObjects` directory sits at `D:\Development\Projects\dicv-interactive\WebObjects`. Do not replace existing files without reviewing differences.

## What is included
- `docs/MASTER_INSTRUCTIONS.md`: master requirements for multiple independent HTML Web Objects
- `docs/QUIZ_TYPES.md`: 16 quiz/gameplay types and expected interactions
- `docs/STORYLINE_INTEGRATION.md`: state machine, event contract, and feedback/revisit requirements
- `docs/DESIGN_SYSTEM.md`: design tokens, font handling, UI, accessibility and sizing
- `docs/QA_CHECKLIST.md`: browser, Storyline, SCORM/Oracle acceptance tests
- `docs/ANTIGRAVITY_FIRST_PROMPT.md`: paste this into Antigravity as the first prompt
- `quizzes/Q001_AccidentPrediction/`: README, PROMPT, and content config template only
- `shared/styles/theme.css`: starter color/font styling (not an approved final design)
- `scripts/`: location for build scripts; build logic must be implemented and verified
- `references/`: designated locations for reference assets

## You must supply before Q001 implementation
1. Licensed Daimler CS font files **and approval to embed the fonts in published web packages**.
2. Official Daimler design guidelines (if available) and approved design references.
3. Actual Q001 reference screenshot and its original image/icon assets or rights-cleared replacements.
4. Approved question text, answer options, and authoritative answer key.
5. Storyline source/project and eventual LMS environment for integration testing (not required for folder initialization).

**Do not use the example Q001 ID or question as authorization to invent training content.** Q001 is a placeholder pilot.

## First actions
1. Copy font files to `references/fonts/`, guideline PDFs to `references/design-guidelines/`, screenshots to `references/quiz-screenshots/`, and approved content to `references/approved-content/`.
2. Open workspace in Google Antigravity.
3. Paste `docs/ANTIGRAVITY_FIRST_PROMPT.md` into its Agent chat.
4. Have Antigravity inspect and report first; then implement a single pilot quiz before scaling.
