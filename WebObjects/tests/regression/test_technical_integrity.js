const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '../..');
const BRIDGE_PATH = path.join(ROOT, 'shared/storyline/storyline-bridge.js');
const BRIDGE_CODE = fs.readFileSync(BRIDGE_PATH, 'utf8');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`FAIL: ${name}\n  ${err && err.stack ? err.stack : err}`);
    failed++;
  }
}

function createBridgeSandbox(initialVars = {}, isIframe = true) {
  const vars = { ...initialVars };
  const postedMessages = [];
  const listeners = {};
  const timers = new Map();
  let nextTimerId = 1;

  const mockPlayer = {
    GetVar: (k) => (Object.prototype.hasOwnProperty.call(vars, k) ? vars[k] : undefined),
    SetVar: (k, v) => {
      vars[k] = v;
    }
  };

  const parentObj = {
    GetPlayer: () => mockPlayer,
    postMessage: (msg, origin) => {
      postedMessages.push({ msg, origin });
    }
  };

  const windowObj = {
    location: { origin: 'null', search: '' },
    addEventListener: (ev, cb) => {
      listeners[ev] = listeners[ev] || [];
      listeners[ev].push(cb);
    },
    removeEventListener: (ev, cb) => {
      if (!listeners[ev]) return;
      listeners[ev] = listeners[ev].filter((fn) => fn !== cb);
    },
    setInterval: (fn, ms) => {
      const id = nextTimerId++;
      timers.set(id, { fn, ms });
      return id;
    },
    clearInterval: (id) => {
      timers.delete(id);
    }
  };

  windowObj.parent = isIframe ? parentObj : windowObj;
  if (!isIframe) {
    windowObj.GetPlayer = () => mockPlayer;
  }

  const sandbox = {
    window: windowObj,
    parent: windowObj.parent,
    console,
    setInterval: windowObj.setInterval,
    clearInterval: windowObj.clearInterval,
    setTimeout: (fn) => { fn(); return 0; },
    clearTimeout: () => {},
    Date,
    Math,
    JSON,
    Boolean,
    String
  };
  sandbox.self = sandbox;
  sandbox.globalThis = sandbox;
  windowObj.self = windowObj;

  vm.createContext(sandbox);
  vm.runInContext(BRIDGE_CODE, sandbox);

  const BridgeCtor = sandbox.DICVStorylineBridge || sandbox.window.DICVStorylineBridge;

  return {
    Bridge: BridgeCtor,
    vars,
    postedMessages,
    listeners,
    timers,
    parentObj,
    dispatchMessage: (data, sourceOverride) => {
      const cbs = listeners.message || [];
      cbs.forEach((cb) => cb({
        data,
        origin: 'null',
        source: sourceOverride === undefined ? parentObj : sourceOverride
      }));
    }
  };
}

console.log('=== DICV Interactive Technical Integrity Suite ===\n');

// 1. Bridge Boolean("false") SCORM resume bug
test('StorylineBridge parses string "false" and "true" safely on SCORM resume', () => {
  const env = createBridgeSandbox({
    Q001_Done: 'false',
    Q001_Answers: '',
    Q001_Correct: 'false',
    Q001_Revealed: 'false'
  });

  const bridge = new env.Bridge({ quizId: 'Q001', autoPoll: false });
  assert.strictEqual(bridge.state.submitted, false, 'Q001_Done="false" must yield false');
  assert.strictEqual(bridge.state.isCorrect, false, 'Q001_Correct="false" must yield false');
  assert.strictEqual(bridge.state.revealed, false, 'Q001_Revealed="false" must yield false');

  env.vars.Q001_Done = 'true';
  env.vars.Q001_Correct = '1';
  env.vars.Q001_Revealed = true;
  bridge.syncFromDirectPlayer();
  assert.strictEqual(bridge.state.submitted, true);
  assert.strictEqual(bridge.state.isCorrect, true);
  assert.strictEqual(bridge.state.revealed, true);
});

// 2. Bridge Q006 singular `answer` variable mapping
test('StorylineBridge supports singular `answer` mapping for Q006_R1/R2/R3', () => {
  const env = createBridgeSandbox({
    Q006_R1_Done: true,
    Q006_R1_Answer: 'Apex Committee',
    Q006_R1_Correct: true,
    Q006_R1_Revealed: false
  });

  const bridge = new env.Bridge({
    quizId: 'Q006_R1',
    autoPoll: false,
    storylineVariables: {
      submitted: 'Q006_R1_Done',
      answer: 'Q006_R1_Answer',
      correct: 'Q006_R1_Correct',
      revealed: 'Q006_R1_Revealed'
    }
  });

  assert.strictEqual(bridge.state.submittedSelection, 'Apex Committee');

  // Calling submit while already submitted should be ignored
  bridge.submit('Sub-Committee', false);
  assert.strictEqual(env.vars.Q006_R1_Answer, 'Apex Committee');

  // After reset, submit updates singular Q006_R1_Answer
  env.dispatchMessage({ type: 'QUIZ_RESET_ATTEMPT', payload: { quizId: 'Q006_R1' } });
  bridge.submit('Sub-Committee', false);
  assert.strictEqual(env.vars.Q006_R1_Answer, 'Sub-Committee');
  assert.strictEqual(env.vars.Q006_R1_Correct, false);
  assert.ok(bridge.state.lastSubmissionId, 'lastSubmissionId should be recorded');
});

// 3. Bridge reveal deduplication, foreign source rejection, and polling stop
test('StorylineBridge deduplicates reveal, rejects foreign iframe source, and stops polling after reveal', () => {
  const env = createBridgeSandbox({
    Q002_Done: false,
    Q002_Revealed: false
  }, true);

  let revealCount = 0;
  let resetCount = 0;
  const bridge = new env.Bridge({
    quizId: 'Q002',
    autoPoll: true,
    pollIntervalMs: 150,
    onRevealAnswers: () => { revealCount++; },
    onResetAttempt: () => { resetCount++; }
  });

  assert.strictEqual(env.timers.size, 1, 'Polling timer should be active before reveal');

  // Foreign source should be ignored
  env.dispatchMessage({ type: 'QUIZ_REVEAL_ANSWERS', payload: { quizId: 'Q002' } }, { foreign: true });
  assert.strictEqual(revealCount, 0, 'Foreign source must be ignored');

  // Valid parent reveal
  env.dispatchMessage({ type: 'QUIZ_REVEAL_ANSWERS', payload: { quizId: 'Q002' } });
  env.dispatchMessage({ type: 'QUIZ_REVEAL_ANSWERS', payload: { quizId: 'Q002' } });
  assert.strictEqual(revealCount, 1, 'Reveal callback must fire only once');
  assert.strictEqual(env.timers.size, 0, 'Polling timer must clear upon reveal');

  // Reset attempt restores ready state
  env.dispatchMessage({ type: 'QUIZ_RESET_ATTEMPT', payload: { quizId: 'Q002' } });
  assert.strictEqual(resetCount, 1);
  assert.strictEqual(bridge.state.submitted, false);
  assert.strictEqual(bridge.state.revealed, false);
});

// 4. Q006 label-to-ID revisit restoration & reset/re-reveal badge visibility
test('Q006 committee-quiz.js restores label-based Storyline answers and restores badge display on re-reveal', () => {
  const committeeQuizCode = fs.readFileSync(
    path.join(ROOT, 'quizzes/Q006_SafetyReviewStructure/shared/committee-quiz.js'),
    'utf8'
  );
  const committeeDataCode = fs.readFileSync(
    path.join(ROOT, 'quizzes/Q006_SafetyReviewStructure/shared/committee-data.js'),
    'utf8'
  );

  // Minimal DOM mock for committee-quiz.js
  function makeClassList(initial = []) {
    const set = new Set(initial);
    return {
      add: (...cls) => cls.forEach((c) => set.add(c)),
      remove: (...cls) => cls.forEach((c) => set.delete(c)),
      contains: (c) => set.has(c)
    };
  }
  function makeEl(id = '', classes = []) {
    return {
      id,
      classList: makeClassList(classes),
      style: {},
      textContent: '',
      innerHTML: '',
      disabled: false,
      attributes: {},
      children: [],
      setAttribute(k, v) { this.attributes[k] = String(v); },
      getAttribute(k) { return this.attributes[k] || null; },
      addEventListener() {},
      appendChild(c) { this.children.push(c); },
      querySelector(sel) {
        if (sel === '.card-status-badge') return this._badge || null;
        return null;
      }
    };
  }

  const cardElements = [];
  const elementsById = {
    'issue-badge': makeEl('issue-badge'),
    'progress-tracker': makeEl('progress-tracker'),
    'scenario-image': makeEl('scenario-image'),
    'scenario-text': makeEl('scenario-text'),
    'question-text': makeEl('question-text'),
    'options-grid': makeEl('options-grid'),
    'btn-submit': makeEl('btn-submit')
  };

  const env = createBridgeSandbox({
    Q006_R1_Done: true,
    Q006_R1_Answer: 'Sub Committee',
    Q006_R1_Correct: false,
    Q006_R1_Revealed: false
  }, true);

  const winListeners = {};
  const sandbox = {
    DICVStorylineBridge: env.Bridge,
    window: {
      location: { href: 'http://localhost/Q006_R1/index.html', origin: 'null', search: '' },
      DICVStorylineBridge: env.Bridge,
      addEventListener: (ev, cb) => {
        winListeners[ev] = winListeners[ev] || [];
        winListeners[ev].push(cb);
      }
    },
    document: {
      documentElement: { classList: makeClassList() },
      getElementById: (id) => elementsById[id] || null,
      createElement: () => {
        const card = makeEl('', ['committee-card']);
        card._badge = makeEl('', ['card-status-badge']);
        Object.defineProperty(card, 'innerHTML', {
          set(v) {
            this._html = v;
          },
          get() { return this._html || ''; }
        });
        cardElements.push(card);
        return card;
      },
      querySelectorAll: (sel) => (sel === '.committee-card' ? cardElements : [])
    },
    console,
    Array,
    String,
    JSON
  };
  sandbox.window.document = sandbox.document;
  vm.createContext(sandbox);
  vm.runInContext(committeeDataCode, sandbox);
  vm.runInContext(committeeQuizCode, sandbox);
  sandbox.window.initCommitteeQuiz('R1');

  const subCard = cardElements.find((c) => c.getAttribute('data-option-id') === 'sub');
  assert.ok(subCard, 'Card for "sub" must be rendered');
  assert.ok(subCard.classList.contains('is-selected'), 'Restored "Sub Committee" should select card with id "sub"');
  assert.ok(subCard.classList.contains('is-locked'), 'Revisit in submitted state must lock cards');
  assert.strictEqual(elementsById['btn-submit'].disabled, true, 'Submit button must remain disabled on revisit');

  // Verify reset + re-reveal restores badge visibility
  env.dispatchMessage({ type: 'QUIZ_RESET_ATTEMPT', payload: { quizId: 'Q006_R1' } });
  assert.strictEqual(subCard._badge.style.display, 'none', 'Reset hides badge');
  env.dispatchMessage({ type: 'QUIZ_REVEAL_ANSWERS', payload: { quizId: 'Q006_R1' } });
  const apexCard = cardElements.find((c) => c.getAttribute('data-option-id') === 'apex');
  assert.strictEqual(apexCard._badge.style.display, '', 'Re-reveal must clear display:none on badge');
  assert.strictEqual(apexCard._badge.textContent, '✓ Correct');
});

// 5. Static defect regression checks across all source quizzes
test('All quizzes free of premature 700ms reveal, wrong bridge init, and duplicate Done toggles', () => {
  const q001 = fs.readFileSync(path.join(ROOT, 'quizzes/Q001_AccidentPrediction/index.html'), 'utf8');
  const q002 = fs.readFileSync(path.join(ROOT, 'quizzes/Q002_SafetyCommitments/index.html'), 'utf8');
  const q003 = fs.readFileSync(path.join(ROOT, 'quizzes/Q003_EHSCommitments/index.html'), 'utf8');
  const q004 = fs.readFileSync(path.join(ROOT, 'quizzes/Q004_EHSFocusAreas/index.html'), 'utf8');
  const q005 = fs.readFileSync(path.join(ROOT, 'quizzes/Q005_SafetyCultureMaturity/index.html'), 'utf8');
  const q006 = fs.readFileSync(path.join(ROOT, 'quizzes/Q006_SafetyReviewStructure/shared/committee-quiz.js'), 'utf8');

  assert.strictEqual(/SetVar\(['"]Q001_Done['"]/.test(q001), false, 'Q001 must not double-toggle Q001_Done outside bridge');
  assert.strictEqual(/setTimeout\([^)]*700/.test(q002), false, 'Q002 must not have 700ms auto-reveal');
  assert.strictEqual(/setTimeout\([^)]*700/.test(q003), false, 'Q003 must not have 700ms auto-reveal');
  assert.strictEqual(/setTimeout\([^)]*700/.test(q004), false, 'Q004 must not have 700ms auto-reveal');
  assert.strictEqual(/new DICVStorylineBridge\(['"]Q004['"]/.test(q004), false, 'Q004 must use single-object DICVStorylineBridge config');
  assert.strictEqual(/onResetState\s*:/.test(q005), false, 'Q005 must use onResetAttempt, not onResetState');
  assert.strictEqual(/onResetState\s*:/.test(q006), false, 'Q006 must use onResetAttempt, not onResetState');
  assert.ok(q005.includes("badgeEl.style.display = ''"), 'Q005 revealReviewMode must restore badge display');
  assert.ok(q006.includes("badge.style.display = ''"), 'Q006 revealReviewMode must restore badge display');
});

// 6. Dist package completeness check
test('All 8 dist packages exist with required runtime files', () => {
  const targets = [
    'Q001_AccidentPrediction',
    'Q002_SafetyCommitments',
    'Q003_EHSCommitments',
    'Q004_EHSFocusAreas',
    'Q005_SafetyCultureMaturity',
    'Q006_R1',
    'Q006_R2',
    'Q006_R3'
  ];

  targets.forEach((id) => {
    const dir = path.join(ROOT, 'dist', id);
    assert.ok(fs.existsSync(path.join(dir, 'index.html')), `${id}/index.html missing`);
    assert.ok(fs.existsSync(path.join(dir, 'storyline-bridge.js')), `${id}/storyline-bridge.js missing`);
    assert.ok(fs.existsSync(path.join(dir, 'fonts.css')), `${id}/fonts.css missing`);
    assert.ok(fs.existsSync(path.join(dir, 'quiz.json')), `${id}/quiz.json missing`);
  });
});

// 7. Reloaded / stale frame with Q002_Done = true protects LivesRemaining and saved answer
test('Q002 reload guard prevents duplicate heart deduction and preserves saved answer when Q002_Done is true', () => {
  const env = createBridgeSandbox({
    Q002_Done: true,
    Q002_Answers: '["A","B"]',
    Q002_Correct: false,
    Q002_Revealed: false,
    LivesRemaining: 2
  });

  const bridge = new env.Bridge({
    quizId: 'Q002',
    autoPoll: false,
    storylineVariables: {
      submitted: 'Q002_Done',
      answers: 'Q002_Answers',
      correct: 'Q002_Correct',
      revealed: 'Q002_Revealed'
    }
  });

  // Simulate stale in-memory state (e.g. iframe reload or race before sync)
  bridge.state.submitted = false;
  const res = bridge.submit(['C'], false);

  assert.strictEqual(res.ok, false, 'Repeated submission must be blocked when Storyline already has Q002_Done = true');
  assert.strictEqual(res.reason, 'already-completed');
  assert.strictEqual(env.vars.LivesRemaining, 2, 'LivesRemaining must remain 2 without second deduction');
  assert.strictEqual(env.vars.Q002_Answers, '["A","B"]', 'Saved Q002_Answers must remain intact');
  assert.strictEqual(env.vars.Q002_Done, true, 'Q002_Done must stay true without re-toggling feedback');
  assert.strictEqual(bridge.state.submitted, true, 'Restored state must mark bridge.state.submitted = true');
});

// 8. Answer / correctness SetVar failure must not mark Done or deduct a heart
test('StorylineBridge aborts cleanly without marking Done or deducting a heart when answer write fails', () => {
  const env = createBridgeSandbox({
    Q002_Done: false,
    LivesRemaining: 3
  });

  const bridge = new env.Bridge({
    quizId: 'Q002',
    autoPoll: false,
    storylineVariables: {
      submitted: 'Q002_Done',
      answers: 'Q002_Answers',
      correct: 'Q002_Correct',
      revealed: 'Q002_Revealed'
    }
  });

  // Inject failure on Q002_Answers write
  const origSetVar = env.parentObj.GetPlayer().SetVar;
  env.parentObj.GetPlayer().SetVar = (k, v) => {
    if (k === 'Q002_Answers') {
      throw new Error('Simulated LMS SetVar failure');
    }
    return origSetVar(k, v);
  };

  const firstAttempt = bridge.submit(['A'], false);
  assert.strictEqual(firstAttempt.ok, false, 'Failed answer write must return ok: false');
  assert.strictEqual(firstAttempt.reason, 'write-failed');
  assert.strictEqual(env.vars.Q002_Done, false, 'Q002_Done must remain false after failed write');
  assert.strictEqual(env.vars.LivesRemaining, 3, 'LivesRemaining must remain 3 on failed write');
  assert.strictEqual(bridge.state.submitted, false, 'Quiz must remain recoverable for retry');

  // Restore SetVar and verify retry succeeds cleanly
  env.parentObj.GetPlayer().SetVar = origSetVar;
  const retryAttempt = bridge.submit(['A'], false);
  assert.strictEqual(retryAttempt.ok, true, 'Retry after restored SetVar must succeed');
  assert.strictEqual(env.vars.Q002_Done, true, 'Q002_Done must become true after retry');
  assert.strictEqual(env.vars.LivesRemaining, 2, 'LivesRemaining must deduct once on retry');
});

// 9. Q006 matches Q002-Q005 by showing feedback panel and checking res.ok
test('Q006 committee-quiz.js checks res.ok and displays feedback panel consistently', () => {
  const q006 = fs.readFileSync(path.join(ROOT, 'quizzes/Q006_SafetyReviewStructure/shared/committee-quiz.js'), 'utf8');
  assert.ok(/var res = bridge\.submit\(answerLabel, isCorrect\);/.test(q006), 'Q006 must capture result object from bridge.submit');
  assert.ok(/if\s*\(!res \|\| !res\.ok\)\s*return;/.test(q006), 'Q006 must abort when !res.ok');
  assert.ok(/showFeedbackPanel\(isCorrect\);/.test(q006), 'Q006 must show feedback panel after valid submit');
});

// 10. Done read-back failure rolls back submitted state and preserves LivesRemaining
test('StorylineBridge rolls back submitted state and avoids heart deduction when Done read-back fails', () => {
  const env = createBridgeSandbox({
    Q002_Done: false,
    LivesRemaining: 3
  });

  const bridge = new env.Bridge({
    quizId: 'Q002',
    autoPoll: false,
    storylineVariables: {
      submitted: 'Q002_Done',
      answers: 'Q002_Answers',
      correct: 'Q002_Correct',
      revealed: 'Q002_Revealed'
    }
  });

  const origSetVar = env.parentObj.GetPlayer().SetVar;
  env.parentObj.GetPlayer().SetVar = (k, v) => {
    if (k === 'Q002_Done') {
      return; // Silent no-op SetVar failure
    }
    return origSetVar(k, v);
  };

  bridge.submit(['A'], false);
  assert.strictEqual(env.vars.LivesRemaining, 3, 'LivesRemaining must stay 3 when Q002_Done read-back fails');
  assert.strictEqual(bridge.state.submitted, false, 'bridge.state.submitted must roll back when Done fails');
});

// 11. Late GetPlayer() initialization syncs saved state on first poll tick
test('StorylineBridge hydrates saved state on first poll tick when GetPlayer() initializes late', () => {
  const env = createBridgeSandbox({
    Q002_Done: true,
    Q002_Answers: '["A","B","C"]',
    Q002_Correct: false,
    Q002_Revealed: true
  });
  let playerReady = false;
  const realGetPlayer = env.parentObj.GetPlayer;
  env.parentObj.GetPlayer = () => (playerReady ? realGetPlayer() : null);

  let revealedWith = null;
  const bridge = new env.Bridge({
    quizId: 'Q002',
    autoPoll: true,
    storylineVariables: {
      submitted: 'Q002_Done',
      answers: 'Q002_Answers',
      correct: 'Q002_Correct',
      revealed: 'Q002_Revealed'
    },
    onRevealAnswers: (sel) => {
      revealedWith = sel;
    }
  });

  assert.strictEqual(bridge._synced, false, '_synced starts false when GetPlayer() is null at init');
  playerReady = true;
  // Trigger one poll tick
  const timer = Array.from(env.timers.values())[0];
  assert.ok(timer, 'Polling timer should be active');
  timer.fn();

  assert.strictEqual(bridge._synced, true, '_synced must become true after late player sync');
  assert.strictEqual(bridge.state.submitted, true);
  assert.deepStrictEqual(revealedWith, ['A', 'B', 'C']);
});

console.log(`\nSummary: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
