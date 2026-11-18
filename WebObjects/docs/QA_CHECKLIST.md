# QA Acceptance Checklist

## 1. Visual Geometry & Typography Rules
- [ ] **No Hardcoded `<br>` in Headings**: Never manually break question or instruction text with `<br>` tags unless structurally required by curriculum. Measure font bounding boxes so text flows naturally or uses `text-wrap: balance` without orphaned 1-2 word lines.
- [ ] **Unified Vertical Spacing Budget**: Calculate the exact pixel budget before building:
  $$\text{Canvas Height} = \text{Header} + \text{Instruction} + \sum(\text{Cards}) + \sum(\text{Gaps}) + \text{Buttons} + \text{Margins}$$
  Ensure zero unallocated dead space at the bottom and uniform gaps between interactive elements.
- [ ] **Shared Horizontal Column Guides**: The left margin of cards, header text, and footer status text MUST align to the exact same vertical guide (e.g. `X = 20 px`). The right edge of cards and Submit buttons must align to the exact same right guide (e.g. `X = 568 px`).
- [ ] **Seamless Background Surfaces**: Do not introduce artificial divider borders or grey container boxes (such as shaded footers) that fragment the card canvas unless explicitly mandated by signed-off references.
- [ ] **Animation & Capture Safety**: Keyframe animations must default initial state to `opacity: 1` (animating transforms rather than transparent delays) so headless automated testing captures 100% visible elements.

## 2. Brand & Functional Integration
- [ ] All needed inputs exist and question/answers approved; no placeholders in final package.
- [ ] Actual licensed font load is verified (or fallback/approval issue documented).
- [ ] Accurate Daimler colors, rounded corners, shared UI tokens and components.
- [ ] Canvas tested at quiz-specific width/height, at target Storyline placement; no distortion/clipping.
- [ ] Images/icons load offline from export folder; no remote dependencies.
- [ ] Mouse/keyboard/touch where relevant; focus visible and accessible alternative provided.
- [ ] Submit disabled when no valid response; Reset works before submission.
- [ ] Storyline initialization handshake; no premature Submit before authoritative state.
- [ ] Submission delivered once, acknowledged, state persisted before feedback.
- [ ] Correct Storyline feedback layer (or direct slide jump if configured) triggers as designed; no rogue HTML popups.
- [ ] Closing feedback reveals approved answers in HTML; correct set accurate.
- [ ] Leaving slide before Submit restores draft selections.
- [ ] Revisit after Submit restores saved answers/reveal; locks all controls; no repeated rewards/lives.
- [ ] Page refresh and LMS relaunch checked independently; new authorized attempt works.
- [ ] Same-origin and cross-origin bridge compatibility tested in real published player.
- [ ] Export includes every needed file and standalone `index.html`; imports into Storyline.
- [ ] README/PROMPT and per-quiz Storyline mapping updated.
- [ ] Review 360 interaction validation recorded (not claimed as LMS persistence validation).
- [ ] Oracle LMS/SCORM Cloud pilot evidence captured for suspend/resume and attempt reset.

## 3. Recurring Issue Prevention (Mandatory Pre-Flight Checks)
- [ ] **Asset Protection & Immutability**: Never overwrite user-provided or production assets in `assets/` with mock crops. Verify that `dist/` contains high-resolution production assets ($314 \times 176\text{ px}$ or higher) rather than downgraded placeholders.
- [ ] **Zero-404 SCORM Inlining**: Standalone `dist/index.html` MUST embed all image thumbnails as Base64 Data URIs (`src="data:image/png;base64,..."`). This eliminates LMS iframe sandbox, CDN rewrite, and Microsoft IIS subdirectory MIME-type 404 failures.
- [ ] **Font Embedding in SCORM**: TTF fonts must be base64-embedded directly into `dist/fonts.css` with local TTF fallback so LMS web servers that do not map `.ttf` MIME types never trigger missing font alerts.
- [ ] **Canvas-Scaled Typography Hierarchy**:
  - Small Canvas ($\le 600\text{ px}$ width): Headline $\ge 22-24\text{ px}$, Option Letters/Titles $\ge 19-21\text{ px}$.
  - Medium/Large Canvas ($800-960\text{ px}$ width): Headline $\mathbf{28-30\text{ px}}$ (Bold), Option Letters & Titles $\mathbf{24-26\text{ px}}$ (Bold), Instructions $\mathbf{16-17\text{ px}}$, Buttons $\mathbf{18\text{ px}}$ ($50\text{ px}$ height).
  - Never use small font sizes ($< 22\text{ px}$ for options or $< 26\text{ px}$ for headlines) on large canvases; they become unreadable inside scaled Storyline slides.
- [ ] **Single-Line Headline Rule**: In wide canvases ($\ge 800\text{ px}$), ensure question headlines span across a single continuous line without hardcoded `<br>` tags or premature line wraps.
- [ ] **Direct Slide Advance Mode**: When the design calls for "direct advance / no feedback", ensure `submitQuiz()` executes a forced toggle: `SetVar('Qxxx_Done', false)` followed by `SetVar('Qxxx_Done', true)`. This guarantees Storyline's *"When variable changes"* trigger fires even if the variable was previously `True`.
- [ ] **Dynamic Player Resolution**: The bridge must resolve `getPlayer()` on-demand at submit time (checking `window.parent`, `window.top`, and parent frame trees) to protect against asynchronous player initialization delays.
- [ ] **Storyline Preview Testing Rule**: Never test Web Object JavaScript communication or slide jumps using Storyline 360's built-in "Preview" (F12) window where iframe communication is blocked by Articulate's CEF sandbox. Always validate in **Published Web**, **Review 360**, or **SCORM LMS**.
- [ ] **Case-Insensitive Variable Safety**: Ensure Storyline variable names match the exact casing (e.g. `Q001_Done`), and verify that the bridge dispatches lowercase fallbacks (`q001_done`).
- [ ] **Mathematical Vertical Budget**: The exact vertical sum ($\text{Header} + \text{Instruction} + \text{Cards} + \text{Gaps} + \text{Buttons} + \text{Bottom Margin}$) must equal canvas height with bottom margin balancing the gap above the buttons.
