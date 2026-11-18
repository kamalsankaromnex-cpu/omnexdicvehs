/**
 * global-controls-data.js — Final Two-Header System, Progressive Visibility,
 * Button State Library, Storyline Modern Player Controls & Slide Navigation Matrix.
 * Extends Story View without modifying production quiz, CourseMap, or .story files.
 */
(function (root) {
  'use strict';

  var HEADER_STYLING = {
    header1Bg: '#080A0C',
    header2Bg: '#004355',
    header2Accent: '#FFFF40',
    normalBg: 'Transparent / #080A0C',
    normalBorder: 'None',
    normalIcon: '#FFFFFF',
    hoverBg: '#24282B',
    hoverIcon: '#FFFF40',
    downBg: '#004355',
    downIcon: '#FFFF40',
    disabledBg: '#080A0C',
    disabledIcon: '#6E777C',
    focusRing: '2px solid #FFFF40',
    starColor: '#FFFF40',
    lifeColor: 'Existing approved Life/Heart color'
  };

  var BUTTON_INVENTORY = [
    {
      buttonId: 'btn_Global_Guidelines',
      displayLabel: 'Guidelines',
      systemType: 'Storyline Slide Master Button',
      location: 'Header 1 (#080A0C) — Layouts B & C',
      objectName: 'Proposed: btn_Global_Guidelines (book icon)',
      purpose: 'Reopens Slide 7 (Mission Guidelines) in a lightbox during training without losing progress.',
      triggerAction: 'Lightbox Slide → Slide 7 (Mission Guidelines)',
      triggerEvent: 'User clicks',
      condition: 'Hidden on Slides 1–7 and Mission Complete; visible on Slide 8, Overviews, Training, Quizzes, Explanations, Star Earned',
      destination: 'Slide 7 (Lightbox)',
      states: 'Normal (white on #080A0C) / Hover (#24282B + #FFFF40) / Down (#004355) / Disabled / Focus (2px #FFFF40)',
      duplicatePrevention: 'Lightbox modal blocks background clicks; do not create a duplicate Guidelines slide',
      revisitBehavior: 'Closing lightbox returns learner to exact slide',
      test: 'Click Guidelines on Slide 14; confirm Slide 7 opens in lightbox and closes back to Slide 14.'
    },
    {
      buttonId: 'btn_Global_Map',
      displayLabel: 'Map',
      systemType: 'Storyline Slide Master Button',
      location: 'Header 1 (#080A0C) — Layout C only',
      objectName: 'Proposed: btn_Global_Map (map icon)',
      purpose: 'Opens Slide 8 (EHS Training Journey) in a lightbox.',
      triggerAction: 'Lightbox Slide → Slide 8 (EHS Training Journey)',
      triggerEvent: 'User clicks',
      condition: 'Hidden on Slides 1–8 and Mission Complete; visible on Module Overviews, Training, Quizzes, Explanations, Star Earned',
      destination: 'Slide 8 (Lightbox)',
      states: 'Normal / Hover (#24282B + #FFFF40) / Down (#004355) / Disabled / Focus (2px #FFFF40)',
      duplicatePrevention: 'Lightbox modal prevents repeated background clicks',
      revisitBehavior: 'Reads live CourseProgressData on open',
      test: 'Verify Map is hidden on Slide 8 and opens Slide 8 lightbox from Slide 14.'
    },
    {
      buttonId: 'btn_Global_Mute',
      displayLabel: 'Mute / Unmute',
      systemType: 'Storyline Slide Master Button (verify vs Player Volume)',
      location: 'Header 1 (#080A0C) — Layouts A, B, C, D',
      objectName: 'Proposed: btn_Global_Mute (Audio On / Audio Muted custom states)',
      purpose: 'Toggles course audio when supported; otherwise retain native Modern Player Volume.',
      triggerAction: 'Toggle supported audio state (or use Player Volume if custom global mute unavailable)',
      triggerEvent: 'User clicks',
      condition: 'Visible when audio control applies; never duplicate Player Volume',
      destination: 'Current slide',
      states: 'Normal / Hover / Down / Disabled / Focus + Audio On & Audio Muted states',
      duplicatePrevention: 'Single audio toggle',
      revisitBehavior: 'Persists across slides & lightboxes',
      test: 'Needs Storyline Verification: Test narration, video, and lightbox audio after toggling Mute.'
    },
    {
      buttonId: 'btn_Global_Exit',
      displayLabel: 'Exit',
      systemType: 'Storyline Slide Master Button',
      location: 'Header 1 (#080A0C) — Layouts A, B, C, D',
      objectName: 'Proposed: btn_Global_Exit',
      purpose: 'Saves suspend_data and exits course cleanly without prematurely marking complete.',
      triggerAction: 'Exit course (with optional approved confirmation layer)',
      triggerEvent: 'User clicks',
      condition: 'Available across course layouts',
      destination: 'LMS Exit / Close',
      states: 'Normal / Hover / Down / Disabled / Focus',
      duplicatePrevention: 'Confirmation / immediate exit',
      revisitBehavior: 'Oracle LMS restores suspend_data on relaunch',
      test: 'Exit mid-module in Oracle LMS; confirm incomplete status and progress restore on relaunch.'
    },
    {
      buttonId: 'btn_Global_Fullscreen',
      displayLabel: 'Fullscreen',
      systemType: 'Storyline Slide Master Button (verify vs Player Fullscreen)',
      location: 'Header 1 (#080A0C) — Layouts A, B, C, D',
      objectName: 'Proposed: btn_Global_Fullscreen (Windowed / Fullscreen custom states)',
      purpose: 'Toggles fullscreen if supported; otherwise retain Modern Player Fullscreen.',
      triggerAction: 'Supported Storyline fullscreen action (or native Player Fullscreen)',
      triggerEvent: 'User clicks',
      condition: 'Supported browser / LMS iframe allow="fullscreen"',
      destination: 'Current slide',
      states: 'Normal / Hover / Down / Disabled / Focus + Windowed & Fullscreen states',
      duplicatePrevention: 'Single fullscreen control',
      revisitBehavior: 'Maintains viewport mode',
      test: 'Needs Storyline Verification: Test entry/exit and Web Object scaling in Chrome & Oracle LMS.'
    },
    {
      buttonId: 'btn_Module_Start',
      displayLabel: 'Start Module',
      systemType: 'Custom Slide Button (Individual Overview Slide)',
      location: 'Module Overview Slides (Slide 9, Orig. Slide 22, M3–M6)',
      objectName: 'Proposed: btn_Module_Start',
      purpose: 'Starts the module’s first approved topic.',
      triggerAction: 'Jump to slide (first topic of module)',
      triggerEvent: 'User clicks',
      condition: 'Restricted mode: module prerequisites == 2 (or Free mode == True)',
      destination: 'First topic slide (e.g. Slide 10 for Module 1)',
      states: 'Normal / Hover / Down / Disabled (if locked) / Focus',
      duplicatePrevention: 'Immediate slide transition',
      revisitBehavior: 'Allows re-entering module',
      test: 'Click on Slide 9 → opens Slide 10.'
    },
    {
      buttonId: 'btn_Topic_Previous',
      displayLabel: 'Previous',
      systemType: 'Custom Slide Button (Native Player Previous DISABLED)',
      location: 'Individual Slides where backward navigation is approved',
      objectName: 'Proposed: btn_Topic_Previous',
      purpose: 'Returns to the previous permitted slide without erasing progress.',
      triggerAction: 'Jump to previous permitted slide',
      triggerEvent: 'User clicks',
      condition: 'Disabled when no permitted earlier destination exists or workflow prohibits going back',
      destination: 'Previous slide',
      states: 'Normal / Hover / Down / Disabled / Focus',
      duplicatePrevention: 'Immediate navigation',
      revisitBehavior: 'Quiz revisits restore via Resume saved state; progress preserved',
      test: 'Verify native Player Previous is OFF and custom Previous preserves Q004_Done.'
    },
    {
      buttonId: 'btn_Topic_Next',
      displayLabel: 'Next',
      systemType: 'Custom Slide Button (Native Player Next DISABLED)',
      location: 'Individual Slides where manual advancement is needed',
      objectName: 'Proposed: btn_Topic_Next',
      purpose: 'Advances to next slide only after required quiz/media completion.',
      triggerAction: 'Jump to next slide (one authoritative decision if auto-advance also exists)',
      triggerEvent: 'User clicks',
      condition: 'Quiz: Qxxx_Done == True & feedback complete. Media: approved completion met.',
      destination: 'Next slide in sequence',
      states: 'Normal / Hover / Down / Disabled (until conditions satisfied) / Focus',
      duplicatePrevention: 'Disabled until gate satisfied; no competing unconditional auto-jump',
      revisitBehavior: 'Enabled on revisit when already completed',
      test: 'Confirm Next stays Disabled before Q004_Done == True and enables after.'
    },
    {
      buttonId: 'btn_HTML_Submit',
      displayLabel: 'Submit',
      systemType: 'HTML Web Object Button (DOM)',
      location: 'Inside HTML Quiz Web Objects (Q001–Q006_R3)',
      objectName: 'HTML DOM Submit Button (Native Player Submit DISABLED)',
      purpose: 'Commits learner answer via StorylineBridge.',
      triggerAction: 'Posts QUIZ_SUBMIT_REQUEST → Storyline sets Qxxx_Done = True & opens Feedback layer',
      triggerEvent: 'User clicks inside Web Object',
      condition: 'Valid selection/drop count met',
      destination: 'Storyline Correct / Incorrect Feedback Layer',
      states: 'Disabled (incomplete) / Enabled / Locked after submit',
      duplicatePrevention: 'StorylineBridge submission lock',
      revisitBehavior: 'Locked & reviewed when Qxxx_Revealed == True',
      test: 'Confirm Native Player Submit is OFF on all 8 quiz slides.'
    },
    {
      buttonId: 'btn_Quiz_Retry',
      displayLabel: 'Retry / Continue',
      systemType: 'Custom Feedback Layer Button',
      location: 'Correct / Incorrect Feedback Layers on Quiz Slides',
      objectName: 'Proposed: btn_Quiz_Retry / Layer Continue',
      purpose: 'Handles retry path if approved or closes feedback to authorize review & Next.',
      triggerAction: 'Hide this layer (+ set Qxxx_Revealed = True)',
      triggerEvent: 'User clicks',
      condition: 'Feedback sequence complete',
      destination: 'Base Quiz Slide',
      states: 'Normal / Hover / Down / Focus',
      duplicatePrevention: 'Hides layer immediately',
      revisitBehavior: 'Reviewed state remains active',
      test: 'Verify closing feedback layer triggers Qxxx_Revealed = True and enables custom Next.'
    },
    {
      buttonId: 'btn_Module_Continue',
      displayLabel: 'Continue',
      systemType: 'Custom Slide Button (Star Earned Slides)',
      location: 'Module 1–6 Star Earned Slides',
      objectName: 'Proposed: btn_Module_Continue',
      purpose: 'Advances from earned star celebration to next Module Overview.',
      triggerAction: 'Jump to next Module Overview (or Mission Complete after Star 6)',
      triggerEvent: 'User clicks',
      condition: 'Authoritative module gate verified; celebration sequence complete',
      destination: 'Next Module Overview',
      states: 'Normal / Hover / Down / Disabled (during entrance) / Focus',
      duplicatePrevention: 'Does not re-award star',
      revisitBehavior: 'Star stays earned; Continue enabled',
      test: 'Click Continue on Module 1 — Star Earned → opens Original Slide 22.'
    },
    {
      buttonId: 'btn_Mission_Finish',
      displayLabel: 'Finish / Exit',
      location: 'Mission Complete Final Slide',
      systemType: 'Custom Slide Button',
      objectName: 'Proposed: btn_Mission_Finish',
      purpose: 'Completes/exits the six-star mission after all 6 modules are verified.',
      triggerAction: 'Complete course (if not already fired) + Exit course',
      triggerEvent: 'User clicks',
      condition: 'All 6 modules == Complete & 6 stars verified',
      destination: 'LMS Exit',
      states: 'Normal / Hover / Down / Focus',
      duplicatePrevention: 'Completion gate prevents premature LMS completion',
      revisitBehavior: 'Restores 6-star completed state',
      test: 'Test in Oracle LMS to confirm completion + 6-star state persist.'
    }
  ];

  var GLOBAL_UI_NODES = [
    {
      id: 'ui_course_setup', no: 'UI-00', originalNo: null, displayOrder: 'G0',
      title: 'Storyline 360 Course Setup Guide (Start Here)',
      sceneId: 'global_ui', sceneName: 'Global UI & Player Controls',
      slideType: 'Authoring Guide', originStatus: 'Baseline', visualBadge: 'Reference',
      purpose: 'Complete beginner-friendly Articulate Storyline 360 construction manual: create the .story project, set 1920×1080 (16:9), organize Scenes, build Slide Master Layouts A–D (Hybrid Header 1 HTML Web Object + Native Header 2), create variables, insert Web Objects, configure Triggers/States/Layers/Slide Properties, and publish SCORM for Oracle LMS.',
      whatToBuild: [
        '1. Project & Slide Size: New .story → Design → Slide Size → Custom 1920 × 1080 (16:9)',
        '2. Scenes: Intro (Slides 1–7), Course Journey (Slide 8), Module 1–6 Scenes (Overview + Training/Quizzes + Star Earned), Mission Complete',
        '3. Variables: CourseProgressData, NavigationMode, RequestedMission, HeaderProfile (A/B/C/D), HeaderAction, M1_CompletedCount (0–6), Qxxx_Done / Qxxx_Revealed',
        '4. Hybrid Headers on Slide Master: Header 1 = WebObjects/dist/Header1/ (1920×80 at X=0, Y=0); Header 2 = Native #004355 bar (1920×50 at X=0, Y=80) on training/quiz/explanation slides ONLY',
        '5. Web Objects: Insert → Web Object → Browse local dist folder (Header1, CourseMap, Q001–Q006_R3) — never point to external URLs',
        '6. Modern Player & SCORM: Disable Player Previous/Next/Menu/Submit; keep Play/Pause, Seekbar, Volume, Captions, Accessibility; Publish SCORM 1.2 / 2004 for Oracle LMS'
      ],
      storylineTimeline: { storyline: ['1920×1080 Storyline 360 project skeleton + Slide Master + Variables + Player'], webObject: ['WebObjects/dist/Header1/, CourseMap/, Q001–Q006_R3/'] },
      navigation: 'Custom slide buttons + conditional auto-advance only. Built-in Player Previous/Next are OFF.',
      completionRule: 'CourseProgressData is the single source of truth; M1_CompletedCount derives 0–6 for Header 2.',
      revisitResume: 'Configure Slide Properties revisit behavior per slide + Oracle LMS Resume = Always resume / Prompt to resume.',
      clickByClick: [
        {
          what: 'Step 1: Create Project & Set 1920×1080 Slide Size',
          where: 'File → New → Design tab → Slide Size',
          how: 'Select Custom, uncheck Lock Aspect Ratio if needed, enter Width = 1920 px, Height = 1080 px, then click OK.',
          expected: 'All slides and Web Objects align 1:1 to 1920×1080 coordinates (Header 1 at Y=0 H=80; Header 2 at Y=80 H=50).',
          test: 'Check Design → Slide Size shows 1920 × 1080.',
          mistakes: 'Leaving default 720×540 or 960×540 causes Header 1 and quiz Web Objects to scale blurry or clip.'
        },
        {
          what: 'Step 2: Create Required Storyline Variables',
          where: 'Home / Triggers panel → Manage Project Variables (x icon)',
          how: 'Create Text variables: CourseProgressData (default "{}"), HeaderProfile (default "A"), HeaderAction (default ""). Create Number variables: RequestedMission (default 0), M1_CompletedCount (default 0), LivesRemaining (default 3), M1_Lives..M6_Lives (default 3). Create True/False variables: NavigationMode (default False), CourseMapCloseRequested (default False), M1_BonusRefillUsed..M6_BonusRefillUsed (default False), plus per-quiz Qxxx_Done, Qxxx_Correct, Qxxx_Revealed, and Q002..Q006_R3_LifeDeducted (default False; NO LifeDeducted for Q001).',
          expected: 'Web Objects (Header1, CourseMap, Q001–Q006_R3) and Storyline Life Meter triggers read/write variables via GetPlayer().',
          test: 'Open Project Variables window and verify exact case-sensitive spelling and types.',
          mistakes: 'Setting NavigationMode as Text or RequestedMission as Text breaks coursemap-storyline-host.js; adding a deduction guard for Q001 violates the approved intro rule.'
        },
        {
          what: 'Step 3: Build Slide Master Hybrid Headers (Layouts A, B, C, D)',
          where: 'View → Slide Master',
          how: 'On Layouts A, B, C, D: Insert → Web Object → Browse WebObjects/dist/Header1/ → position at X=0, Y=0, W=1920, H=80. Add Trigger: Adjust variable HeaderProfile = "A" (or B/C/D) when timeline starts on this layout. Add Triggers: When HeaderAction changes → Lightbox Slide 7 (if "OPEN_GUIDELINES"), Lightbox Slide 8 (if "OPEN_MAP"), Exit course (if "EXIT_COURSE"). On Layout C (Training/Quiz/Explanation ONLY), add Native Header 2 rectangle (#004355, X=0, Y=80, W=1920, H=50) + 4px #FFFF40 left accent + Module/Topic text + 6 native segments driven by M1_CompletedCount.',
          expected: 'Header 1 renders as a crisp HTML bar; Header 2 renders as a pure informational native Storyline bar with zero buttons.',
          test: 'Preview Scene 1 and Module 1 to verify Header 1 profile switching and Header 2 visibility.',
          mistakes: 'Do NOT build a second Web Object for Header 2 or combine Header 1 + Header 2 into one Web Object.'
        },
        {
          what: 'Step 4: Insert Quiz & Course Map Web Objects + Configure States/Layers/Triggers',
          where: 'Slide 8 (CourseMap) & Quiz Slides (Q001–Q006_R3)',
          how: 'Insert → Web Object → Browse WebObjects/dist/CourseMap/ (on Slide Master Layer CourseMapOverlay at X=60, Y=50, W=1800, H=980 over a 1920×1080 60% dark backdrop) and Q001_AccidentPrediction/..Q006_R3/ (on quiz slides at Y=130, H=950). Create Correct & Incorrect Feedback Layers on each quiz slide. Set custom Next button Initial State = Disabled; enable when Qxxx_Revealed changes to True.',
          expected: 'Quiz submits via StorylineBridge, opens Feedback layer, unlocks Next on reveal.',
          test: 'Preview in Storyline / Review 360 and verify Next stays Disabled until feedback is revealed.',
          mistakes: 'Leaving Player Submit or Player Next enabled creates duplicate buttons and bypasses gating.'
        },
        {
          what: 'Step 5: Configure Modern Player & Publish SCORM for Oracle LMS',
          where: 'Home → Player → Features & Publish → LMS/LRS',
          how: 'In Modern Player, turn OFF Menu, Previous, Next, Submit. Keep Play/Pause, Seekbar, Volume, Captions, Accessibility, Fullscreen. In Publish → LMS/LRS, select SCORM 1.2 (or SCORM 2004 per Oracle LMS team), set Tracking to completion trigger / verified quiz completion, and export zip.',
          expected: 'Clean single-source navigation and valid SCORM package ready for Oracle LMS testing.',
          test: 'Needs Storyline & Oracle LMS Verification: Upload published SCORM zip to Oracle LMS sandbox and test Suspend/Resume + Completion.',
          mistakes: 'Using "When user visits X slides" tracking marks the course complete without verifying quizzes.'
        }
      ],
      checklistItems: [
        'Set Slide Size to 1920 × 1080 (16:9)',
        'Create all case-sensitive Storyline variables (CourseProgressData, HeaderProfile, HeaderAction, M1_CompletedCount, etc.)',
        'Insert WebObjects/dist/Header1/ on Slide Master Layouts A–D (1920×80 at X=0, Y=0)',
        'Build Native Header 2 (#004355, 48–52px) on training/quiz/explanation slides ONLY (zero buttons)',
        'Disable Player Previous/Next/Menu/Submit and publish SCORM for Oracle LMS testing'
      ],
      unverifiedNotes: ['Needs Storyline & Oracle LMS Verification: Web Object HeaderAction triggers (especially TOGGLE_MUTE / TOGGLE_FULLSCREEN) and SCORM resume must be tested in published Storyline output inside Oracle LMS.']
    },
    {
      id: 'ui_header1', no: 'UI-01', originalNo: null, displayOrder: 'G1',
      title: 'Header 1 — HTML Web Object (#080A0C)',
      sceneId: 'global_ui', sceneName: 'Global UI & Player Controls',
      slideType: 'Global Header', originStatus: 'Proposed / To Build', visualBadge: 'Proposed',
      purpose: 'Reusable HTML/CSS/JS Web Object (WebObjects/dist/Header1/) placed at X=0, Y=0 (1920×80 px) on Slide Master Layouts A–D. Renders Daimler Truck branding, non-clickable 3-heart Life Meter & Six-Star Progress (0/6 in #FFFF40), and 5 accessible <button> controls: Guidelines, Course Map, Mute, Exit, Fullscreen. Emits whitelisted HeaderAction requests to Storyline.',
      whatToBuild: [
        'Package WebObjects/dist/Header1/ inserted via Insert → Web Object on Slide Master Layouts A–D (1920×80 px at X=0, Y=0)',
        'Reads CourseProgressData & HeaderProfile (A, B, C, D) from Storyline GetPlayer() — zero quiz logic inside Header 1',
        'Non-clickable status indicators: Life/Heart + Six-Star Progress (#FFFF40)',
        '5 interactive <button> controls in order: Guidelines, Course Map, Mute/Unmute, Exit, Fullscreen (Normal transparent / Hover #24282B / Pressed #004355 / Disabled muted grey / Focus #FFFF40 outline)',
        'Emits HeaderAction (OPEN_GUIDELINES, OPEN_MAP, TOGGLE_MUTE, EXIT_COURSE, TOGGLE_FULLSCREEN) so Storyline executes native triggers'
      ],
      storylineTimeline: { storyline: ['Sets HeaderProfile = A/B/C/D at Layout timeline start; listens to HeaderAction changes to fire Lightbox/Exit triggers'], webObject: ['WebObjects/dist/Header1/ (index.html, header1.css, header1.js)'] },
      navigation: 'Header 1 emits OPEN_GUIDELINES → Storyline Lightboxes Slide 7; OPEN_MAP → Storyline Lightboxes Slide 8; EXIT_COURSE → Storyline Exit Course.',
      completionRule: 'Life & Stars are read-only displays derived from CourseProgressData; Storyline remains authoritative.',
      revisitResume: 'Re-reads CourseProgressData on slide load/poll; restores earned star count on revisit & LMS resume.',
      clickByClick: [
        {
          what: 'Insert Header 1 HTML Web Object on Slide Master',
          where: 'View → Slide Master → Layouts A, B, C, D → Insert → Web Object',
          how: 'Browse to WebObjects/dist/Header1/ (containing index.html, header1.css, header1.js). Set Position X=0, Y=0, Width=1920, Height=80. Show in slide.',
          expected: 'Near-black #080A0C bar spans full width at top of slide with crisp SVG icons.',
          test: 'Switch Layout A/B/C/D in ReviewHub isolated preview above, then verify in published Storyline output.',
          mistakes: 'Do NOT combine Header 1 and Header 2 into one Web Object, and do NOT duplicate Storyline buttons on top of Header 1.'
        },
        {
          what: 'Wire HeaderProfile & HeaderAction Triggers on Slide Master',
          where: 'Slide Master → Triggers Panel',
          how: '1) Adjust variable HeaderProfile = "A" (or B/C/D per layout) when timeline starts on this layout. 2) When variable HeaderAction changes: Lightbox Slide 7 if HeaderAction == "OPEN_GUIDELINES"; Show layer CourseMapOverlay if "OPEN_MAP"; Exit course if "EXIT_COURSE"; then reset HeaderAction = "" as the final trigger.',
          expected: 'Storyline executes authoritative navigation/exit when HTML buttons are clicked.',
          test: 'Needs Storyline Verification: Click Guidelines, Map, Mute, Exit, Fullscreen in published Storyline output.',
          mistakes: 'Forgetting to reset HeaderAction = "" after handling prevents clicking the same button twice in a row.'
        }
      ],
      checklistItems: [
        'Insert WebObjects/dist/Header1/ at X=0, Y=0, W=1920, H=80 on Layouts A–D',
        'Set HeaderProfile (A/B/C/D) on each Slide Master layout',
        'Wire Storyline triggers for HeaderAction (OPEN_GUIDELINES, OPEN_MAP, EXIT_COURSE)',
        'Test TOGGLE_MUTE & TOGGLE_FULLSCREEN in published Storyline / Oracle LMS (retain Player fallback until verified)'
      ],
      unverifiedNotes: ['Needs Storyline Verification: Isolated HTML preview uses mock data only. HeaderAction → Storyline triggers (especially TOGGLE_MUTE and TOGGLE_FULLSCREEN) must be tested in published Storyline 360 output.']
    },
    {
      id: 'ui_header2', no: 'UI-02', originalNo: null, displayOrder: 'G2',
      title: 'Header 2 — Native Storyline Module Bar (#004355)',
      sceneId: 'global_ui', sceneName: 'Global UI & Player Controls',
      slideType: 'Contextual Header', originStatus: 'Proposed / To Build', visualBadge: 'Proposed',
      purpose: 'Native Storyline information bar (#004355, 48–52px height at 1920×1080, placed at Y=80 below Header 1). Informational ONLY (ZERO buttons): [4px #FFFF40 Accent] [Module Name] | [Topic Name] | [M1_CompletedCount/6 + 6 Native Segments]. Never use a Web Object for Header 2.',
      whatToBuild: [
        'Native Storyline Rectangle (#004355, X=0, Y=80, W=1920, H=50) on Layout C (Training/Quiz/Explanation ONLY)',
        '4px Daimler Yellow (#FFFF40) vertical left accent bar (X=0, Y=80, W=4, H=50)',
        '3 text/indicator sections: Module Name (white) | Topic Name (soft white) | Progress Counter (%M1_CompletedCount%/6) + 6 Native Segment Shapes (Normal = muted petrol-grey, Completed = #FFFF40)',
        'ZERO interactive buttons, ZERO Web Objects, and NEVER combined with Header 1'
      ],
      storylineTimeline: { storyline: ['Native Storyline shapes/states driven by derived variable M1_CompletedCount (0–6) from CourseProgressData'], webObject: ['None — strictly native Storyline'] },
      navigation: 'Informational only — ZERO navigation buttons inside Header 2.',
      completionRule: 'M1_CompletedCount counts verified completed topics (101, 103, 102, 104, 105, 106), NEVER slide numbers or visits.',
      revisitResume: 'Segments restore automatically from M1_CompletedCount / CourseProgressData on revisit & LMS resume.',
      clickByClick: [
        {
          what: 'Build Native Header 2 Bar on Layout C (Training/Quiz/Explanation)',
          where: 'View → Slide Master → Layout C (Training/Quiz/Explanation)',
          how: 'Draw a native rectangle (#004355) at X=0, Y=80, W=1920, H=50. Add 4px #FFFF40 left accent bar, Module Name + Topic Name text boxes, and 6 small segment rectangles with custom state "Completed" (#FFFF40). Change segment states to Completed when M1_CompletedCount >= 1..6.',
          expected: 'Single-line native automotive dashboard bar with zero buttons and zero Web Object flicker.',
          test: 'Check Slides 10–21: confirm Header 2 is visible on training/quiz/explanation slides and hidden on Slides 1–8, Overviews, Star Earned, and Mission Complete.',
          mistakes: 'Do NOT create a Web Object for Header 2, and do NOT add Previous/Next buttons inside Header 2.'
        }
      ],
      checklistItems: ['Build native #004355 bar (48–52px at Y=80) with 4px #FFFF40 accent', 'Ensure ZERO buttons & ZERO Web Objects in Header 2', 'Drive 6 segments from M1_CompletedCount (verified topics, not slide count)', 'Hide Header 2 on Slides 1–8, Overviews, Stars, Mission Complete']
    },
    {
      id: 'ui_master_layouts', no: 'UI-03', originalNo: null, displayOrder: 'G3',
      title: 'Slide Master Layouts (A, B, C, D) & Visibility Matrix',
      sceneId: 'global_ui', sceneName: 'Global UI & Player Controls',
      slideType: 'Master Layouts', originStatus: 'Baseline', visualBadge: 'Reference',
      purpose: 'Four reusable Slide Master layouts controlling progressive Header 1 Web Object (via HeaderProfile = A/B/C/D) and Native Header 2 visibility: Layout A (Intro 1–7), Layout B (Course Journey Slide 8), Layout C (Module Overview / Training / Quiz / Explanation / Star Earned), Layout D (Mission Complete).',
      whatToBuild: [
        'Layout A — Introduction (Slides 1–7, HeaderProfile="A"): Branding, Mute, Exit, Fullscreen (Header 1 hides Life, Stars, Guidelines, Map; Header 2 hidden)',
        'Layout B — Course Journey (Slide 8, HeaderProfile="B"): Life, Stars, Guidelines, Mute, Exit, Fullscreen (Header 1 hides Map; Header 2 hidden)',
        'Layout C — Module Training & Star Earned (HeaderProfile="C"): Full 7-element Header 1 (+ Native Header 2 on training/quiz/explanation slides only)',
        'Layout D — Mission Complete (HeaderProfile="D"): 6-Star status, Mute, Exit, Fullscreen (Header 1 hides Life, Guidelines, Map; Header 2 hidden)'
      ],
      storylineTimeline: { storyline: ['Master layout inheritance sets HeaderProfile variable and toggles Native Header 2'], webObject: ['WebObjects/dist/Header1/ reads HeaderProfile'] },
      navigation: 'Prevents duplicate slide-level headers across all scenes.',
      completionRule: 'None.',
      revisitResume: 'Inherited per slide.',
      clickByClick: [
        {
          what: 'Create Layouts A, B, C, D in Slide Master',
          where: 'View → Slide Master',
          how: 'Place WebObjects/dist/Header1/ on Layouts A–D and set HeaderProfile = "A", "B", "C", or "D" when timeline starts. Place Native Header 2 ONLY on the Training/Quiz/Explanation sub-layout of Layout C.',
          expected: 'Header 1 adapts progressively via HeaderProfile; Native Header 2 appears only inside module training/quiz/explanation slides.',
          test: 'Step through Slides 1–22 + Star 1 + Mission Complete and verify visibility rules.',
          mistakes: 'Using Layout C with Header 2 on Module Overview or Star Earned slides clutters celebration/overview screens.'
        }
      ],
      checklistItems: ['Create Layouts A, B, C, D in Slide Master', 'Set HeaderProfile = A/B/C/D per layout', 'Verify Slide 8 hides Map button & Header 2 only shows on training/quiz/explanation slides']
    },
    {
      id: 'ui_global_map', no: 'UI-04', originalNo: null, displayOrder: 'G4',
      title: 'Global Map & Guidelines Lightboxes (Slides 7 & 8)',
      sceneId: 'global_ui', sceneName: 'Global UI & Player Controls',
      slideType: 'Global Control', originStatus: 'Baseline', visualBadge: 'Not Verified',
      purpose: 'Configures btn_Global_Guidelines (Lightbox Slide 7) and btn_Global_Map (Lightbox Slide 8 — the ONLY Course Map slide).',
      whatToBuild: ['btn_Global_Guidelines → Lightbox Slide 7', 'OPEN_MAP → Show layer CourseMapOverlay (1800×980 at X=60, Y=50, WebObjects/dist/CourseMap/)'],
      storylineTimeline: { storyline: ['Opens Slide 7 or Slide 8 in Lightbox; closes back to caller'], webObject: ['CourseMap on Slide 8'] },
      navigation: 'Closing lightbox returns to current slide; topic selection jumps when verified.',
      completionRule: 'Preserves NavigationMode, CourseProgressData, RequestedMission.',
      revisitResume: 'Reads live CourseProgressData.',
      clickByClick: [
        { what: 'Wire Guidelines & Map Layer Triggers', where: 'Slide Master → HeaderAction Triggers & CourseMapOverlay Layer', how: 'On HeaderAction == "OPEN_GUIDELINES": Lightbox Slide 7. On HeaderAction == "OPEN_MAP": Show layer CourseMapOverlay (centered 1800×980 at X=60, Y=50, Pause timeline of base layer = ON). Hide CourseMapOverlay when CourseMapCloseRequested changes or RequestedMission jumps.', expected: 'Both open without losing training position.', test: 'Needs Storyline Verification: Test CourseMapOverlay open/close and RequestedMission jump in published output.' }
      ],
      checklistItems: ['Wire btn_Global_Guidelines → Lightbox Slide 7', 'Wire btn_Global_Map → Lightbox Slide 8', 'Verify Lightbox close & topic jump in published output'],
      unverifiedNotes: ['Needs Storyline Verification: Confirm RequestedMission navigation works from inside Slide 8 Lightbox.']
    },
    {
      id: 'ui_player_props', no: 'UI-05', originalNo: null, displayOrder: 'G5',
      title: 'Player Properties (Modern Player — No Prev/Next)',
      sceneId: 'global_ui', sceneName: 'Global UI & Player Controls',
      slideType: 'Player Setup', originStatus: 'Baseline', visualBadge: 'Reference',
      purpose: 'Final Storyline Modern Player strategy: DISABLE built-in Previous, Next, Submit (on HTML quizzes), and Player Menu. RETAIN Play/Pause, Seekbar (conditional), Volume, Captions, Accessibility, and Fullscreen (until custom verified).',
      whatToBuild: [
        'Home → Player → Modern Player',
        'DISABLE: Built-in Previous Slide, Built-in Next Slide, Native Submit (quizzes), Player Menu',
        'RETAIN: Play/Pause, Seekbar, Volume, Captions, Accessibility Controls, Fullscreen (until custom verified)'
      ],
      storylineTimeline: { storyline: ['Playback & accessibility chrome only'], webObject: ['None'] },
      navigation: 'Manual slide navigation uses custom slide buttons, NOT built-in Player Previous/Next.',
      completionRule: 'Player Resume configured for Oracle LMS.',
      revisitResume: 'Always resume / Prompt to resume.',
      clickByClick: [
        { what: 'Disable Native Prev/Next & Configure Playback Features', where: 'Home → Player → Features & Slide Properties', how: 'In Modern Player, enable Play/Pause, Seekbar, Volume, Captions, Accessibility, Fullscreen. Turn OFF Menu and uncheck Previous/Next/Submit on slides so custom slide buttons + auto-advance control navigation.', expected: 'Zero duplicate navigation controls between Player and slides.', test: 'Preview course and confirm no built-in Player Prev/Next buttons appear.' }
      ],
      checklistItems: ['Disable built-in Player Previous & Next', 'Disable Player Menu & Quiz Native Submit', 'Retain Play/Pause, Seekbar, Volume, Captions, Accessibility']
    },
    {
      id: 'ui_nav_buttons', no: 'UI-06', originalNo: null, displayOrder: 'G6',
      title: 'Button State Library & Global Inventory (12 Controls)',
      sceneId: 'global_ui', sceneName: 'Global UI & Player Controls',
      slideType: 'Button Inventory', originStatus: 'Baseline', visualBadge: 'Reference',
      purpose: 'Centralized Button States Library distinguishing Storyline object states (Normal/Hover/Down/Disabled/Focus), Player native controls, and HTML Web Object buttons across all 12 course controls.',
      whatToBuild: ['12 standardized controls with documented states, conditions, duplicate prevention, and revisit behavior'],
      storylineTimeline: { storyline: ['Built-in Storyline states + custom toggle states'], webObject: ['HTML Submit in Q001–Q006_R3'] },
      navigation: 'Custom slide buttons enforce Disabled states until completion.',
      completionRule: 'No decorative-only buttons.',
      revisitResume: 'Completed gates unlock custom Next on revisit.',
      clickByClick: [
        { what: 'Apply Button State Library Across Master & Slides', where: 'Slide Master & Individual Slides', how: 'Use the 12-control inventory in the Center workspace to verify object names, states, triggers, and revisit rules.', expected: 'Consistent industrial button behavior everywhere.', test: 'Audit Disabled, Hover, Down, and Focus states on every slide.' }
      ],
      checklistItems: ['Verify all 12 controls in .story', 'Distinguish Storyline states vs Player controls vs HTML buttons']
    },
    {
      id: 'ui_media_controls', no: 'UI-07', originalNo: null, displayOrder: 'G7',
      title: 'Audio, Video & Mute/Unmute Controls',
      sceneId: 'global_ui', sceneName: 'Global UI & Player Controls',
      slideType: 'Media Controls', originStatus: 'Baseline', visualBadge: 'Not Verified',
      purpose: 'Documents Mute/Unmute in Header 1 (Audio On / Audio Muted states) vs built-in Storyline Player Volume, and prevents duplicate audio controls.',
      whatToBuild: ['Single audio control (verify custom Mute vs Player Volume)', 'Audio On / Audio Muted custom states if custom button used'],
      storylineTimeline: { storyline: ['Narration & video playback'], webObject: ['Silent interactive UI'] },
      navigation: 'Mandatory media completion gates Next/auto-advance.',
      completionRule: 'Do not invent undocumented Storyline JS mute functions.',
      revisitResume: 'Verify audio state after revisits and lightboxes.',
      clickByClick: [
        { what: 'Verify Audio & Mute Behavior', where: 'Home → Player & Slide Master', how: 'If a reliable custom global mute mechanism is unavailable in Storyline, retain the built-in Player Volume control and avoid duplicate Mute buttons.', expected: 'Single reliable audio control across narration, video, and lightboxes.', test: 'Needs Storyline Verification: Test audio after Mute, revisit, and Slide 7/8 lightbox close.' }
      ],
      checklistItems: ['Avoid duplicate Mute/Volume controls', 'Verify narration & video after lightbox close'],
      unverifiedNotes: ['Needs Storyline Verification: Confirm whether custom Header 1 Mute can control all slide audio/video or if native Player Volume should be retained.']
    },
    {
      id: 'ui_seekbar', no: 'UI-08', originalNo: null, displayOrder: 'G8',
      title: 'Seekbar & Timeline Controls',
      sceneId: 'global_ui', sceneName: 'Global UI & Player Controls',
      slideType: 'Player Control', originStatus: 'Baseline', visualBadge: 'Reference',
      purpose: 'Retains Storyline Seekbar on narrative/explanation slides (conditional) while hiding it on Cover, Slide 8 Course Map, Quiz Web Objects, Star Earned, and Mission Complete.',
      whatToBuild: ['Conditional Seekbar on narrative slides; hidden on interactive Web Object & reward slides'],
      storylineTimeline: { storyline: ['Controls native slide timeline only'], webObject: ['Independent of Storyline seekbar'] },
      navigation: 'Seekbar cannot bypass mandatory quizzes.',
      completionRule: 'Completed slides allow free scrubbing.',
      revisitResume: 'Restores completed scrub state.',
      clickByClick: [
        { what: 'Set Per-Slide Seekbar Rules', where: 'Slide Properties (Gear icon)', how: 'Hide Seekbar on Slide 1, Slide 8, all 8 Quiz slides, Star Earned slides, and Mission Complete. Enable conditional Seekbar on narrative/explanation slides.', expected: 'Learners cannot scrub past quizzes.', test: 'Verify Seekbar is hidden on Slide 14 and present on Slide 15.' }
      ],
      checklistItems: ['Hide Seekbar on Cover, Slide 8, Quizzes, Stars, Mission Complete']
    },
    {
      id: 'ui_captions', no: 'UI-09', originalNo: null, displayOrder: 'G9',
      title: 'Closed Captions Controls',
      sceneId: 'global_ui', sceneName: 'Global UI & Player Controls',
      slideType: 'Accessibility', originStatus: 'Baseline', visualBadge: 'Reference',
      purpose: 'Enables Modern Player Closed Captions for all narrated Storyline slides and videos.',
      whatToBuild: ['Modern Player Captions ON', 'Synced .vtt/.srt tracks on narrated slides'],
      storylineTimeline: { storyline: ['Synced caption display'], webObject: ['None'] },
      navigation: 'Persistent CC toggle.',
      completionRule: 'None.',
      revisitResume: 'Remembers CC preference.',
      clickByClick: [
        { what: 'Enable Closed Captions', where: 'Home → Player → Features → Captions', how: 'Enable Captions in Modern Player and attach caption files to slide audio/video.', expected: 'CC toggles cleanly.', test: 'Toggle CC on narrated slides.' }
      ],
      checklistItems: ['Enable Captions in Modern Player', 'Verify CC on narrated slides']
    },
    {
      id: 'ui_fullscreen', no: 'UI-10', originalNo: null, displayOrder: 'G10',
      title: 'Fullscreen Control',
      sceneId: 'global_ui', sceneName: 'Global UI & Player Controls',
      slideType: 'Player Control', originStatus: 'Baseline', visualBadge: 'Not Verified',
      purpose: 'Documents Header 1 Fullscreen button (Windowed / Fullscreen states) vs Modern Player Fullscreen. Retain Player Fullscreen until custom Header 1 trigger is verified.',
      whatToBuild: ['Supported Fullscreen toggle (verify custom vs Modern Player Fullscreen)'],
      storylineTimeline: { storyline: ['Viewport scaling'], webObject: ['Scales inside container'] },
      navigation: 'Esc exits fullscreen.',
      completionRule: 'None.',
      revisitResume: 'None.',
      clickByClick: [
        { what: 'Configure & Test Fullscreen', where: 'Home → Player (or Header 1)', how: 'Do not invent unsupported fullscreen JS. Use Modern Player Fullscreen until a supported custom Header 1 fullscreen trigger is verified in published output.', expected: 'Clean fullscreen entry/exit with proper Web Object scaling.', test: 'Needs Storyline Verification: Test in Chrome and Oracle LMS iframe.' }
      ],
      checklistItems: ['Verify single Fullscreen button', 'Test Web Object scaling in Oracle LMS iframe'],
      unverifiedNotes: ['Needs Storyline Verification: Verify supported fullscreen trigger & LMS iframe allow="fullscreen".']
    },
    {
      id: 'ui_keyboard', no: 'UI-11', originalNo: null, displayOrder: 'G11',
      title: 'Keyboard Shortcuts & L-Key Protection',
      sceneId: 'global_ui', sceneName: 'Global UI & Player Controls',
      slideType: 'Keyboard & Security', originStatus: 'Baseline', visualBadge: 'Not Verified',
      purpose: 'Audits Tab/Shift+Tab, Enter/Space, Esc, and restricts the "L" Free-navigation shortcut to Development/Testing only.',
      whatToBuild: ['Logical Focus Order on every slide', 'Disable/gate L-key shortcut before production LMS publish'],
      storylineTimeline: { storyline: ['Tab order & Esc on Lightbox'], webObject: ['Keyboard accessible quiz cards'] },
      navigation: 'Learners must NOT bypass mandatory modules.',
      completionRule: 'Production publish keeps NavigationMode = False.',
      revisitResume: 'None.',
      clickByClick: [
        { what: 'Gate L-Key Shortcut for Dev Only', where: 'Slide Master Triggers', how: 'Disable or gate the L-key NavigationMode toggle before publishing production SCORM.', expected: 'Pressing L in production does not unlock locked topics.', test: 'Press L in published production SCORM.' }
      ],
      checklistItems: ['Verify Tab order on Header 1 & custom buttons', 'Disable L-key shortcut for production publish'],
      unverifiedNotes: ['CRITICAL: L-key Free mode is dev-only and must be disabled in production.']
    },
    {
      id: 'ui_slide_props', no: 'UI-12', originalNo: null, displayOrder: 'G12',
      title: 'Slide Properties & Automatic Advancement Matrix',
      sceneId: 'global_ui', sceneName: 'Global UI & Player Controls',
      slideType: 'Slide Properties', originStatus: 'Baseline', visualBadge: 'Reference',
      purpose: 'Exact per-slide rules for Slide Properties (Prev/Next/Submit OFF, Resume saved state vs Automatically decide) and Conditional Automatic Advancement (narration/explanation) vs Custom Button Navigation (Cover, Quiz, Overview, Star Earned, Mission Complete).',
      whatToBuild: ['Native Prev/Next/Submit UNCHECKED on all slides', 'Quiz slides: Resume saved state', 'Conditional auto-advance on approved narration/explanation only (never bypass quizzes)'],
      storylineTimeline: { storyline: ['One authoritative navigation decision per slide'], webObject: ['Bridge restore on Resume saved state'] },
      navigation: 'Never let an unconditional timeline-end jump compete with a disabled custom Next button.',
      completionRule: 'Quiz slides advance only after Submit + Feedback + Qxxx_Done == True.',
      revisitResume: 'Slide 8 never resets CourseProgressData.',
      clickByClick: [
        { what: 'Uncheck Native Prev/Next/Submit & Set Revisit Rules', where: 'Each Slide → Gear Icon (Slide Properties)', how: 'Uncheck Previous, Next, and Submit on every slide. Set Quiz slides & Star Earned slides to Revisiting: Resume saved state. Set Slide 8 to Automatically decide.', expected: 'Custom buttons and approved auto-advance control flow cleanly without native button conflicts.', test: 'Test revisit on Slide 14 (Q004) and Slide 8.' }
      ],
      checklistItems: ['Uncheck native Prev/Next/Submit on all slides', 'Set all 8 Quiz slides to Resume saved state', 'Verify no unconditional auto-advance bypasses quizzes']
    },
    {
      id: 'ui_trigger_order', no: 'UI-13', originalNo: null, displayOrder: 'G13',
      title: 'Navigation & Trigger Execution Order',
      sceneId: 'global_ui', sceneName: 'Global UI & Player Controls',
      slideType: 'Architecture', originStatus: 'Baseline', visualBadge: 'Not Verified',
      purpose: 'Mandatory top-to-bottom trigger order: save/confirm completion BEFORE Jump to slide, never clear RequestedMission before consumption, and avoid duplicate jumps.',
      whatToBuild: ['Completion/SetVar -> Update CourseProgressData -> Hide Lightbox/Layer -> Jump to slide'],
      storylineTimeline: { storyline: ['Top-to-bottom trigger evaluation'], webObject: ['Bridge SetVar before completion check'] },
      navigation: 'No triggers after Jump to slide.',
      completionRule: 'No arbitrary fixed delays (700ms) replacing authoritative signals.',
      revisitResume: 'Idempotent completion updates.',
      clickByClick: [
        { what: 'Order Triggers Top-to-Bottom', where: 'Triggers Panel', how: 'Place SetVar, markTopicStatus, and Hide triggers ABOVE Jump to slide.', expected: 'State always saves before leaving the slide.', test: 'Verify Topic 101–106 completion updates before Slide jumps.' }
      ],
      checklistItems: ['Place all state triggers ABOVE Jump to slide']
    },
    {
      id: 'ui_exit_resume', no: 'UI-14', originalNo: null, displayOrder: 'G14',
      title: 'SCORM Exit & Oracle LMS Resume Behavior',
      sceneId: 'global_ui', sceneName: 'Global UI & Player Controls',
      slideType: 'LMS & SCORM', originStatus: 'QA Checklist', visualBadge: 'Not Verified',
      purpose: 'Configures Exit button, Player Resume, suspend_data persistence for CourseProgressData + Life + 6 Stars, and Complete course trigger on Mission Complete.',
      whatToBuild: ['SCORM 1.2 / 2004 Reporting', 'Exit course trigger (never marks complete on Exit)', 'Always resume / Prompt to resume'],
      storylineTimeline: { storyline: ['LMSCommit / Exit'], webObject: ['Reads restored Storyline variables on load'] },
      navigation: 'Exit closes SCO cleanly.',
      completionRule: 'Complete course fires ONLY on Mission Complete after all 6 modules are verified.',
      revisitResume: 'Restores CourseProgressData, Life, 6 Stars, and Q001–Q006_R3 states.',
      clickByClick: [
        { what: 'Configure SCORM Reporting & Resume', where: 'Publish → LMS → Reporting and Tracking', how: 'Track via Complete course trigger on Mission Complete. Set Player Resume to Always resume.', expected: 'Oracle LMS restores progress & 6-star state on relaunch.', test: 'Test exit and relaunch in Oracle LMS.' }
      ],
      checklistItems: ['Fire Complete course on Mission Complete only', 'Test Oracle LMS exit & suspend_data resume']
    },
    {
      id: 'ui_accessibility', no: 'UI-15', originalNo: null, displayOrder: 'G15',
      title: 'Accessibility Controls & Focus Management',
      sceneId: 'global_ui', sceneName: 'Global UI & Player Controls',
      slideType: 'Accessibility', originStatus: 'Baseline', visualBadge: 'Reference',
      purpose: 'Ensures WCAG keyboard focus (#FFFF40 outline on #080A0C), logical Focus Order, meaningful Disabled states, Captions, and Reduced Motion.',
      whatToBuild: ['2px #FFFF40 focus outline on #080A0C header buttons', 'Logical Focus Order per slide', 'Descriptive Alt Text'],
      storylineTimeline: { storyline: ['Focus return after Lightbox close'], webObject: ['ARIA labels & reduced-motion CSS'] },
      navigation: 'Full keyboard operability.',
      completionRule: 'None.',
      revisitResume: 'None.',
      clickByClick: [
        { what: 'Set Focus Order & Alt Text', where: 'Home → Focus Order', how: 'Order Header 1, Header 2 context, slide content, and custom Prev/Next logically.', expected: 'Keyboard-only navigation works smoothly.', test: 'Tab through Slide 14 and Slide 7/8 lightboxes.' }
      ],
      checklistItems: ['Set Focus Order on Slide Master & slides', 'Verify #FFFF40 focus outline on #080A0C']
    },
    {
      id: 'ui_life_meter', no: 'UI-16', originalNo: null, displayOrder: 'G16',
      title: 'Module-Wise Life Meter & Bonus Safety Question',
      sceneId: 'global_ui', sceneName: 'Global UI & Player Controls',
      slideType: 'Life Meter & Refill', originStatus: 'Approved Spec / Pilot Pending', visualBadge: 'Proposed',
      purpose: 'Storyline-authoritative module-wise 3-heart Life Meter (Header 1 displays LivesRemaining 0–3 read-only). Each of the 6 modules has independent hearts (M1_Lives..M6_Lives, default 3), 1-heart deduction per first incorrect eligible quiz (Q001 excluded), zero-heart continuation without Game Over/lockout, and 1 optional Bonus Safety Question refill per module (M1_BonusRefillUsed..M6_BonusRefillUsed).',
      whatToBuild: [
        'Display variable: LivesRemaining (Number, 3) read by WebObjects/dist/Header1/ (3 red/grey hearts, clamped 0–3, "--" if unavailable)',
        'Persistent module lives: M1_Lives..M6_Lives (Number, 3) + M1_BonusRefillUsed..M6_BonusRefillUsed (True/False, False)',
        'Per-question deduction guards: Q002_LifeDeducted, Q003_LifeDeducted, Q004_LifeDeducted, Q005_LifeDeducted, Q006_R1_LifeDeducted, Q006_R2_LifeDeducted, Q006_R3_LifeDeducted (True/False, False; NO guard for Q001)',
        'Module entry sync: LivesRemaining = Mx_Lives + HEADER1_SYNC (never reset Mx_Lives to 3 on revisit)',
        'Bonus Safety Question template: visible when LivesRemaining < 3 AND Mx_BonusRefillUsed == False; placeholder until approved Bonus Safety Question content is supplied'
      ],
      storylineTimeline: { storyline: ['Storyline deducts Mx_Lives, sets Qxxx_LifeDeducted = True, updates LivesRemaining, sends HEADER1_SYNC'], webObject: ['Header1 displays LivesRemaining (0–3) read-only'] },
      navigation: 'At 0 hearts: NO Game Over, NO mandatory Review & Restore, NO navigation or completion restriction.',
      completionRule: 'Bonus refill restores Mx_Lives = 3 & LivesRemaining = 3 and sets Mx_BonusRefillUsed = True (max 1 refill per module; wrong bonus answer retries without penalty).',
      revisitResume: 'Mx_Lives, Mx_BonusRefillUsed, and Qxxx_LifeDeducted persist across slide revisits and Oracle LMS suspend/resume.',
      clickByClick: [
        {
          what: 'Step 1: Sync Active Module Lives on Module Entry',
          where: 'Each Module Slide (or Module Scene Master / Slide Timeline Start)',
          how: 'When timeline starts in Module 1: Adjust variable LivesRemaining = M1_Lives (use M2_Lives..M6_Lives for Modules 2–6), then Execute JS HEADER1_SYNC. NEVER reset M1_Lives = 3 on revisit or Overview entry.',
          expected: 'Header 1 displays the current module’s preserved heart count (0–3).',
          test: 'TC-LIFE-06 & TC-LIFE-10: Verify Module 1 heart changes do not alter Module 2 hearts, and revisiting preserves M1_Lives.',
          mistakes: 'Resetting M1_Lives = 3 on Slide 9 (Module 1 Overview) wipes out deductions when the learner revisits.'
        },
        {
          what: 'Step 2: Deduct 1 Heart on First Incorrect Eligible Quiz (Exclude Q001)',
          where: 'Eligible Quiz Slides (Q002–Q006_R3) → Triggers Panel',
          how: 'When Qxxx_Done changes (If Qxxx_Done == True AND Qxxx_Correct == False AND Qxxx_LifeDeducted == False AND M1_Lives > 0): 1) Subtract 1 from M1_Lives, 2) Adjust Qxxx_LifeDeducted = True, 3) Adjust LivesRemaining = M1_Lives, 4) Execute JS HEADER1_SYNC.',
          expected: 'First wrong answer deducts 1 heart; retrying or revisiting never deducts again. At 0 hearts, learner continues normally.',
          test: 'TC-LIFE-02, TC-LIFE-03, TC-LIFE-04, TC-LIFE-05: Test wrong, retry, correct, and 0-heart continuation on Q004.',
          mistakes: 'Relying on Qxxx_Revealed alone or adding deduction triggers to Q001.'
        },
        {
          what: 'Step 3: Configure Optional Bonus Safety Question Template',
          where: 'Module Bonus Safety Question Layer / Lightbox Slide (Placeholder Content)',
          how: 'Show Bonus Refill button ONLY when LivesRemaining < 3 AND Mx_BonusRefillUsed == False. On Correct bonus answer: 1) Set Mx_Lives = 3, 2) Set Mx_BonusRefillUsed = True, 3) Set LivesRemaining = 3, 4) Execute JS HEADER1_SYNC, 5) Show positive feedback & return. On Incorrect bonus answer: show explanatory feedback and allow retry with zero deduction.',
          expected: 'Restores 3 hearts once per module; button stays disabled/hidden after Mx_BonusRefillUsed == True.',
          test: 'TC-LIFE-07, TC-LIFE-08, TC-LIFE-09: Verify correct refill, wrong retry, and single-use guard.',
          mistakes: 'Inventing unapproved curriculum questions or allowing multiple refills in the same module.'
        }
      ],
      checklistItems: [
        'Create LivesRemaining, M1_Lives..M6_Lives, M1_BonusRefillUsed..M6_BonusRefillUsed, and Q002..Q006_R3_LifeDeducted (exclude Q001)',
        'Sync LivesRemaining = Mx_Lives + HEADER1_SYNC on module entry (never reset on revisit)',
        'Guard quiz deductions with Qxxx_LifeDeducted == False AND Mx_Lives > 0',
        'Keep 0-heart navigation unrestricted & Bonus Refill limited to 1 successful refill per module'
      ],
      unverifiedNotes: [
        'NOT TESTED in Storyline 360 or Oracle LMS: Module entry sync, quiz deduction trigger order, bonus refill persistence, and SCORM suspend/resume.',
        'Placeholder Only: Bonus Safety Question requires approved safety curriculum content before production.'
      ]
    }
  ];

  var FINAL_20_TESTS = [
    '1. Cover → Introduction (Start Course)',
    '2. Introduction → Course Journey (Slide 8)',
    '3. Header 1 Guidelines opens Slide 7 lightbox (hidden on Slides 1–7)',
    '4. Header 1 Map opens Slide 8 lightbox (hidden on Slide 8)',
    '5. Lightboxes close and return to current slide',
    '6. Map selection navigates to approved unlocked module',
    '7. Map does not bypass mandatory topics',
    '8. Header 1 progressive visibility matches Layouts A, B, C, D',
    '9. Header 2 (#004355) shows 1-line Module | Topic | Segments with ZERO buttons',
    '10. Native Player Previous/Next are DISABLED across course',
    '11. Custom Next is Disabled when required quiz completion is missing',
    '12. HTML Submit and Storyline feedback work together (Native Submit OFF)',
    '13. Mute/Volume & Captions work without duplicate controls',
    '14. Seekbar follows per-slide restrictions',
    '15. Automatic advancement waits for approved completion (no bypass)',
    '16. Module Star Earned slide does not award duplicates',
    '17. Star Continue opens the correct next module',
    '18. Six modules lead to Mission Complete (Layout D)',
    '19. Keyboard navigation & #FFFF40 focus remain accessible',
    '20. Oracle LMS resume & exit report accurate status'
  ];

  function getSlideControlProfile(slide) {
    if (!slide) return null;
    var t = slide.slideType || '';
    var isCover = slide.id === 's1';
    var isIntro = slide.no >= 1 && slide.no <= 7;
    var isMap = !!slide.isCourseMap;
    var isQuiz = !!slide.quizId;
    var isOverview = t === 'Module Overview';
    var isStar = t === 'Star Earned';
    var isFinal = slide.id === 'mission_complete';

    var masterLayout = 'Layout C — Module Training / Overview / Star';
    var header1 = 'Full 7 Elements: Life | Stars | Guidelines | Map | Mute | Exit | Fullscreen';
    if (isIntro) {
      masterLayout = 'Layout A — Introduction (Slides 1–7)';
      header1 = 'Minimal (#080A0C): Identity | Mute* | Exit | Fullscreen (Hide Life, Stars, Guidelines, Map)';
    } else if (isMap) {
      masterLayout = 'Layout B — Course Journey (Slide 8)';
      header1 = 'Journey (#080A0C): Life | Stars | Guidelines | Mute | Exit | Fullscreen (Hide Map)';
    } else if (isFinal) {
      masterLayout = 'Layout D — Mission Complete';
      header1 = 'Reduced (#080A0C): 6-Star Status | Mute* | Exit | Fullscreen (Hide Life, Guidelines, Map)';
    }

    var showHeader2 = !isIntro && !isMap && !isOverview && !isStar && !isFinal;
    var header2 = showHeader2
      ? ('Visible (#004355, 1-line, NO buttons): ' + (slide.moduleId ? 'Module ' + slide.moduleId : 'Module') + ' | ' + slide.title + ' | Progress Segments')
      : 'Hidden (per visibility matrix)';

    var advancement = 'Custom Storyline Buttons (Native Player Prev/Next DISABLED)';
    if (isCover) advancement = 'Custom Start Course button → Slide 2';
    else if (isOverview) advancement = 'Custom Start Module button';
    else if (isQuiz) advancement = 'HTML Submit → Feedback → Custom Next gated on ' + slide.quizId + '_Done == True';
    else if (t === 'Answer Explanation' || t === 'Topic Completion') advancement = 'Conditional auto-advance after narration/explanation OR Custom Next (one authoritative decision)';
    else if (isStar) advancement = 'Custom Continue button after Star celebration';
    else if (isFinal) advancement = 'Custom Finish / Exit button';

    return {
      masterLayout: masterLayout,
      header1: header1,
      header2: header2,
      nativePlayer: 'Prev: OFF | Next: OFF | Submit: OFF | Play/Pause, Volume, Captions, Accessibility: ON',
      advancement: advancement,
      seekbar: (isCover || isMap || isQuiz || isStar || isFinal) ? 'Hidden' : 'Conditional / Read-only',
      revisit: isQuiz ? 'Resume saved state (required for bridge restore)' : (isMap ? 'Automatically decide (never reset CourseProgressData)' : (isStar || isFinal ? 'Resume saved state (no duplicate award)' : 'Automatically decide'))
    };
  }

  root.DICV_GLOBAL_CONTROLS = {
    headerStyling: HEADER_STYLING,
    buttonInventory: BUTTON_INVENTORY,
    uiNodes: GLOBAL_UI_NODES,
    final20Tests: FINAL_20_TESTS,
    getSlideControlProfile: getSlideControlProfile
  };
})(typeof window !== 'undefined' ? window : globalThis);
