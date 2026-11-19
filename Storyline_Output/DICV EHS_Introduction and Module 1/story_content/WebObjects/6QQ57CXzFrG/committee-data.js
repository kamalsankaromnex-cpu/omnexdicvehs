/**
 * committee-data.js — DICV Safety Review Structure Scenario Definitions
 * Quizzes: Q006_R1, Q006_R2, Q006_R3
 */
window.DICV_COMMITTEE_DATA = {
  R1: {
    quizId: 'Q006_R1',
    roundIndex: 3,
    totalRounds: 3,
    issueTitle: 'Safety Issue 3 of 3',
    scenarioName: 'Organisation-wide Policy Review',
    scenarioText: 'An organisation-wide safety policy requires review and update based on recent analysis.',
    questionText: 'Which committee should review this issue?',
    illustration: 'assets/issue-image/r1-policy-review.png',
    options: [
      { id: 'apex', label: 'Apex\nCommittee', icon: 'assets/icons/apex-committee.png' },
      { id: 'sub', label: 'Sub\nCommittee', icon: 'assets/icons/sub-committee.png' },
      { id: 'adhoc', label: 'Ad-hoc\nCommittee –\nInitiatives', icon: 'assets/icons/adhoc-committee.png' }
    ],
    // Provisional answer key: Organization-wide policies are reviewed by Apex Committee
    correctAnswerId: 'apex',
    feedback: {
      correctHeading: 'Exactly!',
      correctBody: 'The Apex Committee reviews organisation-wide safety policies and strategic decisions.',
      incorrectHeading: 'Not quite!',
      incorrectBody: 'The correct answer is the Apex Committee, which oversees organisation-wide safety policies.'
    },
    storylineVariables: {
      submitted: 'Q006_R1_Done',
      answer: 'Q006_R1_Answer',
      correct: 'Q006_R1_Correct',
      revealed: 'Q006_R1_Revealed',
      continueVar: 'Q006_R1_Continue'
    }
  },
  R2: {
    quizId: 'Q006_R2',
    roundIndex: 1,
    totalRounds: 3,
    issueTitle: 'Safety Issue 1 of 3',
    scenarioName: 'Critical Safety Performance Issue',
    scenarioText: 'A production area has a critical, long-pending safety performance issue that needs a conclusive decision.',
    questionText: 'Which committee should review this issue?',
    illustration: 'assets/issue-image/r2-performance-issue.png',
    options: [
      { id: 'apex', label: 'Apex\nCommittee', icon: 'assets/icons/apex-committee.png' },
      { id: 'sub', label: 'Sub\nCommittee', icon: 'assets/icons/sub-committee.png' },
      { id: 'adhoc', label: 'Ad-hoc\nCommittee –\nInitiatives', icon: 'assets/icons/adhoc-committee.png' }
    ],
    // Provisional answer key: Critical long-pending area performance issue handled by Sub Committee
    correctAnswerId: 'sub',
    feedback: {
      correctHeading: "That's right!",
      correctBody: 'The Sub Committee addresses critical, long-pending safety issues within specific areas.',
      incorrectHeading: 'Not quite!',
      incorrectBody: 'The correct answer is the Sub Committee, which handles such area-specific safety issues.'
    },
    storylineVariables: {
      submitted: 'Q006_R2_Done',
      answer: 'Q006_R2_Answer',
      correct: 'Q006_R2_Correct',
      revealed: 'Q006_R2_Revealed',
      continueVar: 'Q006_R2_Continue'
    }
  },
  R3: {
    quizId: 'Q006_R3',
    roundIndex: 2,
    totalRounds: 3,
    issueTitle: 'Safety Issue 2 of 3',
    scenarioName: 'Machine-Guarding Improvement',
    scenarioText: 'A machine-guarding improvement needs to be implemented across relevant areas for consistent application.',
    questionText: 'Which committee should review this issue?',
    illustration: 'assets/issue-image/r3-machine-guarding.png',
    options: [
      { id: 'apex', label: 'Apex\nCommittee', icon: 'assets/icons/apex-committee.png' },
      { id: 'sub', label: 'Sub\nCommittee', icon: 'assets/icons/sub-committee.png' },
      { id: 'adhoc', label: 'Ad-hoc\nCommittee –\nInitiatives', icon: 'assets/icons/adhoc-committee.png' }
    ],
    // Provisional answer key: Cross-area improvements / taskforce projects handled by Ad-hoc Committee – Initiatives
    correctAnswerId: 'adhoc',
    feedback: {
      correctHeading: 'Correct!',
      correctBody: 'The Ad-hoc Committee drives safety initiatives and ensures consistent implementation across relevant areas.',
      incorrectHeading: 'Not quite!',
      incorrectBody: 'The correct answer is the Ad-hoc Committee – Initiatives, which coordinates the implementation of safety improvements.'
    },
    storylineVariables: {
      submitted: 'Q006_R3_Done',
      answer: 'Q006_R3_Answer',
      correct: 'Q006_R3_Correct',
      revealed: 'Q006_R3_Revealed',
      continueVar: 'Q006_R3_Continue'
    }
  }
};
