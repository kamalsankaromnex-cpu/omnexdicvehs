/**
 * coursemap-data.js — Option B Six-Topic Module 1 Configuration
 * Preserves the exact 1-22 Storyline slide order and Phase B1 Mission IDs (101, 102)
 * so existing saved CourseProgressData migrates without losing completed states.
 */
(function (root) {
  'use strict';

  var MODULE_1_PREREQS = [103, 102, 104, 105, 106];

  var COURSE_MAP_CONFIG = {
    version: 2,
    pilotMode: true,
    modules: [
      {
        id: 1,
        title: 'DICV Safety Culture & Vision Zero',
        color: '#00677F',
        prereqs: [],
        topics: [
          {
            missionId: 103,
            title: "DICV's Commitment to a Safer Workplace",
            prereqs: [],
            unlockRule: 'complete',
            multiSlide: true,
            storylineSlideRef: 'Slide 10: DICV Commitment to a Safer Workplace (Slides 10–11, Q002)'
          },
          {
            missionId: 102,
            title: 'EHS Vision',
            prereqs: [103],
            unlockRule: 'complete',
            multiSlide: true,
            storylineSlideRef: 'Slide 12: EHS Vision – Interactive Question (Slides 12–13, Q003)'
          },
          {
            missionId: 104,
            title: 'Safety Strategy',
            prereqs: [102],
            unlockRule: 'complete',
            multiSlide: true,
            storylineSlideRef: 'Slide 14: Safety Strategy – Drag and Drop (Slides 14–15, Q004)'
          },
          {
            missionId: 105,
            title: 'Safety Culture',
            prereqs: [104],
            unlockRule: 'complete',
            multiSlide: true,
            storylineSlideRef: 'Slide 16: Safety Culture – Drag and Drop (Slides 16–17, Q005)'
          },
          {
            missionId: 106,
            title: 'Safety Review Structure',
            prereqs: [105],
            unlockRule: 'complete',
            multiSlide: true,
            storylineSlideRef: 'Slide 18: Safety Review Structure – Question 1 (Slides 18–21, Q006 R1–R3)'
          }
        ]
      },
      {
        id: 2,
        title: 'Incident Management',
        color: '#007A93',
        prereqs: MODULE_1_PREREQS,
        topics: []
      },
      {
        id: 3,
        title: 'Hazard Identification, Risk Assessment & Controls',
        color: '#005B70',
        prereqs: MODULE_1_PREREQS,
        topics: []
      },
      {
        id: 4,
        title: 'Ergonomics',
        color: '#008248',
        prereqs: MODULE_1_PREREQS,
        topics: []
      },
      {
        id: 5,
        title: 'Chemical & Dangerous Goods Safety',
        color: '#D97706',
        prereqs: MODULE_1_PREREQS,
        topics: []
      },
      {
        id: 6,
        title: 'Shopfloor Safety Etiquettes and Golden Safety Rules',
        color: '#004355',
        prereqs: MODULE_1_PREREQS,
        topics: []
      }
    ]
  };

  root.DICV_COURSE_MAP_CONFIG = COURSE_MAP_CONFIG;
})(typeof window !== 'undefined' ? window : globalThis);
