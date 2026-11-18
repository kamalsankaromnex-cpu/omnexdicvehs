# Paste this into Google Antigravity

Open and inspect the existing workspace `D:\Development\Projects\dicv-interactive`. A starter `WebObjects/` module and requirements files have been supplied. Do not overwrite unrelated files. Read in order:

1. `WebObjects/README_START_HERE.md`
2. `WebObjects/docs/MASTER_INSTRUCTIONS.md`
3. `WebObjects/docs/DESIGN_SYSTEM.md`
4. `WebObjects/docs/QUIZ_TYPES.md`
5. `WebObjects/docs/STORYLINE_INTEGRATION.md`
6. `WebObjects/docs/QA_CHECKLIST.md`
7. `WebObjects/quizzes/Q001_AccidentPrediction/README.md` and `PROMPT.md`

**First deliverable (before coding):** report existing project files, identified reference materials, missing inputs, conflicts, proposed structure, development phases and acceptance tests. Never fabricate missing Q001 questions, answer keys, font files, design guidelines or images.

**After inspection:** create the shared design system, accessible quiz components, bridge framework and simulated Storyline parent harness. Treat `shared/styles/theme.css` as a starting point, not authoritative approved styling. Write an independently packaged build process and package manifest. Implement Q001 only after its approved screenshot, assets, content and correct answer key are supplied. Use one stable quiz ID, individually configurable canvas, rounded corners and Daimler CS fonts if available and authorized for web embedding. Keep HTML feedback-free; Storyline owns its feedback layer. Reveal approved answers in HTML only after the Storyline reveal command; lock submitted state across revisits and verified LMS resume. For each quiz generate README, PROMPT and standalone `dist/` export. Test, report evidence, do not mark real LMS resume as passing without actual LMS tests.

**Do not build all 16 types at once.**
