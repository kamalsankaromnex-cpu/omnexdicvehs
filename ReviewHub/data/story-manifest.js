/**
 * story-manifest.js — Final Master Storyline 360 Course Builder & Six-Star Mission Manifest
 *
 * Reconciles all architecture decisions:
 *  - Decision 1: ONE Course Map slide (Slide 8 — EHS Training Journey -> WebObjects/dist/CourseMap/)
 *  - Decision 2: ONE shared Slide Master Header Map button -> Lightbox Slide 8 (NO full CourseMap in Slide Master)
 *  - Decision 3: SIX separate Module Overview slides
 *  - Decision 4: SIX separate Star Earned slides (not layers)
 *  - Decision 5: ONE dedicated final Mission Complete slide (Six Stars Collected)
 *  - Decision 6: Original 22 slides preserve stable IDs (s1-s22) and originalNo (1-22)
 *  - Authoring checklist state is a local development aid only — never LMS learner progress.
 */
(function (root) {
  'use strict';

  var PROJECT_SETUP_NODES = [
    {
      id: 'project_setup',
      no: 'Setup',
      originalNo: null,
      displayOrder: '0A',
      title: 'Project, Theme & Shared Variables Setup',
      sceneId: 'setup',
      sceneName: 'Project Setup (Foundation)',
      slideType: 'Project Setup',
      originStatus: 'Baseline',
      visualBadge: 'Reference',
      purpose: 'Configure the single continuous Storyline 360 project (1920 × 1080 or approved baseline), Daimler palette, and the 3 shared Course Map variables.',
      whatToBuild: [
        'One continuous Storyline 360 (.story) project for all 6 modules',
        'Shared variable: NavigationMode (True/False, default False)',
        'Shared variable: CourseProgressData (Text, default "")',
        'Shared variable: RequestedMission (Number, default 0)'
      ],
      storylineTimeline: {
        storyline: ['Project player & Slide Master theme', 'Shared variable initialization'],
        webObject: ['None (project-level setup)']
      },
      navigation: 'Sets up global variables used by Slide 8 Course Map and all 6 modules.',
      completionRule: 'CourseProgressData holds authoritative JSON state for Topics 101–106 (and future Modules 2–6).',
      revisitResume: 'Set Player Resume behavior to Prompt to resume or Always resume for SCORM / Oracle LMS.',
      clickByClick: [
        {
          what: 'Create NavigationMode variable',
          where: 'Home / Triggers panel → Manage Project Variables (X) → Create a new variable (+)',
          how: 'Name: NavigationMode | Type: True/False | Default value: False.',
          expected: 'False = Restricted sequential mode; True = Free mode (L-key toggle).',
          test: 'Verify NavigationMode appears in Project Variables list with default False.'
        },
        {
          what: 'Create CourseProgressData variable',
          where: 'Manage Project Variables (X) → Create a new variable (+)',
          how: 'Name: CourseProgressData | Type: Text | Default value: (leave blank).',
          expected: 'Stores serialized JSON topic completion states (0=Not Started, 1=In Progress, 2=Completed).',
          test: 'Confirm CourseProgressData is Text and blank by default.'
        },
        {
          what: 'Create RequestedMission variable',
          where: 'Manage Project Variables (X) → Create a new variable (+)',
          how: 'Name: RequestedMission | Type: Number | Default value: 0.',
          expected: 'Receives mission ID (101, 103, 102, 104, 105, 106) when learner clicks a topic in Slide 8.',
          test: 'Confirm RequestedMission is Number with default 0.'
        }
      ],
      checklistItems: [
        'Confirm single continuous .story project for Modules 1–6',
        'Create NavigationMode (True/False = False)',
        'Create CourseProgressData (Text = blank)',
        'Create RequestedMission (Number = 0)'
      ],
      unverifiedNotes: [
        'Needs Storyline Verification: Confirm Player Resume setting matches Oracle LMS SCORM 1.2/2004 suspend_data.'
      ]
    },
    {
      id: 'master',
      no: 'Master',
      originalNo: null,
      displayOrder: '0B',
      title: 'Slide Master, Hybrid Headers & CourseMapOverlay Layer',
      sceneId: 'setup',
      sceneName: 'Project Setup (Foundation)',
      slideType: 'Slide Master',
      originStatus: 'Baseline',
      visualBadge: 'Not Verified',
      purpose: 'Hosts Header 1 HTML Web Object (WebObjects/dist/Header1/, 1920×80 at X=0, Y=0) across Layouts A–D, Native Header 2 (#004355, 1920×50 at X=0, Y=80) on Layout C-Content ONLY, the centered CourseMapOverlay Master Layer (1800×980 at X=60, Y=50), and startup CourseMapHost + HEADER1_READY JS.',
      whatToBuild: [
        'Header 1 Web Object on Layouts A–D (WebObjects/dist/Header1/, X=0, Y=0, W=1920, H=80) + HeaderProfile trigger',
        'Native Header 2 (#004355, X=0, Y=80, W=1920, H=50, 0 buttons) on Layout C-Content ONLY',
        'CourseMapOverlay Slide Master Layer (X=60, Y=50, W=1800, H=980 over 60% dark backdrop; Pause timeline of base layer = ON)',
        'Top Master startup JS (DICV_CourseMapHost + HEADER1_READY), HeaderAction triggers, and RequestedMission jump triggers'
      ],
      storylineTimeline: {
        storyline: ['HeaderProfile A/B/C/D', 'HeaderAction OPEN_MAP → Show layer CourseMapOverlay', 'CourseMapCloseRequested → Hide layer CourseMapOverlay'],
        webObject: ['Header1 on Layouts A–D (0,0, 1920×80)', 'CourseMap on CourseMapOverlay layer (60,50, 1800×980)']
      },
      navigation: 'OPEN_MAP shows CourseMapOverlay (pauses base slide timeline). Close Map × toggles CourseMapCloseRequested to hide the layer; clicking a topic hides the layer and jumps via RequestedMission.',
      completionRule: 'Master Slide does not award completion or stars.',
      revisitResume: 'Needs Storyline Verification: Confirm Header1 iframe lifecycle, HeaderAction single-owner reset, and RequestedMission jump from CourseMapOverlay in published HTML5.',
      clickByClick: [
        {
          what: 'Insert Header 1 & Native Header 2 on Slide Master Layouts',
          where: 'View → Slide Master → Layouts A, B, C-Minimal, C-Content, D',
          how: 'Insert WebObjects/dist/Header1/ at X=0, Y=0, W=1920, H=80 on Layouts A–D. Set HeaderProfile = A/B/C/D when timeline starts. Add Native Header 2 (#004355, X=0, Y=80, W=1920, H=50) ONLY on Layout C-Content.',
          expected: 'Header 1 adapts progressively per layout; Header 2 appears only on Training/Quiz/Explanation slides.',
          test: 'Preview Pilot slides 1.1, 1.2, 1.3 and confirm Header 1 switches A → C → B cleanly.'
        },
        {
          what: 'Create CourseMapOverlay Slide Master Layer',
          where: 'View → Slide Master → Top Master → New Layer (CourseMapOverlay)',
          how: 'In Layer Properties (Cog): check Pause timeline of base layer & Prevent clicking base layer. Add 1920×1080 60% dark #080A0C backdrop, then Insert Web Object → WebObjects/dist/CourseMap/ at X=60, Y=50, W=1800, H=980.',
          expected: 'Clicking Map pauses base audio/video and opens the centered 1800×980 Course Map cleanly.',
          test: 'Needs Storyline Verification: Open CourseMapOverlay during Slide 1.2, click Close Map ×, and test RequestedMission jump.'
        },
        {
          what: 'Initialize DICV_CourseMapHost & Wire HeaderAction',
          where: 'Top Master Triggers → When timeline starts & When HeaderAction changes',
          how: 'Add guarded IIFE JS on Top Master to attach DICV_CourseMapHost & HEADER1_READY handshake. On HeaderAction changes: Lightbox Slide 7 (OPEN_GUIDELINES), Show layer CourseMapOverlay (OPEN_MAP), Exit (EXIT_COURSE), then reset HeaderAction = "" as final trigger.',
          expected: 'Repeat clicks and Course Map gating work reliably.',
          test: 'Needs Storyline Verification: Open DevTools console in published output and verify DICV_CourseMapHost & HeaderAction = "" reset.'
        }
      ],
      checklistItems: [
        'Insert Header 1 (WebObjects/dist/Header1/, 1920×80) on Layouts A–D',
        'Build Native Header 2 (1920×50) on Layout C-Content ONLY',
        'Create CourseMapOverlay Master Layer (1800×980 at X=60, Y=50, Pause timeline = ON)',
        'Wire Top Master DICV_CourseMapHost JS, HeaderAction, and CourseMapCloseRequested triggers'
      ],
      unverifiedNotes: [
        'Needs Storyline Verification: Confirm CourseMapOverlay pauses base timeline, closes on CourseMapCloseRequested, and jumps cleanly on RequestedMission.',
        'Needs Storyline Verification: Confirm HeaderAction single-owner reset works on consecutive clicks.'
      ]
    }
  ];

  var SOURCE_AND_PLANNED_NODES = [
    // SCENE 1 — INTRODUCTION & COURSE JOURNEY (Original Slides 1–8)
    {
      no: 1, originalNo: 1, displayOrder: 1, id: 's1',
      title: 'Cover Slide',
      sceneId: 'scene1', sceneName: 'Scene 1 — Introduction & Course Journey',
      slideType: 'Cover Slide', originStatus: 'Baseline', visualBadge: 'Reference',
      purpose: 'Opening title screen introducing DICV Interactive Safety eLearning.',
      whatToBuild: ['Course title artwork & Daimler branding', 'Start Course button'],
      storylineTimeline: { storyline: ['Title entrance, Start button hover/click, voiceover/BGM if used (Needs Storyline Verification)'], webObject: ['None (native Storyline slide)'] },
      navigation: 'User clicks Start → Jump to Slide 2 (Why Safety Matters — Introduction).',
      completionRule: 'No Course Map completion trigger on Cover Slide.',
      revisitResume: 'Standard Storyline revisit.',
      clickByClick: [
        { what: 'Verify Start button trigger', where: 'Slide 1 Triggers panel', how: 'Ensure Start button has Jump to slide → Slide 2 When user clicks.', expected: 'Clicking Start opens Slide 2.', test: 'Preview Scene 1 and click Start.' }
      ],
      checklistItems: ['Verify Cover Slide artwork & title text', 'Confirm Start button jumps to Slide 2']
    },
    {
      no: 2, originalNo: 2, displayOrder: 2, id: 's2',
      title: 'Why Safety Matters — Introduction',
      sceneId: 'scene1', sceneName: 'Scene 1 — Introduction & Course Journey',
      slideType: 'Introduction Slide', moduleId: 1, topicId: '101', missionId: 101,
      originStatus: 'Baseline', visualBadge: 'Reference',
      purpose: 'Opening slide for Topic 101 (Why Safety Matters), which contributes to Module 1 progress.',
      whatToBuild: ['Topic intro visuals & narration', 'Next button'],
      storylineTimeline: { storyline: ['Slide intro animation, companion dialogue if present (Needs Storyline Verification)'], webObject: ['None (native Storyline slide)'] },
      navigation: 'RequestedMission == 101 jumps here. Next → Slide 3.',
      completionRule: 'Opening Slide 2 sets Topic 101 = 1 (In Progress) when launched from Course Map; Topic 101 completes (2) on Slide 4.',
      revisitResume: 'Resume saved state. Never downgrades Topic 101 if already Completed (2).',
      clickByClick: [
        { what: 'Verify Topic 101 destination', where: 'Course Map navigation triggers', how: 'Confirm RequestedMission == 101 jumps to Slide 2.', expected: 'Selecting Why Safety Matters in Course Map lands on Slide 2.', test: 'Select Topic 101 from Slide 8 Course Map.' }
      ],
      checklistItems: ['Verify Slide 2 content & Next trigger to Slide 3', 'Confirm RequestedMission == 101 lands on Slide 2']
    },
    {
      no: 3, originalNo: 3, displayOrder: 3, id: 's3',
      title: 'Why Safety Matters — Interactive Question (Q001)',
      sceneId: 'scene1', sceneName: 'Scene 1 — Introduction & Course Journey',
      slideType: 'Quiz Question', moduleId: 1, topicId: '101', missionId: 101, quizId: 'Q001',
      originStatus: 'Baseline', visualBadge: 'Actual',
      purpose: 'Interactive photo multiple-selection activity (Q001_AccidentPrediction).',
      whatToBuild: ['Embedded Q001 HTML Web Object (806 × 962 px)', 'Correct & Incorrect Feedback Layers', 'Next button gated on Q001_Done == True'],
      storylineTimeline: { storyline: ['Feedback layers, Life Meter / Reward Stars, Next button gating'], webObject: ['Photo card entrance, selection border, Submit lock, authorized green/red review'] },
      navigation: 'Next → Slide 4 (Why Safety Matters — Answer Reveal) only after Q001_Done == True.',
      completionRule: 'Q001_Done toggles True on Submit; Topic 101 marks Completed (2) only on Slide 4 after completion criteria pass.',
      revisitResume: 'Set Revisiting to Resume saved state so Q001_Answers restores selected cards.',
      clickByClick: [
        { what: 'Insert Q001 Web Object', where: 'Slide 3 → Insert → Web Object', how: 'Browse to WebObjects/dist/Q001_AccidentPrediction/, choose Display in slide, size 806 × 962 px.', expected: 'Q001 loads cleanly without scrollbars.', test: 'Preview Slide 3 and verify all photo cards fit cleanly.' },
        { what: 'Create Q001 variables & layers', where: 'Project Variables & Slide 3 Layers', how: 'Create Q001_Done, Q001_Correct, Q001_Revealed (True/False = False) and Q001_Answers (Text = ""). Add Correct and Incorrect feedback layers.', expected: 'Submitting Q001 opens the matching feedback layer and sets Q001_Revealed = True.', test: 'Submit correct and incorrect answers and verify feedback + Next unlock.' }
      ],
      checklistItems: ['Insert dist/Q001_AccidentPrediction/ (806 × 962)', 'Create Q001_Done, Q001_Correct, Q001_Answers, Q001_Revealed', 'Wire Correct/Incorrect feedback layers + Q001_Revealed = True', 'Gate Next button on Q001_Done == True']
    },
    {
      no: 4, originalNo: 4, displayOrder: 4, id: 's4',
      title: 'Why Safety Matters — Answer Reveal',
      sceneId: 'scene1', sceneName: 'Scene 1 — Introduction & Course Journey',
      slideType: 'Topic Completion', moduleId: 1, topicId: '101', missionId: 101,
      originStatus: 'Baseline', visualBadge: 'Reference',
      purpose: 'Reveals Q001 takeaway and marks Topic 101 Completed (2), unlocking Topic 103.',
      whatToBuild: ['Answer explanation & safety takeaway', 'Next button'],
      storylineTimeline: { storyline: ['Reveal callouts & narration'], webObject: ['None (native Storyline slide)'] },
      navigation: 'Next → Slide 5 (Meet Your Safety Companions).',
      completionRule: 'On timeline start IF Q001_Done == True: window.DICV_CourseMapHost.markTopicStatus(101, 2);',
      revisitResume: 'markTopicStatus(101, 2) is idempotent and will not downgrade or re-lock Topic 103 on revisit.',
      clickByClick: [
        { what: 'Add Topic 101 completion trigger', where: 'Slide 4 Triggers → When timeline starts', how: 'Execute JavaScript: if (window.DICV_CourseMapHost) window.DICV_CourseMapHost.markTopicStatus(101, 2); Condition: If Q001_Done == True.', expected: 'Topic 101 becomes Completed (2) and Topic 103 unlocks.', test: 'Complete Q001, visit Slide 4, then open Map to confirm Topic 101 = Completed.' }
      ],
      checklistItems: ['Verify Slide 4 reveal content', 'Add markTopicStatus(101, 2) gated by Q001_Done == True']
    },
    {
      no: 5, originalNo: 5, displayOrder: 5, id: 's5',
      title: 'Meet Your Safety Companions',
      sceneId: 'scene1', sceneName: 'Scene 1 — Introduction & Course Journey',
      slideType: 'Character Intro', originStatus: 'Baseline', visualBadge: 'Reference',
      purpose: 'Introduces Meister, Torq, and Aura.',
      whatToBuild: ['Character illustrations (Meister, Torq, Aura)', 'Dialogue / voiceover', 'Next button'],
      storylineTimeline: { storyline: ['All character entrances, speech bubbles, and voiceovers controlled by Storyline'], webObject: ['None'] },
      navigation: 'Next → Slide 6 (Your Safety Mission).',
      completionRule: 'Introductory onboarding slide; no separate Course Map mission ID.',
      revisitResume: 'Standard Storyline revisit.',
      clickByClick: [{ what: 'Verify character timeline & Next', where: 'Slide 5 Timeline & Triggers', how: 'Confirm Meister, Torq, Aura dialogue finishes and Next jumps to Slide 6.', expected: 'Smooth transition to Slide 6.', test: 'Preview Slide 5.' }],
      checklistItems: ['Verify Meister, Torq, Aura assets & audio', 'Confirm Next jumps to Slide 6']
    },
    {
      no: 6, originalNo: 6, displayOrder: 6, id: 's6',
      title: 'Your Safety Mission',
      sceneId: 'scene1', sceneName: 'Scene 1 — Introduction & Course Journey',
      slideType: 'Mission Instructions', originStatus: 'Baseline', visualBadge: 'Reference',
      purpose: 'Explains the learner’s six-star safety mission and course goal.',
      whatToBuild: ['Mission briefing graphics & text', 'Next button'],
      storylineTimeline: { storyline: ['Briefing reveal & narration'], webObject: ['None'] },
      navigation: 'Next → Slide 7 (Mission Guidelines).',
      completionRule: 'Introductory onboarding slide; no separate Course Map mission ID.',
      revisitResume: 'Standard Storyline revisit.',
      clickByClick: [{ what: 'Verify Next trigger', where: 'Slide 6 Triggers', how: 'Confirm Next jumps to Slide 7.', expected: 'Opens Slide 7.', test: 'Preview Slide 6.' }],
      checklistItems: ['Verify Mission briefing text', 'Confirm Next jumps to Slide 7']
    },
    {
      no: 7, originalNo: 7, displayOrder: 7, id: 's7',
      title: 'Mission Guidelines',
      sceneId: 'scene1', sceneName: 'Scene 1 — Introduction & Course Journey',
      slideType: 'Mission Instructions', originStatus: 'Baseline', visualBadge: 'Reference',
      purpose: 'Explains navigation rules, Life Meter, Reward Stars, and Course Map usage.',
      whatToBuild: ['Guidelines cards', 'Life Meter & Reward Stars explanation', 'Next button'],
      storylineTimeline: { storyline: ['Step-by-step guideline callouts'], webObject: ['None'] },
      navigation: 'Next → Slide 8 (EHS Training Journey).',
      completionRule: 'Introductory onboarding slide; no separate Course Map mission ID.',
      revisitResume: 'Standard Storyline revisit.',
      clickByClick: [{ what: 'Verify Next trigger', where: 'Slide 7 Triggers', how: 'Confirm Next jumps to Slide 8.', expected: 'Opens Slide 8 (EHS Training Journey).', test: 'Preview Slide 7.' }],
      checklistItems: ['Verify Mission Guidelines content', 'Confirm Next jumps to Slide 8']
    },
    {
      no: 8, originalNo: 8, displayOrder: 8, id: 's8',
      title: 'EHS Training Journey — Main Course Map',
      sceneId: 'scene1', sceneName: 'Scene 1 — Introduction & Course Journey',
      slideType: 'Course Map', isCourseMap: true, originStatus: 'Baseline', visualBadge: 'Actual',
      purpose: 'THE ONLY Course Map slide in the course. Hosts WebObjects/dist/CourseMap/ (1920 × 1080) and is opened both inline after Slide 7 and via Lightbox from the Slide Master Header Map button.',
      whatToBuild: ['One Web Object (1920 × 1080 px) pointing to WebObjects/dist/CourseMap/ (Display in slide)', 'RequestedMission Jump triggers (101→2, 103→10, 102→12, 104→14, 105→16, 106→18)'],
      webObjectPath: '../WebObjects/dist/CourseMap/',
      webObjectWinPath: 'D:\\Development\\Projects\\dicv-interactive\\WebObjects\\dist\\CourseMap\\',
      storylineTimeline: { storyline: ['Slide Master Header Map button → Lightbox Slide 8', 'RequestedMission Jump triggers'], webObject: ['Conveyor belt animation, 6 modules, 6 Module 1 checkpoints, earned stars, Resume Next Lesson'] },
      navigation: 'Clicking any Available topic or Resume Next Lesson sets RequestedMission and jumps to the opening slide.',
      completionRule: 'Displays 6 Module 1 topics (101, 103, 102, 104, 105, 106) and Modules 2–6. Module 2 unlocks only when all 6 Module 1 topics == 2.',
      revisitResume: 'CRITICAL: Revisiting Slide 8 (inline or via Lightbox) must NEVER reset CourseProgressData. Must read live GetPlayer() state.',
      clickByClick: [
        { what: 'Insert CourseMap Web Object on Slide 8', where: 'Slide 8 → Insert → Web Object', how: 'Browse to WebObjects/dist/CourseMap/, choose Display in slide, size to 1920 × 1080 px.', expected: 'Conveyor Course Map renders cleanly on Slide 8.', test: 'Preview Slide 8 and confirm all 6 modules and Module 1 popup display.' },
        { what: 'Configure Topic Jump Triggers', where: 'Slide 8 Triggers (and verify Lightbox behavior)', how: 'Add Jump to slide triggers when RequestedMission changes for 101→Slide 2, 103→Slide 10, 102→Slide 12, 104→Slide 14, 105→Slide 16, 106→Slide 18.', expected: 'Clicking a topic navigates directly to its opening slide.', test: 'Test both direct Slide 8 visit and Lightbox Slide 8 from Slide 14.' },
        { what: 'Verify Revisit Does Not Wipe Progress', where: 'Slide 8 Properties & Triggers', how: 'Ensure no trigger resets CourseProgressData to blank on Slide 8.', expected: 'Completed topics (e.g. 101, 102) and earned stars stay intact.', test: 'Complete Topic 101, revisit Slide 8, verify Topic 101 remains Completed.' }
      ],
      checklistItems: [
        'Insert WebObjects/dist/CourseMap/ on Slide 8 (1920 × 1080)',
        'Wire RequestedMission Jump triggers (101, 103, 102, 104, 105, 106)',
        'Confirm Slide 8 never resets CourseProgressData on revisit',
        'Verify Lightbox Slide 8 navigation & close behavior in published output'
      ],
      unverifiedNotes: [
        'Needs Storyline Verification: Confirm RequestedMission navigation works cleanly when Slide 8 is opened inside a Lightbox from the Slide Master Map button.'
      ]
    },

    // SCENE 2 — MODULE 1: DICV SAFETY CULTURE & VISION ZERO
    {
      no: 9, originalNo: 9, displayOrder: 9, id: 's9',
      title: 'Module 1 — DICV Safety Culture & Vision Zero Overview',
      sceneId: 'scene2', sceneName: 'Scene 2 — Module 1: DICV Safety Culture & Vision Zero',
      slideType: 'Module Overview', moduleId: 1, originStatus: 'Baseline', visualBadge: 'Reference',
      purpose: 'Dedicated Module 1 Overview slide introducing the 6 topics before Slide 10.',
      whatToBuild: ['Approved Module 1 title & topic overview cards', 'Start / Continue button → Slide 10'],
      storylineTimeline: { storyline: ['Module 1 overview reveal & narration'], webObject: ['None'] },
      navigation: 'Next / Continue → Slide 10 (What Makes a Safer Workplace?).',
      completionRule: 'Module 1 Overview slide; does not award Topic or Star completion.',
      revisitResume: 'Standard Storyline revisit.',
      clickByClick: [{ what: 'Verify Continue trigger', where: 'Slide 9 Triggers', how: 'Confirm Continue / Next jumps to Slide 10.', expected: 'Opens Slide 10.', test: 'Preview Slide 9.' }],
      checklistItems: ['Verify Module 1 Overview content & assets', 'Confirm Continue jumps to Slide 10']
    },
    {
      no: 10, originalNo: 10, displayOrder: 10, id: 's10',
      title: 'What Makes a Safer Workplace? — Q002',
      sceneId: 'scene2', sceneName: 'Scene 2 — Module 1: DICV Safety Culture & Vision Zero',
      slideType: 'Quiz Question', moduleId: 1, topicId: '103', missionId: 103, quizId: 'Q002',
      originStatus: 'Baseline', visualBadge: 'Actual',
      purpose: 'Opening slide for Topic 103 featuring Q002_SafetyCommitments.',
      whatToBuild: ['Embedded Q002 Web Object (1110 × 900 px)', 'Correct & Incorrect Feedback Layers', 'Next button gated on Q002_Done == True'],
      storylineTimeline: { storyline: ['Feedback layers, Life Meter / Reward Stars'], webObject: ['Card entrance, selection state, authorized review'] },
      navigation: 'RequestedMission == 103 jumps here. Next → Slide 11 after Q002_Done == True.',
      completionRule: 'Opening sets Topic 103 = 1 (In Progress); completes (2) on Slide 11.',
      revisitResume: 'Resume saved state so Q002_Answers restores selections.',
      clickByClick: [
        { what: 'Insert Q002 Web Object', where: 'Slide 10 → Insert → Web Object', how: 'Select WebObjects/dist/Q002_SafetyCommitments/ (Display in slide, 1110 × 900 px).', expected: 'Q002 renders cleanly.', test: 'Preview Slide 10.' },
        { what: 'Wire Q002 variables & feedback', where: 'Project Variables & Slide 10', how: 'Create Q002_Done, Q002_Correct, Q002_Revealed (False) and Q002_Answers (""). Add Correct/Incorrect layers.', expected: 'Submit triggers feedback and Q002_Revealed = True.', test: 'Submit Q002 and verify Next unlocks.' }
      ],
      checklistItems: ['Insert dist/Q002_SafetyCommitments/ (1110 × 900)', 'Create Q002_Done, Q002_Correct, Q002_Answers, Q002_Revealed', 'Wire feedback layers & gate Next on Q002_Done == True']
    },
    {
      no: 11, originalNo: 11, displayOrder: 11, id: 's11',
      title: "DICV's Commitment to a Safer Workplace",
      sceneId: 'scene2', sceneName: 'Scene 2 — Module 1: DICV Safety Culture & Vision Zero',
      slideType: 'Answer Explanation', moduleId: 1, topicId: '103', missionId: 103,
      originStatus: 'Baseline', visualBadge: 'Reference',
      purpose: 'Explains Q002 takeaways and marks Topic 103 Completed (2), unlocking Topic 102.',
      whatToBuild: ['Commitment summary & narration', 'Next button'],
      storylineTimeline: { storyline: ['Explanation reveal'], webObject: ['None'] },
      navigation: 'Next → Slide 12 (EHS Vision — Q003).',
      completionRule: 'On timeline start IF Q002_Done == True: window.DICV_CourseMapHost.markTopicStatus(103, 2);',
      revisitResume: 'Idempotent; if Topic 102 was already 2 from Phase B1, Course Map skips 102 and selects 104 next.',
      clickByClick: [
        { what: 'Add Topic 103 completion trigger', where: 'Slide 11 Triggers → When timeline starts', how: 'Execute JavaScript: if (window.DICV_CourseMapHost) window.DICV_CourseMapHost.markTopicStatus(103, 2); Condition: If Q002_Done == True.', expected: 'Topic 103 becomes Completed (2).', test: 'Complete Q002, view Slide 11, verify Topic 103 = 2 in Course Map.' }
      ],
      checklistItems: ['Verify Slide 11 explanation content', 'Add markTopicStatus(103, 2) gated by Q002_Done == True']
    },
    {
      no: 12, originalNo: 12, displayOrder: 12, id: 's12',
      title: 'EHS Vision — Q003',
      sceneId: 'scene2', sceneName: 'Scene 2 — Module 1: DICV Safety Culture & Vision Zero',
      slideType: 'Quiz Question', moduleId: 1, topicId: '102', missionId: 102, quizId: 'Q003',
      originStatus: 'Baseline', visualBadge: 'Actual',
      purpose: 'Opening slide for Topic 102 featuring Q003_EHSCommitments.',
      whatToBuild: ['Embedded Q003 Web Object (1110 × 900 px)', 'Correct & Incorrect Feedback Layers', 'Next button gated on Q003_Done == True'],
      storylineTimeline: { storyline: ['Feedback layers & Life Meter'], webObject: ['Card entrance, selection, authorized review'] },
      navigation: 'RequestedMission == 102 jumps here. Next → Slide 13 after Q003_Done == True.',
      completionRule: 'Opening sets Topic 102 = 1 (if 0); completes (2) on Slide 13.',
      revisitResume: 'Resume saved state; preserves Topic 102 = 2 if already completed in Phase B1.',
      clickByClick: [
        { what: 'Insert Q003 Web Object', where: 'Slide 12 → Insert → Web Object', how: 'Select WebObjects/dist/Q003_EHSCommitments/ (Display in slide, 1110 × 900 px).', expected: 'Q003 renders cleanly.', test: 'Preview Slide 12.' },
        { what: 'Wire Q003 variables & feedback', where: 'Project Variables & Slide 12', how: 'Create Q003_Done, Q003_Correct, Q003_Revealed, Q003_Answers and Correct/Incorrect layers.', expected: 'Submit triggers feedback.', test: 'Submit Q003 and verify Next unlocks.' }
      ],
      checklistItems: ['Insert dist/Q003_EHSCommitments/ (1110 × 900)', 'Create Q003_Done, Q003_Correct, Q003_Answers, Q003_Revealed', 'Wire feedback layers & gate Next on Q003_Done == True']
    },
    {
      no: 13, originalNo: 13, displayOrder: 13, id: 's13',
      title: 'EHS Vision Explanation',
      sceneId: 'scene2', sceneName: 'Scene 2 — Module 1: DICV Safety Culture & Vision Zero',
      slideType: 'Answer Explanation', moduleId: 1, topicId: '102', missionId: 102,
      originStatus: 'Baseline', visualBadge: 'Reference',
      purpose: 'Explains EHS Vision and marks Topic 102 Completed (2), unlocking Topic 104.',
      whatToBuild: ['EHS Vision explanation & graphics', 'Next button'],
      storylineTimeline: { storyline: ['Explanation reveal'], webObject: ['None'] },
      navigation: 'Next → Slide 14 (Safety Strategy — Q004).',
      completionRule: 'On timeline start IF Q003_Done == True: window.DICV_CourseMapHost.markTopicStatus(102, 2);',
      revisitResume: 'Idempotent; never downgrades 2.',
      clickByClick: [
        { what: 'Add Topic 102 completion trigger', where: 'Slide 13 Triggers → When timeline starts', how: 'Execute JavaScript: if (window.DICV_CourseMapHost) window.DICV_CourseMapHost.markTopicStatus(102, 2); Condition: If Q003_Done == True.', expected: 'Topic 102 becomes Completed (2) and Topic 104 unlocks.', test: 'Complete Q003, visit Slide 13, verify Topic 104 unlocks.' }
      ],
      checklistItems: ['Verify Slide 13 explanation', 'Add markTopicStatus(102, 2) gated by Q003_Done == True']
    },
    {
      no: 14, originalNo: 14, displayOrder: 14, id: 's14',
      title: 'Safety Strategy — Q004',
      sceneId: 'scene2', sceneName: 'Scene 2 — Module 1: DICV Safety Culture & Vision Zero',
      slideType: 'Quiz Question', moduleId: 1, topicId: '104', missionId: 104, quizId: 'Q004',
      originStatus: 'Baseline', visualBadge: 'Actual',
      purpose: 'Opening slide for Topic 104 featuring Q004_EHSFocusAreas pinwheel drag-and-drop.',
      whatToBuild: ['Embedded Q004 Web Object (1536 × 1024 px)', 'Correct & Incorrect Feedback Layers', 'Next button gated on Q004_Done == True'],
      storylineTimeline: { storyline: ['Feedback layers, Life Meter & Reward Stars'], webObject: ['Pinwheel drop-zones, drag pickup/settle, invalid auto-return, authorized review'] },
      navigation: 'RequestedMission == 104 jumps here. Next → Slide 15 after Q004_Done == True.',
      completionRule: 'Opening sets Topic 104 = 1; completes (2) on Slide 15.',
      revisitResume: 'Resume saved state so Q004_Answers restores placed focus areas.',
      clickByClick: [
        { what: 'Insert Q004 Web Object', where: 'Slide 14 → Insert → Web Object', how: 'Select WebObjects/dist/Q004_EHSFocusAreas/ (Display in slide, 1536 × 1024 px).', expected: 'Pinwheel drag-and-drop loads cleanly.', test: 'Preview Slide 14 and drag all 3 focus areas.' },
        { what: 'Wire Q004 variables & feedback', where: 'Project Variables & Slide 14', how: 'Create Q004_Done, Q004_Correct, Q004_Revealed, Q004_Answers and Correct/Incorrect layers.', expected: 'Submitting 3 placed pillars triggers feedback and Q004_Revealed.', test: 'Submit Q004 and confirm feedback layer + Next unlock.' }
      ],
      checklistItems: ['Insert dist/Q004_EHSFocusAreas/ (1536 × 1024)', 'Create Q004_Done, Q004_Correct, Q004_Answers, Q004_Revealed', 'Wire Correct/Incorrect feedback layers & Q004_Revealed = True', 'Gate Next button on Q004_Done == True']
    },
    {
      no: 15, originalNo: 15, displayOrder: 15, id: 's15',
      title: 'Safety Strategy Explanation',
      sceneId: 'scene2', sceneName: 'Scene 2 — Module 1: DICV Safety Culture & Vision Zero',
      slideType: 'Answer Explanation', moduleId: 1, topicId: '104', missionId: 104,
      originStatus: 'Baseline', visualBadge: 'Reference',
      purpose: 'Explains the Three Pillars of Safety Strategy and marks Topic 104 Completed (2), unlocking Topic 105.',
      whatToBuild: ['Three Pillars visual breakdown', 'Next button'],
      storylineTimeline: { storyline: ['Three Pillars reveal & voiceover'], webObject: ['None'] },
      navigation: 'Next → Slide 16 (Safety Culture — Q005).',
      completionRule: 'On timeline start IF Q004_Done == True: window.DICV_CourseMapHost.markTopicStatus(104, 2);',
      revisitResume: 'Idempotent; never downgrades 2.',
      clickByClick: [
        { what: 'Add Topic 104 completion trigger', where: 'Slide 15 Triggers → When timeline starts', how: 'Execute JavaScript: if (window.DICV_CourseMapHost) window.DICV_CourseMapHost.markTopicStatus(104, 2); Condition: If Q004_Done == True.', expected: 'Topic 104 becomes Completed (2) and Topic 105 unlocks.', test: 'Complete Q004, visit Slide 15, verify Topic 105 unlocks.' }
      ],
      checklistItems: ['Verify Slide 15 content', 'Add markTopicStatus(104, 2) gated by Q004_Done == True']
    },
    {
      no: 16, originalNo: 16, displayOrder: 16, id: 's16',
      title: 'Safety Culture — Q005',
      sceneId: 'scene2', sceneName: 'Scene 2 — Module 1: DICV Safety Culture & Vision Zero',
      slideType: 'Quiz Question', moduleId: 1, topicId: '105', missionId: 105, quizId: 'Q005',
      originStatus: 'Baseline', visualBadge: 'Actual',
      purpose: 'Opening slide for Topic 105 featuring Q005_SafetyCultureMaturity Bradley Curve drag-and-drop.',
      whatToBuild: ['Embedded Q005 Web Object (1110 × 640 px)', 'Correct & Incorrect Feedback Layers', 'Next button gated on Q005_Done == True'],
      storylineTimeline: { storyline: ['Feedback layers & Life Meter'], webObject: ['Bradley Curve stages, drag-and-drop settle, authorized review'] },
      navigation: 'RequestedMission == 105 jumps here. Next → Slide 17 after Q005_Done == True.',
      completionRule: 'Opening sets Topic 105 = 1; completes (2) on Slide 17.',
      revisitResume: 'Resume saved state so Q005_Answers restores stage placements.',
      clickByClick: [
        { what: 'Insert Q005 Web Object', where: 'Slide 16 → Insert → Web Object', how: 'Select WebObjects/dist/Q005_SafetyCultureMaturity/ (Display in slide, 1110 × 640 px).', expected: 'Bradley Curve quiz renders cleanly.', test: 'Preview Slide 16.' },
        { what: 'Wire Q005 variables & feedback', where: 'Project Variables & Slide 16', how: 'Create Q005_Done, Q005_Correct, Q005_Revealed, Q005_Answers and feedback layers.', expected: 'Submit triggers feedback.', test: 'Submit Q005 and verify Next unlocks.' }
      ],
      checklistItems: ['Insert dist/Q005_SafetyCultureMaturity/ (1110 × 640)', 'Create Q005_Done, Q005_Correct, Q005_Answers, Q005_Revealed', 'Wire feedback layers & gate Next on Q005_Done == True']
    },
    {
      no: 17, originalNo: 17, displayOrder: 17, id: 's17',
      title: 'Safety Culture Explanation',
      sceneId: 'scene2', sceneName: 'Scene 2 — Module 1: DICV Safety Culture & Vision Zero',
      slideType: 'Answer Explanation', moduleId: 1, topicId: '105', missionId: 105,
      originStatus: 'Baseline', visualBadge: 'Reference',
      purpose: 'Explains the Bradley Curve and marks Topic 105 Completed (2), unlocking Topic 106.',
      whatToBuild: ['Bradley Curve explanation diagram', 'Next button'],
      storylineTimeline: { storyline: ['Curve progression narration'], webObject: ['None'] },
      navigation: 'Next → Slide 18 (Safety Review Structure — Q006 Round 1).',
      completionRule: 'On timeline start IF Q005_Done == True: window.DICV_CourseMapHost.markTopicStatus(105, 2);',
      revisitResume: 'Idempotent; never downgrades 2.',
      clickByClick: [
        { what: 'Add Topic 105 completion trigger', where: 'Slide 17 Triggers → When timeline starts', how: 'Execute JavaScript: if (window.DICV_CourseMapHost) window.DICV_CourseMapHost.markTopicStatus(105, 2); Condition: If Q005_Done == True.', expected: 'Topic 105 becomes Completed (2) and Topic 106 unlocks.', test: 'Complete Q005, visit Slide 17, verify Topic 106 unlocks.' }
      ],
      checklistItems: ['Verify Slide 17 content', 'Add markTopicStatus(105, 2) gated by Q005_Done == True']
    },
    {
      no: 18, originalNo: 18, displayOrder: 18, id: 's18',
      title: 'Safety Review Structure — Q006 Round 1',
      sceneId: 'scene2', sceneName: 'Scene 2 — Module 1: DICV Safety Culture & Vision Zero',
      slideType: 'Quiz Question', moduleId: 1, topicId: '106', missionId: 106, quizId: 'Q006_R1',
      originStatus: 'Baseline', visualBadge: 'Actual',
      purpose: 'Opening slide for Topic 106 featuring Q006 Round 1 (Policy Review).',
      whatToBuild: ['Embedded Q006_R1 Web Object (1024 × 576 px)', 'Correct & Incorrect Feedback Layers', 'Next button gated on Q006_R1_Done == True'],
      storylineTimeline: { storyline: ['Feedback layers & Life Meter'], webObject: ['Committee role card selection, Submit lock, authorized review'] },
      navigation: 'RequestedMission == 106 jumps here. Next → Slide 19 after Q006_R1_Done == True.',
      completionRule: 'Opening sets Topic 106 = 1; Topic 106 completes only on Slide 21 after all 3 rounds finish.',
      revisitResume: 'Resume saved state; Q006_R1_Answer (singular) restores selected label.',
      clickByClick: [
        { what: 'Insert Q006_R1 Web Object', where: 'Slide 18 → Insert → Web Object', how: 'Select WebObjects/dist/Q006_R1/ (Display in slide, 1024 × 576 px).', expected: 'Round 1 renders cleanly.', test: 'Preview Slide 18.' },
        { what: 'Wire Q006_R1 variables', where: 'Project Variables & Slide 18', how: 'Create Q006_R1_Done, Q006_R1_Correct, Q006_R1_Revealed, Q006_R1_Answer (singular!).', expected: 'Submitting updates Q006_R1_Done.', test: 'Submit Round 1 and verify Next unlocks.' }
      ],
      checklistItems: ['Insert dist/Q006_R1/ (1024 × 576)', 'Create Q006_R1_Done, Q006_R1_Correct, Q006_R1_Answer, Q006_R1_Revealed', 'Wire feedback layers & gate Next on Q006_R1_Done == True']
    },
    {
      no: 19, originalNo: 19, displayOrder: 19, id: 's19',
      title: 'Safety Review Structure — Q006 Round 2',
      sceneId: 'scene2', sceneName: 'Scene 2 — Module 1: DICV Safety Culture & Vision Zero',
      slideType: 'Quiz Question', moduleId: 1, topicId: '106', missionId: 106, quizId: 'Q006_R2',
      originStatus: 'Baseline', visualBadge: 'Actual',
      purpose: 'Round 2 of Topic 106 featuring Q006_R2 (Performance Issue).',
      whatToBuild: ['Embedded Q006_R2 Web Object (1024 × 576 px)', 'Correct & Incorrect Feedback Layers', 'Next button gated on Q006_R2_Done == True'],
      storylineTimeline: { storyline: ['Feedback layers & Life Meter'], webObject: ['Role selection & authorized review'] },
      navigation: 'Next → Slide 20 after Q006_R2_Done == True.',
      completionRule: 'Part of Topic 106; sets Q006_R2_Done = True.',
      revisitResume: 'Resume saved state; Q006_R2_Answer restores selection.',
      clickByClick: [
        { what: 'Insert Q006_R2 Web Object', where: 'Slide 19 → Insert → Web Object', how: 'Select WebObjects/dist/Q006_R2/. Create Q006_R2_Done, Q006_R2_Correct, Q006_R2_Answer, Q006_R2_Revealed.', expected: 'Round 2 submits and reveals cleanly.', test: 'Submit Round 2 and verify Next unlocks.' }
      ],
      checklistItems: ['Insert dist/Q006_R2/ (1024 × 576)', 'Create Q006_R2_* variables', 'Wire feedback layers & gate Next on Q006_R2_Done == True']
    },
    {
      no: 20, originalNo: 20, displayOrder: 20, id: 's20',
      title: 'Safety Review Structure — Q006 Round 3',
      sceneId: 'scene2', sceneName: 'Scene 2 — Module 1: DICV Safety Culture & Vision Zero',
      slideType: 'Quiz Question', moduleId: 1, topicId: '106', missionId: 106, quizId: 'Q006_R3',
      originStatus: 'Baseline', visualBadge: 'Actual',
      purpose: 'Round 3 of Topic 106 featuring Q006_R3 (Machine Guarding).',
      whatToBuild: ['Embedded Q006_R3 Web Object (1024 × 576 px)', 'Correct & Incorrect Feedback Layers', 'Next button gated on Q006_R3_Done == True'],
      storylineTimeline: { storyline: ['Feedback layers & Life Meter'], webObject: ['Role selection & authorized review'] },
      navigation: 'Next → Slide 21 after Q006_R3_Done == True.',
      completionRule: 'Part of Topic 106; sets Q006_R3_Done = True.',
      revisitResume: 'Resume saved state; Q006_R3_Answer restores selection.',
      clickByClick: [
        { what: 'Insert Q006_R3 Web Object', where: 'Slide 20 → Insert → Web Object', how: 'Select WebObjects/dist/Q006_R3/. Create Q006_R3_Done, Q006_R3_Correct, Q006_R3_Answer, Q006_R3_Revealed.', expected: 'Round 3 submits and reveals cleanly.', test: 'Submit Round 3 and verify Next unlocks.' }
      ],
      checklistItems: ['Insert dist/Q006_R3/ (1024 × 576)', 'Create Q006_R3_* variables', 'Wire feedback layers & gate Next on Q006_R3_Done == True']
    },
    {
      no: 21, originalNo: 21, displayOrder: 21, id: 's21',
      title: 'Safety Review Structure — Explanation',
      sceneId: 'scene2', sceneName: 'Scene 2 — Module 1: DICV Safety Culture & Vision Zero',
      slideType: 'Topic Completion', moduleId: 1, topicId: '106', missionId: 106,
      originStatus: 'Baseline', visualBadge: 'Reference',
      purpose: 'Final explanation for Topic 106 and Module 1 Completion Gate before transitioning to the new separate Module 1 — Star Earned slide.',
      whatToBuild: ['Committee structure explanation', 'Module 1 Completion Gate check (all 6 topics == 2)', 'Next button → Module 1 — Star Earned'],
      storylineTimeline: { storyline: ['Explanation timeline & Module 1 Completion Gate trigger'], webObject: ['None'] },
      navigation: 'Next → Module 1 — Star Earned (only when Module 1 gate is satisfied).',
      completionRule: 'ONLY when Q006_R1_Done && Q006_R2_Done && Q006_R3_Done: markTopicStatus(106, 2). Module 1 Star Earned requires all 6 Module 1 topics (101, 103, 102, 104, 105, 106) == 2.',
      revisitResume: 'Do not award duplicate stars or replay celebration on revisit.',
      clickByClick: [
        { what: 'Gate Topic 106 completion', where: 'Slide 21 Triggers → When timeline ends', how: 'Execute JavaScript: if (window.DICV_CourseMapHost) window.DICV_CourseMapHost.markTopicStatus(106, 2); Condition: Q006_R1_Done == True AND Q006_R2_Done == True AND Q006_R3_Done == True.', expected: 'Topic 106 becomes Completed (2).', test: 'Finish all 3 rounds of Q006, visit Slide 21, confirm Topic 106 = 2.' },
        { what: 'Navigate to Module 1 — Star Earned', where: 'Slide 21 Next Button', how: 'Jump to Module 1 — Star Earned slide.', expected: 'Transitions to dedicated Star 1 slide; Star 1 slide validates all 6 topics == 2.', test: 'Verify direct jump without completing all 6 topics does NOT award Star 1.' }
      ],
      checklistItems: [
        'Gate markTopicStatus(106, 2) on Q006_R1_Done && Q006_R2_Done && Q006_R3_Done',
        'Point Slide 21 Next button to new Module 1 — Star Earned slide',
        'Confirm Module 1 Star Gate requires all 6 topics == 2'
      ],
      unverifiedNotes: [
        'Needs Storyline Verification: Confirm Slide 21 Q006 R1-R3 gating and transition to Module 1 — Star Earned in .story.'
      ]
    },
    {
      no: 'New', originalNo: null, displayOrder: 22, id: 'm1_star',
      title: 'Module 1 — Star Earned',
      sceneId: 'scene2', sceneName: 'Scene 2 — Module 1: DICV Safety Culture & Vision Zero',
      slideType: 'Star Earned', moduleId: 1, starNumber: 1,
      originStatus: 'Proposed / To Build', visualBadge: 'Proposed',
      purpose: 'Dedicated Module 1 Star Earned slide inserted between original Slide 21 and original Slide 22. Validates that all 6 Module 1 topics equal 2 before showing Star 1 and unlocking Module 2.',
      whatToBuild: [
        'Approved Module 1 title & Star 1 illustration',
        'Approved reward message & restrained entrance animation',
        'Completion gate check (all 6 Module 1 topics == 2)',
        'Continue button → Module 2 Overview (Original Slide 22)'
      ],
      storylineTimeline: { storyline: ['1) Validate Module 1 complete -> 2) Controlled Star 1 entrance -> 3) Celebration (no flashing) -> 4) Continue button available'], webObject: ['None'] },
      navigation: 'Continue → Original Slide 22 (Incident Management — Module Overview).',
      completionRule: 'Authoritative gate: Topic 101, 103, 102, 104, 105, 106 must ALL equal 2 in CourseProgressData. Jumping directly here must NOT bypass the gate or award Star 1 twice.',
      revisitResume: 'Star 1 remains visible on revisit/SCORM resume; presentation replay flag (if used) must stay separate from authoritative star state.',
      clickByClick: [
        { what: 'Insert Module 1 — Star Earned slide', where: 'Scene 2 → After Slide 21 (before Original Slide 22)', how: 'Create a new slide named "Module 1 — Star Earned". Do NOT use a layer.', expected: 'Dedicated Star 1 slide sits at the end of Scene 2.', test: 'Verify Scene 2 ends with Module 1 — Star Earned.' },
        { what: 'Apply Star Earned Slide Template', where: 'Module 1 — Star Earned Objects & Timeline', how: 'Add approved Module 1 title, Star 1 graphic, approved reward message, and Continue button.', expected: 'Restrained entrance reveals Star 1 cleanly.', test: 'Preview timeline and check reduced-motion friendliness.' },
        { what: 'Enforce Module 1 Completion Gate', where: 'Module 1 — Star Earned Triggers → When timeline starts', how: 'Check authoritative Module 1 completion (all 6 topics == 2) before showing earned state and unlocking Module 2. Never rely on star animation alone.', expected: 'Module 2 unlocks only when all 6 Module 1 topics == 2.', test: 'Jump directly to Module 1 — Star Earned with incomplete topics and verify Star 1 is NOT awarded.' }
      ],
      checklistItems: [
        'Create separate Module 1 — Star Earned slide after Slide 21',
        'Add Star 1 visual, approved message, and Continue → Slide 22',
        'Enforce authoritative 6-topic completion gate & no-duplicate-award rule',
        'Verify Star 1 persists on revisit & SCORM resume'
      ],
      unverifiedNotes: [
        'Proposed / To Build: Slide does not exist yet in .story; exact Storyline slide number is unassigned until inserted.'
      ]
    },

    // SCENE 3 — MODULE 2: INCIDENT MANAGEMENT
    {
      no: '22*', originalNo: 22, displayOrder: 23, id: 's22',
      title: 'Incident Management — Module Overview',
      sceneId: 'scene3', sceneName: 'Scene 3 — Module 2: Incident Management',
      slideType: 'Module Overview', moduleId: 2,
      originStatus: 'Baseline', visualBadge: 'Reference',
      purpose: 'Original Slide 22 preserved with stable ID (s22, originalNo: 22), now displayed after Module 1 — Star Earned. Opens Module 2.',
      whatToBuild: ['Approved Module 2 title & overview graphics', 'Start / Continue button → Module 2 Topics'],
      storylineTimeline: { storyline: ['Module 2 overview intro animation'], webObject: ['None'] },
      navigation: 'Accessible in Restricted mode only after all 6 Module 1 topics == 2 (Star 1 earned), or in Free mode (L).',
      completionRule: 'Module 2 Overview slide; Module 2 training topics to be mapped in Phase B2.',
      revisitResume: 'Standard Storyline revisit.',
      clickByClick: [
        { what: 'Verify Module 2 Unlock Gate', where: 'Course Map (Slide 8) & Module 1 — Star Earned', how: 'Confirm Module 2 stays Locked until all 6 Module 1 topics == 2.', expected: 'Module 2 unlocks only after Module 1 completes.', test: 'Check Slide 8 Course Map before and after completing Topic 106.' }
      ],
      checklistItems: ['Verify Original Slide 22 overview content', 'Confirm Module 2 unlocks only after Module 1 Star Gate passes']
    },
    {
      no: 'TBD', originalNo: null, displayOrder: 24, id: 'm2_topics',
      title: 'Module 2 — Topics, Training & Quizzes (Placeholder)',
      sceneId: 'scene3', sceneName: 'Scene 3 — Module 2: Incident Management',
      slideType: 'Module Training Placeholder', moduleId: 2,
      originStatus: 'Future Placeholder', visualBadge: 'Proposed',
      purpose: 'Placeholder for Module 2 (Incident Management) training slides, quizzes, and topic completion gates. Curriculum will be populated from approved Phase B2 source material.',
      whatToBuild: ['Approved Module 2 training slides & activities (TBD — do not invent curriculum)'],
      storylineTimeline: { storyline: ['TBD pending approved Module 2 storyboard'], webObject: ['TBD'] },
      navigation: 'Module 2 Overview → Module 2 Training → Module 2 — Star Earned.',
      completionRule: 'All approved Module 2 topics must complete before Module 2 — Star Earned.',
      revisitResume: 'Preserve authoritative CourseProgressData.',
      clickByClick: [
        { what: 'Map approved Module 2 slides when ready', where: 'Scene 3 — Module 2', how: 'Insert approved Module 2 content slides between Original Slide 22 and Module 2 — Star Earned.', expected: 'Module 2 follows the 6-stage learning architecture.', test: 'Verify all Module 2 topic completion triggers before Star 2.' }
      ],
      checklistItems: ['Await approved Module 2 source material (Phase B2)', 'Leave slide numbers unassigned until mapped']
    },
    {
      no: 'TBD', originalNo: null, displayOrder: 25, id: 'm2_star',
      title: 'Module 2 — Star Earned',
      sceneId: 'scene3', sceneName: 'Scene 3 — Module 2: Incident Management',
      slideType: 'Star Earned', moduleId: 2, starNumber: 2,
      originStatus: 'Proposed / To Build', visualBadge: 'Proposed',
      purpose: 'Dedicated Star Earned slide at the end of Module 2 (Incident Management). Awards Star 2 and unlocks Module 3.',
      whatToBuild: ['Approved Module 2 title & Star 2 illustration', 'Completion gate & Continue → Module 3 Overview'],
      storylineTimeline: { storyline: ['1) Validate Module 2 complete -> 2) Controlled Star 2 entrance -> 3) Continue available'], webObject: ['None'] },
      navigation: 'Continue → Module 3 — Overview.',
      completionRule: 'Shown only after all approved Module 2 completion conditions are satisfied.',
      revisitResume: 'Star 2 persists on revisit and LMS resume.',
      clickByClick: [
        { what: 'Create Module 2 — Star Earned slide', where: 'End of Scene 3 (Module 2)', how: 'Build separate Star Earned slide using the reusable Star Earned Template.', expected: 'Awards Star 2 and unlocks Module 3.', test: 'Verify Module 2 gate blocks Star 2 if incomplete.' }
      ],
      checklistItems: ['Create separate Module 2 — Star Earned slide', 'Wire Module 2 completion gate & Module 3 unlock']
    },

    // MODULES 3–6 (Official names from coursemap-data.js; curriculum NOT invented)
    {
      no: 'TBD', originalNo: null, displayOrder: 26, id: 'm3_overview',
      title: 'Hazard Identification, Risk Assessment & Controls — Module Overview',
      sceneId: 'scene4', sceneName: 'Scene 4 — Module 3: Hazard Identification, Risk Assessment & Controls',
      slideType: 'Module Overview', moduleId: 3, originStatus: 'Proposed / To Build', visualBadge: 'Proposed',
      purpose: 'Dedicated opening Overview slide for Module 3 (official title from coursemap-data.js).',
      whatToBuild: ['Approved Module 3 title & overview graphics', 'Continue → Module 3 Training'],
      storylineTimeline: { storyline: ['Module 3 overview intro'], webObject: ['None'] },
      navigation: 'Unlocks after Module 2 Star Earned.', completionRule: 'Overview slide only.', revisitResume: 'Standard revisit.',
      clickByClick: [{ what: 'Create Module 3 Overview slide', where: 'Scene 4 — Module 3', how: 'Use the reusable Module Overview Template with approved Module 3 assets only.', expected: 'Dedicated Module 3 Overview slide.', test: 'Verify Module 3 stays locked until Star 2 is earned.' }],
      checklistItems: ['Create separate Module 3 Overview slide using approved assets']
    },
    {
      no: 'TBD', originalNo: null, displayOrder: 27, id: 'm3_training',
      title: 'Module 3 — Training Topics (Placeholder)',
      sceneId: 'scene4', sceneName: 'Scene 4 — Module 3: Hazard Identification, Risk Assessment & Controls',
      slideType: 'Module Training Placeholder', moduleId: 3, originStatus: 'Future Placeholder', visualBadge: 'Proposed',
      purpose: 'Future placeholder for Module 3 training slides and topic gates. Do not invent curriculum.',
      whatToBuild: ['Approved Module 3 content slides (TBD)'],
      storylineTimeline: { storyline: ['TBD'], webObject: ['TBD'] },
      navigation: 'Module 3 Overview → Training → Module 3 — Star Earned.', completionRule: 'All Module 3 topics complete before Star 3.', revisitResume: 'Preserve CourseProgressData.',
      clickByClick: [{ what: 'Populate from approved storyboard', where: 'Scene 4 — Module 3', how: 'Add approved Module 3 slides when provided.', expected: 'Complete Stage B & C.', test: 'Verify topic gates.' }],
      checklistItems: ['Await approved Module 3 curriculum']
    },
    {
      no: 'TBD', originalNo: null, displayOrder: 28, id: 'm3_star',
      title: 'Module 3 — Star Earned',
      sceneId: 'scene4', sceneName: 'Scene 4 — Module 3: Hazard Identification, Risk Assessment & Controls',
      slideType: 'Star Earned', moduleId: 3, starNumber: 3, originStatus: 'Proposed / To Build', visualBadge: 'Proposed',
      purpose: 'Dedicated Star Earned slide for Module 3. Awards Star 3 and unlocks Module 4.',
      whatToBuild: ['Star 3 illustration & approved reward message', 'Module 3 completion gate & Continue → Module 4 Overview'],
      storylineTimeline: { storyline: ['Validated Star 3 entrance'], webObject: ['None'] },
      navigation: 'Continue → Module 4 Overview.', completionRule: 'Gated on Module 3 completion.', revisitResume: 'Star 3 persists on revisit.',
      clickByClick: [{ what: 'Create Module 3 — Star Earned slide', where: 'End of Scene 4', how: 'Apply reusable Star Earned Template.', expected: 'Awards Star 3.', test: 'Verify gate.' }],
      checklistItems: ['Create separate Module 3 — Star Earned slide']
    },

    {
      no: 'TBD', originalNo: null, displayOrder: 29, id: 'm4_overview',
      title: 'Ergonomics — Module Overview',
      sceneId: 'scene5', sceneName: 'Scene 5 — Module 4: Ergonomics',
      slideType: 'Module Overview', moduleId: 4, originStatus: 'Proposed / To Build', visualBadge: 'Proposed',
      purpose: 'Dedicated opening Overview slide for Module 4 (Ergonomics).',
      whatToBuild: ['Approved Module 4 title & overview graphics', 'Continue → Module 4 Training'],
      storylineTimeline: { storyline: ['Module 4 overview intro'], webObject: ['None'] },
      navigation: 'Unlocks after Module 3 Star Earned.', completionRule: 'Overview slide only.', revisitResume: 'Standard revisit.',
      clickByClick: [{ what: 'Create Module 4 Overview slide', where: 'Scene 5 — Module 4', how: 'Apply reusable Module Overview Template.', expected: 'Dedicated Module 4 Overview slide.', test: 'Verify unlock after Star 3.' }],
      checklistItems: ['Create separate Module 4 Overview slide']
    },
    {
      no: 'TBD', originalNo: null, displayOrder: 30, id: 'm4_training',
      title: 'Module 4 — Training Topics (Placeholder)',
      sceneId: 'scene5', sceneName: 'Scene 5 — Module 4: Ergonomics',
      slideType: 'Module Training Placeholder', moduleId: 4, originStatus: 'Future Placeholder', visualBadge: 'Proposed',
      purpose: 'Future placeholder for Module 4 training slides. Do not invent curriculum.',
      whatToBuild: ['Approved Module 4 content slides (TBD)'],
      storylineTimeline: { storyline: ['TBD'], webObject: ['TBD'] },
      navigation: 'Module 4 Overview → Training → Module 4 — Star Earned.', completionRule: 'All Module 4 topics complete before Star 4.', revisitResume: 'Preserve CourseProgressData.',
      clickByClick: [{ what: 'Populate from approved storyboard', where: 'Scene 5 — Module 4', how: 'Add approved Module 4 slides when provided.', expected: 'Complete Stage B & C.', test: 'Verify topic gates.' }],
      checklistItems: ['Await approved Module 4 curriculum']
    },
    {
      no: 'TBD', originalNo: null, displayOrder: 31, id: 'm4_star',
      title: 'Module 4 — Star Earned',
      sceneId: 'scene5', sceneName: 'Scene 5 — Module 4: Ergonomics',
      slideType: 'Star Earned', moduleId: 4, starNumber: 4, originStatus: 'Proposed / To Build', visualBadge: 'Proposed',
      purpose: 'Dedicated Star Earned slide for Module 4. Awards Star 4 and unlocks Module 5.',
      whatToBuild: ['Star 4 illustration & approved reward message', 'Module 4 completion gate & Continue → Module 5 Overview'],
      storylineTimeline: { storyline: ['Validated Star 4 entrance'], webObject: ['None'] },
      navigation: 'Continue → Module 5 Overview.', completionRule: 'Gated on Module 4 completion.', revisitResume: 'Star 4 persists on revisit.',
      clickByClick: [{ what: 'Create Module 4 — Star Earned slide', where: 'End of Scene 5', how: 'Apply reusable Star Earned Template.', expected: 'Awards Star 4.', test: 'Verify gate.' }],
      checklistItems: ['Create separate Module 4 — Star Earned slide']
    },

    {
      no: 'TBD', originalNo: null, displayOrder: 32, id: 'm5_overview',
      title: 'Chemical & Dangerous Goods Safety — Module Overview',
      sceneId: 'scene6', sceneName: 'Scene 6 — Module 5: Chemical & Dangerous Goods Safety',
      slideType: 'Module Overview', moduleId: 5, originStatus: 'Proposed / To Build', visualBadge: 'Proposed',
      purpose: 'Dedicated opening Overview slide for Module 5 (Chemical & Dangerous Goods Safety).',
      whatToBuild: ['Approved Module 5 title & overview graphics', 'Continue → Module 5 Training'],
      storylineTimeline: { storyline: ['Module 5 overview intro'], webObject: ['None'] },
      navigation: 'Unlocks after Module 4 Star Earned.', completionRule: 'Overview slide only.', revisitResume: 'Standard revisit.',
      clickByClick: [{ what: 'Create Module 5 Overview slide', where: 'Scene 6 — Module 5', how: 'Apply reusable Module Overview Template.', expected: 'Dedicated Module 5 Overview slide.', test: 'Verify unlock after Star 4.' }],
      checklistItems: ['Create separate Module 5 Overview slide']
    },
    {
      no: 'TBD', originalNo: null, displayOrder: 33, id: 'm5_training',
      title: 'Module 5 — Training Topics (Placeholder)',
      sceneId: 'scene6', sceneName: 'Scene 6 — Module 5: Chemical & Dangerous Goods Safety',
      slideType: 'Module Training Placeholder', moduleId: 5, originStatus: 'Future Placeholder', visualBadge: 'Proposed',
      purpose: 'Future placeholder for Module 5 training slides. Do not invent curriculum.',
      whatToBuild: ['Approved Module 5 content slides (TBD)'],
      storylineTimeline: { storyline: ['TBD'], webObject: ['TBD'] },
      navigation: 'Module 5 Overview → Training → Module 5 — Star Earned.', completionRule: 'All Module 5 topics complete before Star 5.', revisitResume: 'Preserve CourseProgressData.',
      clickByClick: [{ what: 'Populate from approved storyboard', where: 'Scene 6 — Module 5', how: 'Add approved Module 5 slides when provided.', expected: 'Complete Stage B & C.', test: 'Verify topic gates.' }],
      checklistItems: ['Await approved Module 5 curriculum']
    },
    {
      no: 'TBD', originalNo: null, displayOrder: 34, id: 'm5_star',
      title: 'Module 5 — Star Earned',
      sceneId: 'scene6', sceneName: 'Scene 6 — Module 5: Chemical & Dangerous Goods Safety',
      slideType: 'Star Earned', moduleId: 5, starNumber: 5, originStatus: 'Proposed / To Build', visualBadge: 'Proposed',
      purpose: 'Dedicated Star Earned slide for Module 5. Awards Star 5 and unlocks Module 6.',
      whatToBuild: ['Star 5 illustration & approved reward message', 'Module 5 completion gate & Continue → Module 6 Overview'],
      storylineTimeline: { storyline: ['Validated Star 5 entrance'], webObject: ['None'] },
      navigation: 'Continue → Module 6 Overview.', completionRule: 'Gated on Module 5 completion.', revisitResume: 'Star 5 persists on revisit.',
      clickByClick: [{ what: 'Create Module 5 — Star Earned slide', where: 'End of Scene 6', how: 'Apply reusable Star Earned Template.', expected: 'Awards Star 5.', test: 'Verify gate.' }],
      checklistItems: ['Create separate Module 5 — Star Earned slide']
    },

    {
      no: 'TBD', originalNo: null, displayOrder: 35, id: 'm6_overview',
      title: 'Shopfloor Safety Etiquettes and Golden Safety Rules — Module Overview',
      sceneId: 'scene7', sceneName: 'Scene 7 — Module 6: Shopfloor Safety Etiquettes and Golden Safety Rules',
      slideType: 'Module Overview', moduleId: 6, originStatus: 'Proposed / To Build', visualBadge: 'Proposed',
      purpose: 'Dedicated opening Overview slide for Module 6.',
      whatToBuild: ['Approved Module 6 title & overview graphics', 'Continue → Module 6 Training'],
      storylineTimeline: { storyline: ['Module 6 overview intro'], webObject: ['None'] },
      navigation: 'Unlocks after Module 5 Star Earned.', completionRule: 'Overview slide only.', revisitResume: 'Standard revisit.',
      clickByClick: [{ what: 'Create Module 6 Overview slide', where: 'Scene 7 — Module 6', how: 'Apply reusable Module Overview Template.', expected: 'Dedicated Module 6 Overview slide.', test: 'Verify unlock after Star 5.' }],
      checklistItems: ['Create separate Module 6 Overview slide']
    },
    {
      no: 'TBD', originalNo: null, displayOrder: 36, id: 'm6_training',
      title: 'Module 6 — Training Topics (Placeholder)',
      sceneId: 'scene7', sceneName: 'Scene 7 — Module 6: Shopfloor Safety Etiquettes and Golden Safety Rules',
      slideType: 'Module Training Placeholder', moduleId: 6, originStatus: 'Future Placeholder', visualBadge: 'Proposed',
      purpose: 'Future placeholder for Module 6 training slides. Do not invent curriculum.',
      whatToBuild: ['Approved Module 6 content slides (TBD)'],
      storylineTimeline: { storyline: ['TBD'], webObject: ['TBD'] },
      navigation: 'Module 6 Overview → Training → Module 6 — Star Earned.', completionRule: 'All Module 6 topics complete before Star 6.', revisitResume: 'Preserve CourseProgressData.',
      clickByClick: [{ what: 'Populate from approved storyboard', where: 'Scene 7 — Module 6', how: 'Add approved Module 6 slides when provided.', expected: 'Complete Stage B & C.', test: 'Verify topic gates.' }],
      checklistItems: ['Await approved Module 6 curriculum']
    },
    {
      no: 'TBD', originalNo: null, displayOrder: 37, id: 'm6_star',
      title: 'Module 6 — Star Earned',
      sceneId: 'scene7', sceneName: 'Scene 7 — Module 6: Shopfloor Safety Etiquettes and Golden Safety Rules',
      slideType: 'Star Earned', moduleId: 6, starNumber: 6, originStatus: 'Proposed / To Build', visualBadge: 'Proposed',
      purpose: 'Dedicated Star Earned slide for Module 6. Awards Star 6 and transitions to Mission Complete.',
      whatToBuild: ['Star 6 illustration & approved reward message', 'Module 6 completion gate & Continue → Mission Complete'],
      storylineTimeline: { storyline: ['Validated Star 6 entrance'], webObject: ['None'] },
      navigation: 'Continue → Mission Complete (Six Stars Collected).', completionRule: 'Gated on Module 6 completion.', revisitResume: 'Star 6 persists on revisit.',
      clickByClick: [{ what: 'Create Module 6 — Star Earned slide', where: 'End of Scene 7', how: 'Apply reusable Star Earned Template.', expected: 'Awards Star 6.', test: 'Verify gate.' }],
      checklistItems: ['Create separate Module 6 — Star Earned slide']
    },

    // FINAL MISSION COMPLETE & QA
    {
      no: 'Final', originalNo: null, displayOrder: 38, id: 'mission_complete',
      title: 'Mission Complete — Six Stars Collected',
      sceneId: 'final', sceneName: 'Final Mission — Six Stars Collected & LMS Verification',
      slideType: 'Mission Complete', originStatus: 'Proposed / To Build', visualBadge: 'Proposed',
      purpose: 'Dedicated final Storyline slide shown after Module 6 — Star Earned. Displays all six earned stars, approved Mission Complete visual/message, and triggers final Storyline course completion.',
      whatToBuild: [
        'Six earned stars display (derived from Modules 1–6 authoritative completion)',
        'Approved Mission Complete visual, message & character celebration',
        'Complete course trigger (only when all 6 modules & 6 stars are verified)'
      ],
      storylineTimeline: { storyline: ['1) Validate all 6 modules complete -> 2) Display 6 stars -> 3) Approved finale -> 4) Complete course trigger'], webObject: ['None'] },
      navigation: 'End of continuous six-module mission; Exit / Return to Course Map.',
      completionRule: 'Must validate ALL 6 modules complete and ALL 6 stars earned before firing Storyline Complete course trigger. Prevent premature completion and duplicate final-award events.',
      revisitResume: 'Restores 6-star completed state on revisit and Oracle LMS SCORM resume.',
      clickByClick: [
        { what: 'Create Mission Complete slide', where: 'Final Scene (after Module 6 — Star Earned)', how: 'Create one dedicated slide for Six Stars Collected + Mission Complete (do not add a separate slide just for "Six Stars Collected").', expected: 'Final slide presents all 6 stars cleanly.', test: 'Verify slide exists after Module 6 — Star Earned.' },
        { what: 'Gate Final Course Completion', where: 'Mission Complete Triggers → When timeline starts', how: 'Validate all 6 modules == Complete before firing Storyline Complete course trigger.', expected: 'Prevents premature LMS completion if jumped to directly.', test: 'Test in SCORM / Oracle LMS and verify suspend_data + completion status.' }
      ],
      checklistItems: [
        'Create dedicated Mission Complete slide after Module 6 — Star Earned',
        'Validate all 6 modules & 6 stars before firing Complete course',
        'Test SCORM completion & 6-star resume in Oracle LMS'
      ],
      unverifiedNotes: [
        'Needs Storyline & Oracle LMS Verification: Visual celebration alone does not prove LMS completion.'
      ]
    },
    {
      no: 'QA', originalNo: null, displayOrder: 39, id: 'qa_publish',
      title: 'Storyline, SCORM Publishing & Oracle LMS QA',
      sceneId: 'final', sceneName: 'Final Mission — Six Stars Collected & LMS Verification',
      slideType: 'QA & Publishing', originStatus: 'QA Checklist', visualBadge: 'Not Verified',
      purpose: 'Final end-to-end verification across Storyline Preview, Published HTML5/SCORM output, and Oracle LMS.',
      whatToBuild: ['Published SCORM 1.2 / 2004 package', 'Verified Oracle LMS launch & resume test'],
      storylineTimeline: { storyline: ['Full course navigation, Lightbox Map, and SCORM reporting'], webObject: ['All 8 quiz packages + Slide 8 Course Map'] },
      navigation: 'Covers full journey from Slide 1 to Mission Complete.',
      completionRule: 'All tests use PASS / FAIL / NOT TESTED / BLOCKED with real evidence.',
      revisitResume: 'Verify suspend_data restores CourseProgressData, 6 stars, and Q001–Q006_R3 states.',
      clickByClick: [
        { what: 'Publish to SCORM & test locally', where: 'Storyline 360 → Publish → LMS', how: 'Publish SCORM package and verify all Web Objects load with zero 404s or console errors.', expected: 'All 8 quiz Web Objects and Slide 8 Course Map load cleanly.', test: 'Walk through Module 1 end-to-end.' },
        { what: 'Verify in Oracle LMS', where: 'Oracle LMS Staging / Production', how: 'Launch, complete Topic 101 & 103, close, relaunch, and confirm CourseProgressData & earned stars restore.', expected: 'Progress and completion persist accurately.', test: 'Record PASS/FAIL with LMS evidence.' }
      ],
      checklistItems: [
        'Test Slide Master Map button Lightbox & topic jump in published output',
        'Verify all 8 quizzes (Q001–Q006_R3) submit, reveal, and restore on revisit',
        'Verify Oracle LMS SCORM launch, suspend_data resume, and completion'
      ]
    }
  ];

  var BUILD_ORDER = [
    { step: 1, title: 'Project & Theme Setup', nodeId: 'project_setup', note: 'Single continuous .story project & Daimler theme' },
    { step: 2, title: 'Slide Master Setup', nodeId: 'master', note: 'Base Master layout & shared Header' },
    { step: 3, title: 'Header & Single Map Button', nodeId: 'master', note: 'Lightbox Slide 8 (NO full CourseMap in Master)' },
    { step: 4, title: 'Shared Course Map Variables', nodeId: 'project_setup', note: 'NavigationMode, CourseProgressData, RequestedMission' },
    { step: 5, title: 'Course Map Integration (Slide 8)', nodeId: 's8', note: 'Insert WebObjects/dist/CourseMap/ on Slide 8 only' },
    { step: 6, title: 'Introduction Slides (Slides 1–7)', nodeId: 's1', note: 'Cover, Topic 101 (Q001), Companions, Mission, Guidelines' },
    { step: 7, title: 'Module 1 Overview (Slide 9)', nodeId: 's9', note: 'Dedicated Module 1 opening slide' },
    { step: 8, title: 'Module 1 Training & Quizzes (Slides 10–20)', nodeId: 's10', note: 'Q002, Q003, Q004, Q005, Q006 R1–R3' },
    { step: 9, title: 'Module 1 Completion Gate (Slide 21)', nodeId: 's21', note: 'Topic 106 gate + all 6 topics == 2 check' },
    { step: 10, title: 'Module 1 — Star Earned (New Slide)', nodeId: 'm1_star', note: 'Dedicated Star 1 slide before Original Slide 22' },
    { step: 11, title: 'Module 2 Overview & Training (Orig. Slide 22+)', nodeId: 's22', note: 'Incident Management Overview & Phase B2 topics' },
    { step: 12, title: 'Module 2 — Star Earned', nodeId: 'm2_star', note: 'Dedicated Star 2 slide' },
    { step: 13, title: 'Repeat Modules 3–6 (Overview → Training → Star)', nodeId: 'm3_overview', note: 'Modules 3, 4, 5, 6 each with Overview + Star Earned' },
    { step: 14, title: 'Final Mission Complete (Six Stars Collected)', nodeId: 'mission_complete', note: 'Dedicated final slide after Star 6' },
    { step: 15, title: 'Full Storyline Testing', nodeId: 'qa_publish', note: 'Lightbox, quiz gates, star gates, revisit' },
    { step: 16, title: 'SCORM Publishing', nodeId: 'qa_publish', note: 'Package & verify Web Object assets' },
    { step: 17, title: 'Oracle LMS Verification', nodeId: 'qa_publish', note: 'Launch, suspend_data resume, 6-star completion' }
  ];

  var ALL_NODES = PROJECT_SETUP_NODES.concat(SOURCE_AND_PLANNED_NODES);

  root.DICV_STORY_MANIFEST = {
    masterSlide: PROJECT_SETUP_NODES[1],
    setupNodes: PROJECT_SETUP_NODES,
    slides: SOURCE_AND_PLANNED_NODES,
    allNodes: ALL_NODES,
    buildOrder: BUILD_ORDER
  };
})(typeof window !== 'undefined' ? window : globalThis);
