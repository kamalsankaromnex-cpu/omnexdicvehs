/**
 * hub-data.js — Verified Configuration & Metadata for DICV Interactive Review Hub
 * All facts extracted directly from WebObjects/quizzes/*, WebObjects/dist/*,
 * WebObjects/shared/storyline/storyline-bridge.js, and WebObjects/docs/*.
 */
window.DICV_HUB_DATA = {
  project: {
    name: 'DICV Interactive Safety eLearning',
    hubTitle: 'Quiz Integration & Review Hub',
    counts: {
      quizzes: 6,
      webObjects: 8,
      q006Slides: 3
    },
    overallStatus: {
      buildPackages: { label: 'Ready (8/8 Built)', tone: 'ready' },
      technicalAudit: { label: 'Passed (Automated)', tone: 'pass' },
      animationPrototypes: { label: 'Needs Review', tone: 'review' },
      storylineIntegration: { label: 'Testing Required', tone: 'testing' },
      oracleLms: { label: 'Blocked (No SCORM Export in Workspace)', tone: 'blocked' }
    }
  },

  quizzes: [
    {
      id: 'Q001',
      group: 'Q001',
      title: 'Accident Prediction',
      interactionType: 'Photo Multiple-Selection',
      category: 'choice',
      shortDesc: 'Select applicable shop-floor photographs showing employees at risk of an accident.',
      canvas: { width: 806, height: 962, responsive: false, ratio: '806 × 962 px' },
      distFolder: '../WebObjects/dist/Q001_AccidentPrediction/',
      zipFile: '../WebObjects/dist/Q001_AccidentPrediction.zip',
      srcFolder: '../WebObjects/quizzes/Q001_AccidentPrediction/',
      previewUrl: '../WebObjects/dist/Q001_AccidentPrediction/index.html',
      motionPreviewUrl: '../WebObjects/prototypes/motion/q001_motion.html',
      screenshotUrl: '../WebObjects/references/quiz-screenshots/Q001_rendered_806x962.png',
      overview: {
        purpose: 'Help learners recognize that any worker on the shop floor—even in routine situations—can experience an accident if hazards are overlooked.',
        whatLearnerSees: 'A question heading, 4 workplace photograph cards (A–D), a Reset button, and a Submit button.',
        whatLearnerDoes: 'Clicks one or more photo cards (A, B, C, D) to select them, then clicks Submit.',
        requiredCount: 'At least 1 card selected to enable Submit; all 4 cards (A, B, C, D) are required for a Correct score.',
        submitRule: 'Submit activates as soon as 1 or more cards are selected. Reset clears selection before Submit.',
        answerKeySummary: 'All 4 options (A: Employee walking, B: MHE operator, C: Maintenance technician, D: Employee using a ladder).'
      },
      journeySteps: [
        'Quiz opens with 4 photo cards unselected',
        'Learner clicks photo cards to toggle selection',
        'Submit becomes active (≥ 1 selected)',
        'Learner clicks Submit → cards lock',
        'Storyline shows Correct/Incorrect feedback layer',
        'After feedback closes, Storyline triggers answer review'
      ],
      variables: [
        { name: 'Q001_Done', type: 'True/False', initial: 'False', purpose: 'Tells Storyline that the learner submitted Q001.', updatedBy: 'HTML Bridge', readBy: 'Storyline Trigger', expectedResult: 'Toggles True to launch feedback or next slide.' },
        { name: 'Q001_Correct', type: 'True/False', initial: 'False', purpose: 'Records whether the learner selected all 4 correct photos.', updatedBy: 'HTML Bridge', readBy: 'Storyline Feedback / Score', expectedResult: 'True only if A, B, C, and D are all selected.' },
        { name: 'Q001_Answers', type: 'Text', initial: '"" (blank)', purpose: 'Stores the sorted list of selected card IDs (e.g., ["A","B","C","D"]).', updatedBy: 'HTML Bridge', readBy: 'Storyline / Resume', expectedResult: 'Restores selected cards on revisit.' },
        { name: 'Q001_Revealed', type: 'True/False', initial: 'False', purpose: 'Authorizes the HTML quiz to show green/red review highlights.', updatedBy: 'Storyline Layer', readBy: 'HTML Bridge Poller', expectedResult: 'Review badges appear only after feedback closes.' }
      ],
      feedbackLayers: [
        { layer: 'Correct Feedback Layer', trigger: 'When Q001_Done changes AND Q001_Correct == True', onClose: 'Set Q001_Revealed = True (or advance slide).' },
        { layer: 'Incorrect Feedback Layer', trigger: 'When Q001_Done changes AND Q001_Correct == False', onClose: 'Set Q001_Revealed = True before retry/advance.' }
      ],
      files: ['index.html (self-contained with Base64 images)', 'storyline-bridge.js', 'fonts.css', 'fonts/DaimlerCS-*.ttf', 'quiz.json', 'assets/'],
      testingStatus: {
        sourceInspected: 'PASS',
        browserHarness: 'PASS',
        storyline: 'NOT TESTED',
        review360: 'NOT TESTED',
        oracleLms: 'BLOCKED',
        revisit: 'PASS',
        resume: 'NOT TESTED',
        feedbackSync: 'PASS',
        animationReadiness: 'READY'
      },
      knownIssues: [
        { id: 'DICV-QA-001', status: 'Closed', summary: 'Fixed initial Q001 sizing, font bundling, and card layout.' },
        { id: 'DICV-QA-008', status: 'Closed', summary: 'Removed duplicate Q001_Done toggle and enforced reveal lock.' }
      ]
    },

    {
      id: 'Q002',
      group: 'Q002',
      title: 'Safety Commitments',
      interactionType: '5-Card Multiple-Selection',
      category: 'choice',
      shortDesc: 'Select all five commitments a company should make for a safer workplace.',
      canvas: { width: 1110, height: 900, responsive: false, ratio: '1110 × 900 px' },
      distFolder: '../WebObjects/dist/Q002_SafetyCommitments/',
      zipFile: '../WebObjects/dist/Q002_SafetyCommitments.zip',
      srcFolder: '../WebObjects/quizzes/Q002_SafetyCommitments/',
      previewUrl: '../WebObjects/dist/Q002_SafetyCommitments/index.html',
      motionPreviewUrl: '../WebObjects/prototypes/motion/q002_motion.html',
      screenshotUrl: '../WebObjects/references/quiz-screenshots/Q002_rendered_default.png',
      overview: {
        purpose: 'Reinforce that workplace safety requires commitment across employee well-being, environment, energy, risk reduction, and compliance.',
        whatLearnerSees: '5 corporate-petrol-styled commitment cards arranged in two rows (3 top, 2 bottom) with Daimler Yellow checkboxes.',
        whatLearnerDoes: 'Clicks commitment cards to check them, then clicks Submit.',
        requiredCount: 'At least 1 card to enable Submit; all 5 cards (A, B, C, D, E) required for Correct.',
        submitRule: 'Submit enables on ≥ 1 selection. Partial credit is disabled.',
        answerKeySummary: 'All 5 commitments (A–E).'
      },
      journeySteps: [
        'Quiz opens with 5 commitment cards',
        'Learner checks one or more cards',
        'Submit activates on first selection',
        'Learner clicks Submit → cards lock',
        'Storyline opens Correct or Incorrect layer',
        'Closing feedback sets Q002_Revealed = True'
      ],
      variables: [
        { name: 'Q002_Done', type: 'True/False', initial: 'False', purpose: 'Signals Storyline that Q002 was submitted.', updatedBy: 'HTML Bridge', readBy: 'Storyline Trigger', expectedResult: 'Opens feedback layer.' },
        { name: 'Q002_Correct', type: 'True/False', initial: 'False', purpose: 'True only when all 5 cards (A–E) are selected.', updatedBy: 'HTML Bridge', readBy: 'Storyline Trigger', expectedResult: 'Routes to Correct or Incorrect layer.' },
        { name: 'Q002_Answers', type: 'Text', initial: '"" (blank)', purpose: 'Stores selected card IDs for revisit restoration.', updatedBy: 'HTML Bridge', readBy: 'Storyline / Resume', expectedResult: 'Re-checks previously chosen cards.' },
        { name: 'Q002_Revealed', type: 'True/False', initial: 'False', purpose: 'Authorizes HTML review highlights after feedback closes.', updatedBy: 'Storyline Layer', readBy: 'HTML Bridge Poller', expectedResult: 'No premature reveal before feedback closes.' }
      ],
      feedbackLayers: [
        { layer: 'Correct Feedback Layer', trigger: 'When Q002_Done changes AND Q002_Correct == True', onClose: 'Set Q002_Revealed = True.' },
        { layer: 'Incorrect Feedback Layer', trigger: 'When Q002_Done changes AND Q002_Correct == False', onClose: 'Set Q002_Revealed = True.' }
      ],
      files: ['index.html', 'storyline-bridge.js', 'fonts.css', 'fonts/', 'assets/icons/*.png', 'quiz.json'],
      testingStatus: {
        sourceInspected: 'PASS',
        browserHarness: 'PASS',
        storyline: 'NOT TESTED',
        review360: 'NOT TESTED',
        oracleLms: 'BLOCKED',
        revisit: 'PASS',
        resume: 'NOT TESTED',
        feedbackSync: 'PASS',
        animationReadiness: 'READY'
      },
      knownIssues: [
        { id: 'DICV-QA-002', status: 'Closed', summary: 'Added active polling for Q002_Revealed.' },
        { id: 'DICV-QA-008', status: 'Closed', summary: 'Removed premature 700ms auto-reveal timer.' }
      ]
    },

    {
      id: 'Q003',
      group: 'Q003',
      title: 'EHS Commitments',
      interactionType: 'Select 4 of 5 (Max-4 Cap)',
      category: 'choice',
      shortDesc: 'Choose the 4 true DICV EHS commitments from 5 options (1 distractor).',
      canvas: { width: 1110, height: 900, responsive: false, ratio: '1110 × 900 px' },
      distFolder: '../WebObjects/dist/Q003_EHSCommitments/',
      zipFile: '../WebObjects/dist/Q003_EHSCommitments.zip',
      srcFolder: '../WebObjects/quizzes/Q003_EHSCommitments/',
      previewUrl: '../WebObjects/dist/Q003_EHSCommitments/index.html',
      motionPreviewUrl: '../WebObjects/prototypes/motion/q003_motion.html',
      screenshotUrl: null,
      overview: {
        purpose: 'Test whether learners can distinguish core EHS commitments from a production-output distractor.',
        whatLearnerSees: '5 option cards with vector icons and a selection limit of 4.',
        whatLearnerDoes: 'Selects 4 cards; once 4 are selected, the 5th card disables until one is deselected.',
        requiredCount: 'Max 4 selections allowed. Correct requires A, B, C, and D (excluding E).',
        submitRule: 'Submit enables once 1–4 cards are selected (or per configured rule) and locks on Submit.',
        answerKeySummary: 'A (Zero harm to people), B (Safe working environment), C (Environmental responsibility), D (Proactive risk prevention). Distractor: E (Higher production output).'
      },
      journeySteps: [
        'Quiz opens with 5 EHS commitment cards',
        'Learner selects up to 4 cards (5th locks at 4)',
        'Learner clicks Submit → cards lock',
        'Storyline evaluates Q003_Correct',
        'Storyline shows feedback layer',
        'Closing feedback sets Q003_Revealed = True'
      ],
      variables: [
        { name: 'Q003_Done', type: 'True/False', initial: 'False', purpose: 'Signals Storyline that Q003 was submitted.', updatedBy: 'HTML Bridge', readBy: 'Storyline Trigger', expectedResult: 'Triggers feedback layer.' },
        { name: 'Q003_Correct', type: 'True/False', initial: 'False', purpose: 'True when A, B, C, D are selected and E is not.', updatedBy: 'HTML Bridge', readBy: 'Storyline Trigger', expectedResult: 'Routes to Correct/Incorrect layer.' },
        { name: 'Q003_Answers', type: 'Text', initial: '"" (blank)', purpose: 'Stores selected card IDs.', updatedBy: 'HTML Bridge', readBy: 'Storyline / Resume', expectedResult: 'Restores selection on revisit.' },
        { name: 'Q003_Revealed', type: 'True/False', initial: 'False', purpose: 'Authorizes HTML review highlights.', updatedBy: 'Storyline Layer', readBy: 'HTML Bridge Poller', expectedResult: 'Shows correct/distractor badges only after feedback.' }
      ],
      feedbackLayers: [
        { layer: 'Correct Feedback Layer', trigger: 'When Q003_Done changes AND Q003_Correct == True', onClose: 'Set Q003_Revealed = True.' },
        { layer: 'Incorrect Feedback Layer', trigger: 'When Q003_Done changes AND Q003_Correct == False', onClose: 'Set Q003_Revealed = True.' }
      ],
      files: ['index.html', 'storyline-bridge.js', 'fonts.css', 'fonts/', 'assets/icons/*.svg', 'quiz.json'],
      testingStatus: {
        sourceInspected: 'PASS',
        browserHarness: 'PASS',
        storyline: 'NOT TESTED',
        review360: 'NOT TESTED',
        oracleLms: 'BLOCKED',
        revisit: 'PASS',
        resume: 'NOT TESTED',
        feedbackSync: 'PASS',
        animationReadiness: 'READY'
      },
      knownIssues: [
        { id: 'DICV-QA-008', status: 'Closed', summary: 'Removed premature 700ms auto-reveal fallback.' }
      ]
    },

    {
      id: 'Q004',
      group: 'Q004',
      title: 'EHS Focus Areas',
      interactionType: 'Drag & Drop (3-Zone Pinwheel)',
      category: 'dnd',
      shortDesc: 'Drag 3 correct focus areas into the Safety Strategy pinwheel (any zone order).',
      canvas: { width: 1536, height: 1024, responsive: true, ratio: '1536 × 1024 px (Auto-scales)' },
      distFolder: '../WebObjects/dist/Q004_EHSFocusAreas/',
      zipFile: '../WebObjects/dist/Q004_EHSFocusAreas.zip',
      srcFolder: '../WebObjects/quizzes/Q004_EHSFocusAreas/',
      previewUrl: '../WebObjects/dist/Q004_EHSFocusAreas/index.html',
      motionPreviewUrl: '../WebObjects/prototypes/motion/q004_motion.html',
      screenshotUrl: null,
      overview: {
        purpose: 'Identify the 3 pillars of DICV Safety Strategy and distinguish them from the distractor.',
        whatLearnerSees: 'A 3-color cyclic pinwheel (Dark Petrol, Petrol 80%, Daimler Yellow) with a central Safety Strategy hub and 4 draggable focus-area cards.',
        whatLearnerDoes: 'Drags (or clicks/uses keyboard to place) 3 cards into the 3 pinwheel drop zones. Dropping onto an occupied zone swaps cards atomically.',
        requiredCount: 'All 3 pinwheel zones must be filled to enable Submit. Order across the 3 zones does not matter.',
        submitRule: 'Submit activates when 3 of 3 zones are occupied. Correct if A, B, and C are placed and D is left in the pool.',
        answerKeySummary: 'Capability Management (A), Governance (B), Risk Management (C). Distractor: Employee Engagement (D).'
      },
      journeySteps: [
        'Pick up card from Focus Area Options pool',
        'Move to any of the 3 pinwheel drop zones (or swap)',
        'Release card into zone (invalid drop returns to pool)',
        'Submit activates when 3 zones are filled',
        'Storyline displays feedback layer',
        'After feedback closes, review highlights correct/missed cards'
      ],
      variables: [
        { name: 'Q004_Done', type: 'True/False', initial: 'False', purpose: 'Signals Storyline that Q004 was submitted.', updatedBy: 'HTML Bridge', readBy: 'Storyline Trigger', expectedResult: 'Triggers feedback layer.' },
        { name: 'Q004_Correct', type: 'True/False', initial: 'False', purpose: 'True if A, B, and C are placed in zones and D is unplaced.', updatedBy: 'HTML Bridge', readBy: 'Storyline Trigger', expectedResult: 'Routes to Correct/Incorrect layer.' },
        { name: 'Q004_Answers', type: 'Text', initial: '"" (blank)', purpose: 'Stores placement pairs (e.g., "A:zone-1;B:zone-2;C:zone-3").', updatedBy: 'HTML Bridge', readBy: 'Storyline / Resume', expectedResult: 'Rebuilds exact zone placements on revisit.' },
        { name: 'Q004_Revealed', type: 'True/False', initial: 'False', purpose: 'Authorizes HTML review highlights.', updatedBy: 'Storyline Layer', readBy: 'HTML Bridge Poller', expectedResult: 'Prevents premature answer reveal.' }
      ],
      feedbackLayers: [
        { layer: 'Correct Feedback Layer', trigger: 'When Q004_Done changes AND Q004_Correct == True', onClose: 'Set Q004_Revealed = True.' },
        { layer: 'Incorrect Feedback Layer', trigger: 'When Q004_Done changes AND Q004_Correct == False', onClose: 'Set Q004_Revealed = True.' }
      ],
      files: ['index.html', 'storyline-bridge.js', 'fonts.css', 'fonts/', 'assets/icons/*.svg', 'quiz.json'],
      testingStatus: {
        sourceInspected: 'PASS',
        browserHarness: 'PASS',
        storyline: 'NOT TESTED',
        review360: 'NOT TESTED',
        oracleLms: 'BLOCKED',
        revisit: 'PASS',
        resume: 'NOT TESTED',
        feedbackSync: 'PASS',
        animationReadiness: 'READY'
      },
      knownIssues: [
        { id: 'DICV-QA-007', status: 'Closed', summary: 'Fixed broken 2-argument bridge constructor, removed 700ms timer, and gated revisit reveal.' }
      ]
    },

    {
      id: 'Q005',
      group: 'Q005',
      title: 'Safety Culture Maturity',
      interactionType: 'Drag & Drop (Strict 4-Stage Order)',
      category: 'dnd',
      shortDesc: 'Arrange four maturity stages in exact order along the Bradley Injury Rate curve.',
      canvas: { width: 1110, height: 640, responsive: false, ratio: '1110 × 640 px' },
      distFolder: '../WebObjects/dist/Q005_SafetyCultureMaturity/',
      zipFile: '../WebObjects/dist/Q005_SafetyCultureMaturity.zip',
      srcFolder: '../WebObjects/quizzes/Q005_SafetyCultureMaturity/',
      previewUrl: '../WebObjects/dist/Q005_SafetyCultureMaturity/index.html',
      motionPreviewUrl: '../WebObjects/prototypes/motion/q005_motion.html',
      screenshotUrl: null,
      overview: {
        purpose: 'Teach the 4 progressive stages of the DuPont Bradley Curve as injury rates decline.',
        whatLearnerSees: 'A descending Injury Rate curve with 4 numbered drop targets (1–4) and 4 scrambled stage cards in the bottom tray.',
        whatLearnerDoes: 'Drags or click-places each stage card onto targets 1 through 4. Supports target-to-target swapping and returning cards to the tray.',
        requiredCount: 'All 4 targets must be filled to enable Submit. Strict 1→2→3→4 order is required for Correct.',
        submitRule: 'Submit activates when all 4 targets are occupied.',
        answerKeySummary: 'Stage 1: Reactive → Stage 2: Dependent → Stage 3: Independent → Stage 4: Interdependent.'
      },
      journeySteps: [
        'Quiz opens with 4 scrambled stage cards in dock',
        'Learner drags or clicks cards onto targets 1–4',
        'Occupied targets swap atomically without overlap',
        'Submit activates when all 4 targets are filled',
        'Storyline displays feedback layer',
        'Closing feedback reveals ✓ Correct / ✕ Incorrect + sequence banner'
      ],
      variables: [
        { name: 'Q005_Done', type: 'True/False', initial: 'False', purpose: 'Signals Storyline that Q005 was submitted.', updatedBy: 'HTML Bridge', readBy: 'Storyline Trigger', expectedResult: 'Triggers feedback layer.' },
        { name: 'Q005_Correct', type: 'True/False', initial: 'False', purpose: 'True only when all 4 stages match Reactive→Dependent→Independent→Interdependent.', updatedBy: 'HTML Bridge', readBy: 'Storyline Trigger', expectedResult: 'Routes to Correct/Incorrect layer.' },
        { name: 'Q005_Answers', type: 'Text', initial: '"" (blank)', purpose: 'JSON map of target IDs to stage names.', updatedBy: 'HTML Bridge', readBy: 'Storyline / Resume', expectedResult: 'Restores exact curve placements.' },
        { name: 'Q005_Revealed', type: 'True/False', initial: 'False', purpose: 'Authorizes HTML review badges & correct sequence banner.', updatedBy: 'Storyline Layer', readBy: 'HTML Bridge Poller', expectedResult: 'Badges display cleanly even after retries.' }
      ],
      feedbackLayers: [
        { layer: 'Correct Feedback Layer', trigger: 'When Q005_Done changes AND Q005_Correct == True', onClose: 'Set Q005_Revealed = True.' },
        { layer: 'Incorrect Feedback Layer', trigger: 'When Q005_Done changes AND Q005_Correct == False', onClose: 'Set Q005_Revealed = True.' }
      ],
      files: ['index.html', 'storyline-bridge.js', 'fonts.css', 'fonts/', 'assets/icons/*.svg', 'quiz.json'],
      testingStatus: {
        sourceInspected: 'PASS',
        browserHarness: 'PASS',
        storyline: 'NOT TESTED',
        review360: 'NOT TESTED',
        oracleLms: 'BLOCKED',
        revisit: 'PASS',
        resume: 'NOT TESTED',
        feedbackSync: 'PASS',
        animationReadiness: 'READY'
      },
      knownIssues: [
        { id: 'DICV-QA-004', status: 'Closed', summary: 'Fixed bridge.state access.' },
        { id: 'DICV-QA-008', status: 'Closed', summary: 'Fixed onResetAttempt callback, revisit card lock, and retry badge display.' }
      ]
    },

    {
      id: 'Q006_R1',
      group: 'Q006',
      title: 'Safety Review Structure — Round 1',
      interactionType: 'Single-Choice Scenario (Slide 1 of 3)',
      category: 'choice q006',
      shortDesc: 'Safety Issue 1 of 3: Organisation-wide Policy Review committee decision.',
      canvas: { width: 1024, height: 576, responsive: false, ratio: '1024 × 576 px (16:9)' },
      distFolder: '../WebObjects/dist/Q006_R1/',
      zipFile: '../WebObjects/dist/Q006_R1.zip',
      srcFolder: '../WebObjects/quizzes/Q006_SafetyReviewStructure/R1_PolicyReview/',
      previewUrl: '../WebObjects/dist/Q006_R1/index.html',
      motionPreviewUrl: '../WebObjects/prototypes/motion/q006_motion.html',
      screenshotUrl: null,
      overview: {
        purpose: 'Identify which safety governance body handles organisation-wide policy updates.',
        whatLearnerSees: 'Top round badge ("Safety Issue 1 of 3"), 3-step tracker, scenario illustration & description, and 3 committee radio cards.',
        whatLearnerDoes: 'Selects one of the 3 committee cards and clicks Submit.',
        requiredCount: '1 selection required.',
        submitRule: 'Submit enables upon selecting any committee card.',
        answerKeySummary: 'Apex Committee.'
      },
      journeySteps: [
        'Slide 1 of 3 opens with step 1 highlighted',
        'Learner reads scenario & selects 1 committee card',
        'Submit activates and locks selection',
        'Storyline reads Q006_R1_Done & Q006_R1_Correct',
        'Storyline feedback layer displays',
        'Q006_R1_Revealed = True shows review badges'
      ],
      variables: [
        { name: 'Q006_R1_Done', type: 'True/False', initial: 'False', purpose: 'Signals Storyline that Round 1 was submitted.', updatedBy: 'HTML Bridge', readBy: 'Storyline Trigger', expectedResult: 'Triggers Round 1 feedback.' },
        { name: 'Q006_R1_Correct', type: 'True/False', initial: 'False', purpose: 'True when Apex Committee is chosen.', updatedBy: 'HTML Bridge', readBy: 'Storyline Trigger', expectedResult: 'Routes to Correct/Incorrect layer.' },
        { name: 'Q006_R1_Answer', type: 'Text', initial: '"" (blank)', purpose: 'Note singular name: stores chosen committee label (e.g., "Apex Committee").', updatedBy: 'HTML Bridge', readBy: 'Storyline / Resume', expectedResult: 'Restores selected card via label-to-ID matching.' },
        { name: 'Q006_R1_Revealed', type: 'True/False', initial: 'False', purpose: 'Authorizes review badges on Round 1.', updatedBy: 'Storyline Layer', readBy: 'HTML Bridge Poller', expectedResult: 'Shows ✓ Correct / ✕ Incorrect.' }
      ],
      feedbackLayers: [
        { layer: 'Correct Feedback Layer', trigger: 'When Q006_R1_Done changes AND Q006_R1_Correct == True', onClose: 'Set Q006_R1_Revealed = True.' },
        { layer: 'Incorrect Feedback Layer', trigger: 'When Q006_R1_Done changes AND Q006_R1_Correct == False', onClose: 'Set Q006_R1_Revealed = True.' }
      ],
      files: ['index.html', 'committee-quiz.js', 'committee-quiz.css', 'committee-data.js', 'storyline-bridge.js', 'fonts.css', 'fonts/', 'assets/', 'quiz.json'],
      testingStatus: {
        sourceInspected: 'PASS',
        browserHarness: 'PASS',
        storyline: 'NOT TESTED',
        review360: 'NOT TESTED',
        oracleLms: 'BLOCKED',
        revisit: 'PASS',
        resume: 'NOT TESTED',
        feedbackSync: 'PASS',
        animationReadiness: 'READY'
      },
      knownIssues: [
        { id: 'DICV-QA-008', status: 'Closed', summary: 'Fixed singular Answer mapping, label-to-ID revisit restore, and retry badge display.' }
      ]
    },

    {
      id: 'Q006_R2',
      group: 'Q006',
      title: 'Safety Review Structure — Round 2',
      interactionType: 'Single-Choice Scenario (Slide 2 of 3)',
      category: 'choice q006',
      shortDesc: 'Safety Issue 2 of 3: Critical Safety Performance Issue committee decision.',
      canvas: { width: 1024, height: 576, responsive: false, ratio: '1024 × 576 px (16:9)' },
      distFolder: '../WebObjects/dist/Q006_R2/',
      zipFile: '../WebObjects/dist/Q006_R2.zip',
      srcFolder: '../WebObjects/quizzes/Q006_SafetyReviewStructure/R2_PerformanceIssue/',
      previewUrl: '../WebObjects/dist/Q006_R2/index.html',
      motionPreviewUrl: '../WebObjects/prototypes/motion/q006_motion.html',
      screenshotUrl: null,
      overview: {
        purpose: 'Identify which committee resolves critical, long-pending production safety performance issues.',
        whatLearnerSees: 'Top round badge ("Safety Issue 2 of 3"), 3-step tracker (Step 1 checked, Step 2 active), scenario & 3 committee cards.',
        whatLearnerDoes: 'Selects one committee card and clicks Submit.',
        requiredCount: '1 selection required.',
        submitRule: 'Submit enables upon selecting any card.',
        answerKeySummary: 'Sub Committee.'
      },
      journeySteps: [
        'Slide 2 of 3 opens with step 2 active',
        'Learner reads scenario & selects 1 committee card',
        'Submit activates and locks selection',
        'Storyline reads Q006_R2_Done & Q006_R2_Correct',
        'Storyline feedback layer displays',
        'Q006_R2_Revealed = True shows review badges'
      ],
      variables: [
        { name: 'Q006_R2_Done', type: 'True/False', initial: 'False', purpose: 'Signals Storyline that Round 2 was submitted.', updatedBy: 'HTML Bridge', readBy: 'Storyline Trigger', expectedResult: 'Triggers Round 2 feedback.' },
        { name: 'Q006_R2_Correct', type: 'True/False', initial: 'False', purpose: 'True when Sub Committee is chosen.', updatedBy: 'HTML Bridge', readBy: 'Storyline Trigger', expectedResult: 'Routes to Correct/Incorrect layer.' },
        { name: 'Q006_R2_Answer', type: 'Text', initial: '"" (blank)', purpose: 'Note singular name: stores chosen committee label.', updatedBy: 'HTML Bridge', readBy: 'Storyline / Resume', expectedResult: 'Restores selected card on revisit.' },
        { name: 'Q006_R2_Revealed', type: 'True/False', initial: 'False', purpose: 'Authorizes review badges on Round 2.', updatedBy: 'Storyline Layer', readBy: 'HTML Bridge Poller', expectedResult: 'Shows ✓ Correct / ✕ Incorrect.' }
      ],
      feedbackLayers: [
        { layer: 'Correct Feedback Layer', trigger: 'When Q006_R2_Done changes AND Q006_R2_Correct == True', onClose: 'Set Q006_R2_Revealed = True.' },
        { layer: 'Incorrect Feedback Layer', trigger: 'When Q006_R2_Done changes AND Q006_R2_Correct == False', onClose: 'Set Q006_R2_Revealed = True.' }
      ],
      files: ['index.html', 'committee-quiz.js', 'committee-quiz.css', 'committee-data.js', 'storyline-bridge.js', 'fonts.css', 'fonts/', 'assets/', 'quiz.json'],
      testingStatus: {
        sourceInspected: 'PASS',
        browserHarness: 'PASS',
        storyline: 'NOT TESTED',
        review360: 'NOT TESTED',
        oracleLms: 'BLOCKED',
        revisit: 'PASS',
        resume: 'NOT TESTED',
        feedbackSync: 'PASS',
        animationReadiness: 'READY'
      },
      knownIssues: [
        { id: 'DICV-QA-008', status: 'Closed', summary: 'Shares committee-quiz.js fixes with R1 and R3.' }
      ]
    },

    {
      id: 'Q006_R3',
      group: 'Q006',
      title: 'Safety Review Structure — Round 3',
      interactionType: 'Single-Choice Scenario (Slide 3 of 3)',
      category: 'choice q006',
      shortDesc: 'Safety Issue 3 of 3: Machine-Guarding Improvement initiative decision.',
      canvas: { width: 1024, height: 576, responsive: false, ratio: '1024 × 576 px (16:9)' },
      distFolder: '../WebObjects/dist/Q006_R3/',
      zipFile: '../WebObjects/dist/Q006_R3.zip',
      srcFolder: '../WebObjects/quizzes/Q006_SafetyReviewStructure/R3_MachineGuarding/',
      previewUrl: '../WebObjects/dist/Q006_R3/index.html',
      motionPreviewUrl: '../WebObjects/prototypes/motion/q006_motion.html',
      screenshotUrl: null,
      overview: {
        purpose: 'Identify which committee drives focused safety initiatives such as machine-guarding upgrades.',
        whatLearnerSees: 'Top round badge ("Safety Issue 3 of 3"), 3-step tracker (Steps 1–2 checked, Step 3 active), scenario & 3 committee cards.',
        whatLearnerDoes: 'Selects one committee card and clicks Submit.',
        requiredCount: '1 selection required.',
        submitRule: 'Submit enables upon selecting any card.',
        answerKeySummary: 'Ad-hoc Committee – Initiatives.'
      },
      journeySteps: [
        'Slide 3 of 3 opens with step 3 active',
        'Learner reads scenario & selects 1 committee card',
        'Submit activates and locks selection',
        'Storyline reads Q006_R3_Done & Q006_R3_Correct',
        'Storyline feedback layer displays',
        'Q006_R3_Revealed = True shows review badges'
      ],
      variables: [
        { name: 'Q006_R3_Done', type: 'True/False', initial: 'False', purpose: 'Signals Storyline that Round 3 was submitted.', updatedBy: 'HTML Bridge', readBy: 'Storyline Trigger', expectedResult: 'Triggers Round 3 feedback.' },
        { name: 'Q006_R3_Correct', type: 'True/False', initial: 'False', purpose: 'True when Ad-hoc Committee – Initiatives is chosen.', updatedBy: 'HTML Bridge', readBy: 'Storyline Trigger', expectedResult: 'Routes to Correct/Incorrect layer.' },
        { name: 'Q006_R3_Answer', type: 'Text', initial: '"" (blank)', purpose: 'Note singular name: stores chosen committee label.', updatedBy: 'HTML Bridge', readBy: 'Storyline / Resume', expectedResult: 'Restores selected card on revisit.' },
        { name: 'Q006_R3_Revealed', type: 'True/False', initial: 'False', purpose: 'Authorizes review badges on Round 3.', updatedBy: 'Storyline Layer', readBy: 'HTML Bridge Poller', expectedResult: 'Shows ✓ Correct / ✕ Incorrect.' }
      ],
      feedbackLayers: [
        { layer: 'Correct Feedback Layer', trigger: 'When Q006_R3_Done changes AND Q006_R3_Correct == True', onClose: 'Set Q006_R3_Revealed = True.' },
        { layer: 'Incorrect Feedback Layer', trigger: 'When Q006_R3_Done changes AND Q006_R3_Correct == False', onClose: 'Set Q006_R3_Revealed = True.' }
      ],
      files: ['index.html', 'committee-quiz.js', 'committee-quiz.css', 'committee-data.js', 'storyline-bridge.js', 'fonts.css', 'fonts/', 'assets/', 'quiz.json'],
      testingStatus: {
        sourceInspected: 'PASS',
        browserHarness: 'PASS',
        storyline: 'NOT TESTED',
        review360: 'NOT TESTED',
        oracleLms: 'BLOCKED',
        revisit: 'PASS',
        resume: 'NOT TESTED',
        feedbackSync: 'PASS',
        animationReadiness: 'READY'
      },
      knownIssues: [
        { id: 'DICV-QA-008', status: 'Closed', summary: 'Shares committee-quiz.js fixes with R1 and R2.' }
      ]
    }
  ],

  animations: [
    { id: 'entrance', name: 'Sequential Entrance', usedIn: 'Q001–Q006', trigger: 'Slide / Web Object load', duration: '350–550 ms per step (100–250 ms stagger)', storylineDep: 'None', perf: 'GPU transform + opacity only', status: 'Proposed (Prototype Ready)', demoClass: 'demo-entrance' },
    { id: 'hover', name: 'Card Hover Elevation', usedIn: 'Q001–Q006', trigger: 'Pointer hover / keyboard focus', duration: '180 ms', storylineDep: 'None', perf: 'Subtle lift & border highlight', status: 'Existing + Refined in Prototype', demoClass: 'demo-hover' },
    { id: 'select', name: 'Card Selection', usedIn: 'Q001, Q002, Q003, Q006', trigger: 'Click / Space / Enter', duration: '200 ms', storylineDep: 'None', perf: 'Scale 0.985 → 1 + Petrol border', status: 'Existing + Refined in Prototype', demoClass: 'demo-select' },
    { id: 'submit-active', name: 'Submit Activation', usedIn: 'Q001–Q006', trigger: 'Required selections met', duration: '240 ms', storylineDep: 'None', perf: 'Opacity + subtle glow transition', status: 'Proposed (Prototype Ready)', demoClass: 'demo-submit' },
    { id: 'drag-pickup', name: 'Drag Pickup', usedIn: 'Q004, Q005', trigger: 'Pointer down / drag start', duration: '160 ms', storylineDep: 'None', perf: 'Scale ~1.02 + deeper shadow', status: 'Proposed (Prototype Ready)', demoClass: 'demo-pickup' },
    { id: 'invalid-return', name: 'Invalid-Drop Auto-Return', usedIn: 'Q004, Q005', trigger: 'Drop outside valid target', duration: '320–420 ms', storylineDep: 'None', perf: 'Eased return without failure penalty', status: 'Proposed (Prototype Ready)', demoClass: 'demo-return' },
    { id: 'valid-snap', name: 'Successful-Drop Snap', usedIn: 'Q004, Q005', trigger: 'Drop inside valid target', duration: '240–320 ms', storylineDep: 'None', perf: 'Target border pulse + settle', status: 'Proposed (Prototype Ready)', demoClass: 'demo-snap' },
    { id: 'atomic-swap', name: 'Atomic Swap', usedIn: 'Q004, Q005', trigger: 'Drop on occupied target', duration: '280 ms', storylineDep: 'None', perf: 'FLIP position transition, zero flicker', status: 'Proposed (Prototype Ready)', demoClass: 'demo-swap' },
    { id: 'progress', name: 'Progress Transition', usedIn: 'Q004, Q005, Q006', trigger: 'Placement count / round change', duration: '250 ms', storylineDep: 'None', perf: 'Smooth step/counter fill', status: 'Existing + Refined in Prototype', demoClass: 'demo-progress' },
    { id: 'reveal', name: 'Correct-Answer Reveal', usedIn: 'Q001–Q006', trigger: 'Storyline sets *_Revealed = True', duration: '300–450 ms', storylineDep: 'Strictly waits for Storyline feedback completion', perf: 'Controlled highlight + badge fade-in', status: 'Proposed (Prototype Ready)', demoClass: 'demo-reveal' }
  ],

  troubleshooting: [
    {
      symptom: 'Quiz does not load (blank frame)',
      notice: 'The Storyline slide shows an empty box where the quiz should appear.',
      causes: ['Imported source folder instead of WebObjects/dist/<id>/', 'Previewing local files via file:// with blocked relative assets'],
      checkFirst: 'Verify the Web Object points to WebObjects/dist/<QuizFolder>/ containing index.html.',
      steps: ['Re-insert Web Object from WebObjects/dist/<QuizFolder>/', 'Test in Publish → Web or Review 360 rather than Desktop Preview.'],
      devNeeded: 'Only if index.html is missing from dist/.',
      issues: ['DICV-QA-001']
    },
    {
      symptom: 'Images are missing',
      notice: 'Broken image icons appear on cards or scenario illustrations.',
      causes: ['Only index.html was copied instead of the full dist/<id>/ folder with assets/'],
      checkFirst: 'Confirm assets/ folder exists beside index.html inside dist/<id>/ (except Q001 which embeds Base64).',
      steps: ['Re-import the complete folder from WebObjects/dist/<id>/ or extract the matching .zip package.'],
      devNeeded: 'If an icon file is missing from assets/.',
      issues: []
    },
    {
      symptom: 'Submit is disabled',
      notice: 'Clicking Submit has no effect and the button stays faded.',
      causes: ['Minimum selection or required drop-zone count not reached (e.g., Q004 needs 3 zones, Q005 needs all 4 stages).'],
      checkFirst: 'Count how many cards are selected or placed.',
      steps: ['Q001/Q002/Q003/Q006: select at least 1 card.', 'Q004: fill all 3 pinwheel zones.', 'Q005: fill all 4 curve targets.'],
      devNeeded: 'Only if Submit stays disabled when requirements are met.',
      issues: []
    },
    {
      symptom: 'Submit does nothing in Storyline',
      notice: 'Clicking Submit locks the quiz, but Storyline never advances or opens feedback.',
      causes: ['Testing in Storyline Desktop Preview (F12), which blocks GetPlayer()', 'Variable name typo or wrong case in Storyline'],
      checkFirst: 'Confirm you are testing in Publish → Web / Review 360 / LMS, not Desktop Preview.',
      steps: ['Check variable spelling (Q006 uses _Answer singular; Q001–Q005 use _Answers plural).', 'Verify trigger listens to "When variable changes: <ID>_Done".'],
      devNeeded: 'If published output still fails to update variables.',
      issues: ['DICV-QA-002', 'DICV-QA-007']
    },
    {
      symptom: 'Feedback layer does not appear',
      notice: 'Variables update, but neither Correct nor Incorrect layer opens.',
      causes: ['Trigger condition checks Wrong variable or missing Else/Incorrect branch.'],
      checkFirst: 'Inspect Storyline slide triggers on <ID>_Done.',
      steps: ['Add two triggers on <ID>_Done change: one for <ID>_Correct == True, one for <ID>_Correct == False.'],
      devNeeded: 'No — Storyline trigger configuration.',
      issues: ['DICV-QA-002']
    },
    {
      symptom: 'Wrong feedback appears',
      notice: 'Correct answer shows Incorrect layer (or vice versa).',
      causes: ['Trigger condition inverted in Storyline', 'Incomplete selection (e.g., Q002 requires all 5 cards)'],
      checkFirst: 'Compare learner selection against the Quiz Answer Key in this Hub.',
      steps: ['Verify Storyline trigger checks <ID>_Correct == True for the Correct layer.'],
      devNeeded: 'Only if the HTML answer key evaluation is wrong.',
      issues: ['DICV-QA-002']
    },
    {
      symptom: 'Correct answer appears too early',
      notice: 'Green/red review highlights appear immediately on Submit before feedback closes.',
      causes: ['Storyline sets <ID>_Revealed = True at slide start or Submit instead of on feedback layer close.'],
      checkFirst: 'Check initial value of <ID>_Revealed in Storyline Variables panel.',
      steps: ['Ensure <ID>_Revealed defaults to False and is only set to True when the learner closes the feedback layer.'],
      devNeeded: 'Fixed in HTML (700ms timers removed under DICV-QA-008).',
      issues: ['DICV-QA-008']
    },
    {
      symptom: 'Quiz resets on revisit',
      notice: 'Returning to a completed slide lets the learner submit again.',
      causes: ['Storyline slide revisit setting is "Reset to initial state" instead of "Resume saved state".'],
      checkFirst: 'Check Storyline Slide Properties → When revisiting.',
      steps: ['Set Slide Properties to "Resume saved state" so <ID>_Done remains True on revisit.'],
      devNeeded: 'If <ID>_Done is True but cards still unlock.',
      issues: ['DICV-QA-007', 'DICV-QA-008']
    },
    {
      symptom: 'Quiz appears stretched or clipped',
      notice: 'Cards look squished or scrollbars cut off the Submit button.',
      causes: ['Storyline Web Object container dimensions do not match the quiz aspect ratio.'],
      checkFirst: 'Check the Canvas Size listed on the quiz card in this Hub.',
      steps: ['Resize the Storyline Web Object frame to match the quiz aspect ratio (Q004 auto-scales from 1536×1024).'],
      devNeeded: 'Only if clipping persists at exact dimensions.',
      issues: ['DICV-QA-001']
    },
    {
      symptom: 'Dragging does not work (Q004 / Q005)',
      notice: 'Cards cannot be dragged into targets.',
      causes: ['Quiz is already in SUBMITTED/REVEALED locked state', 'Touch/mouse browser drag quirk'],
      checkFirst: 'Verify the quiz has not already been submitted.',
      steps: ['Use click-to-select + click-target or keyboard (Tab + Enter/Space) as accessible fallback.'],
      devNeeded: 'If dragging fails in READY state on supported browsers.',
      issues: []
    },
    {
      symptom: 'Animation freezes or feels abrupt',
      notice: 'Entrance or transitions skip or pause.',
      causes: ['OS/browser "Reduce motion" setting enabled', 'Prototype ?no_anim=1 flag active'],
      checkFirst: 'Check system accessibility motion settings.',
      steps: ['Motion prototypes intentionally respect prefers-reduced-motion. Production rollout is pending approval.'],
      devNeeded: 'If animations freeze with reduced-motion disabled.',
      issues: []
    },
    {
      symptom: 'Progress indicator is incorrect',
      notice: 'Counter or Q006 step badge shows wrong state.',
      causes: ['Wrong Q006 round package imported onto slide (e.g., R1 imported onto Slide 2).'],
      checkFirst: 'Verify Q006_R1, Q006_R2, Q006_R3 are mapped to Slides 1, 2, 3 respectively.',
      steps: ['Re-import the matching dist/Q006_R* folder.'],
      devNeeded: 'If step count is wrong inside the correct package.',
      issues: []
    },
    {
      symptom: 'LMS does not remember completion',
      notice: 'Relaunching the course in Oracle LMS restarts quizzes from scratch.',
      causes: ['Storyline LMS suspend/resume setting disabled', 'SCORM string "false" bug (fixed in bridge v2.9.1; rebuild/re-import dist/)'],
      checkFirst: 'Confirm Storyline Player → Resume is set to "Prompt to resume" or "Always resume", and dist/ was rebuilt after 2026-11-14.',
      steps: ['Re-import updated dist/ packages, publish SCORM, and test resume in Oracle LMS staging.'],
      devNeeded: 'If updated dist/ still fails Oracle LMS resume testing.',
      issues: ['DICV-QA-006']
    }
  ],

  docs: [
    { title: 'Storyline Technical Review & Fix Report', path: '../WebObjects/docs/STORYLINE_TECHNICAL_REVIEW_AND_FIX_REPORT.md', audience: 'QA & Developers', summary: 'Full technical audit of Q001–Q006, verified P0/P1 fixes, test matrix, and Oracle LMS staging plan.' },
    { title: 'Storyline Integration Runbook', path: '../WebObjects/docs/STORYLINE_INTEGRATION.md', audience: 'Storyline Authors', summary: 'Mode A/B trigger setup, variable contracts, and Desktop Preview warning.' },
    { title: 'Cinematic Animation & Motion System', path: '../WebObjects/docs/CINEMATIC_ANIMATION_MOTION_SYSTEM.md', audience: 'Reviewers & Designers', summary: 'Sequential entrance timings, DND pickup/swap/return motion specs, and review reveal rules.' },
    { title: 'Master QA Checklist', path: '../WebObjects/docs/MASTER_QA_CHECKLIST.md', audience: 'QA Personnel', summary: 'Pre-release checklist covering design tokens, self-contained builds, bridge behavior, and LMS staging.' },
    { title: 'Known Issues Log', path: '../WebObjects/docs/KNOWN_ISSUES.md', audience: 'QA & Developers', summary: 'Historical record DICV-QA-001 through DICV-QA-008 and how each was resolved.' },
    { title: 'Design System & Brand Compliance', path: '../WebObjects/docs/DESIGN_SYSTEM.md', audience: 'Designers', summary: 'Daimler Truck corporate palette (#004355, #00677F, #FFFF40) and Daimler CS typography rules.' },
    { title: 'Modern Comic-Game UI Audit', path: '../WebObjects/docs/MODERN_COMIC_GAME_UI_AUDIT.md', audience: 'Designers', summary: '50% Modern Minimal + 30% Game Interaction + 20% Comic Storytelling visual direction.' },
    { title: 'Changelog', path: '../WebObjects/docs/CHANGELOG.md', audience: 'All', summary: 'Version history through v2.9.1 (technical hardening & dist rebuild).' }
  ]
};
