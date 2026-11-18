/**
 * End-to-End Verification: Life Hearts Deduction, Header1 Stars/Lives Sync,
 * Q004 Bonus Question (+1 Heart), Q003/Q005/Q006 Continue Triggers, and Q006 Order
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const DIST = path.resolve(__dirname, '../../dist');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log('  PASS  ' + name);
    passed++;
  } catch (err) {
    console.error('  FAIL  ' + name + ' -> ' + err.message);
    failed++;
  }
}

test('StorylineBridge deducts 1 life heart on incorrect submit and clamps at 0', () => {
  const vars = { LivesRemaining: 3, Q003_Done: false };
  const player = {
    GetVar: (k) => vars[k],
    SetVar: (k, v) => { vars[k] = v; }
  };

  const sandbox = {
    window: { parent: { GetPlayer: () => player }, addEventListener: () => {}, location: { search: '' } },
    document: { addEventListener: () => {} },
    console,
    setTimeout: (fn) => { fn(); return 0; },
    clearTimeout: () => {},
    setInterval: () => 1,
    clearInterval: () => {}
  };
  sandbox.self = sandbox.window;
  sandbox.window.self = sandbox.window;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(DIST, 'Q003_EHSCommitments/storyline-bridge.js'), 'utf8'), sandbox);

  const bridge = new sandbox.window.DICVStorylineBridge({
    quizId: 'Q003',
    storylineVariables: { submitted: 'Q003_Done', answers: 'Q003_Answers', correct: 'Q003_Correct', revealed: 'Q003_Revealed' }
  });
  bridge.submit(['A'], false);
  assert.strictEqual(vars.LivesRemaining, 2, 'Incorrect submit should deduct 1 heart (3 -> 2)');

  // Correct submit should not deduct a heart
  const bridge2 = new sandbox.window.DICVStorylineBridge({
    quizId: 'Q004',
    storylineVariables: { submitted: 'Q004_Done', answers: 'Q004_Answers', correct: 'Q004_Correct', revealed: 'Q004_Revealed' }
  });
  bridge2.submit('A:zone-1;B:zone-2;C:zone-3', true);
  assert.strictEqual(vars.LivesRemaining, 2, 'Correct submit should keep LivesRemaining unchanged');

  // Clamp at 0
  vars.LivesRemaining = 0;
  const bridge3 = new sandbox.window.DICVStorylineBridge({
    quizId: 'Q005',
    storylineVariables: { submitted: 'Q005_Done', answers: 'Q005_Answers', correct: 'Q005_Correct', revealed: 'Q005_Revealed' }
  });
  bridge3.submit({ t1: 'Reactive' }, false);
  assert.strictEqual(vars.LivesRemaining, 0, 'LivesRemaining should never go below 0');
});

test('Header1 syncs LivesRemaining, Module 1 CourseProgressData stars, and StarsEarned', () => {
  const vars = {
    HeaderProfile: 'C',
    LivesRemaining: 2,
    CourseProgressData: JSON.stringify({ topics: { '103': 2, '102': 2, '104': 2, '105': 2, '106': 2 } }),
    StarsEarned: 1
  };
  const player = { GetVar: (k) => vars[k], SetVar: (k, v) => { vars[k] = v; } };

  const makeEl = (id) => ({
    id,
    textContent: '',
    style: {},
    classList: {
      set: new Set(),
      add(c) { this.set.add(c); },
      remove(c) { this.set.delete(c); },
      toggle(c, f) { if (f === undefined) { if (this.set.has(c)) this.set.delete(c); else this.set.add(c); } else if (f) this.set.add(c); else this.set.delete(c); },
      contains(c) { return this.set.has(c); }
    },
    attrs: {},
    setAttribute(k, v) { this.attrs[k] = String(v); },
    getAttribute(k) { return this.attrs[k]; },
    addEventListener: () => {}
  });

  const els = {
    'h1-life': makeEl('h1-life'),
    'h1-life-val': makeEl('h1-life-val'),
    'h1-stars': makeEl('h1-stars'),
    'h1-stars-val': makeEl('h1-stars-val'),
    'h1-center-sep': makeEl('h1-center-sep')
  };
  const hearts = [makeEl('h0'), makeEl('h1'), makeEl('h2')];
  const stars = [makeEl('s0'), makeEl('s1'), makeEl('s2'), makeEl('s3'), makeEl('s4'), makeEl('s5')];

  const sandbox = {
    window: { parent: { GetPlayer: () => player }, location: { search: '' }, addEventListener: () => {} },
    document: {
      getElementById: (id) => els[id] || makeEl(id),
      querySelectorAll: (sel) => {
        if (sel.includes('.dicv-heart')) return hearts;
        if (sel.includes('.dicv-star')) return stars;
        return [];
      }
    },
    console,
    setTimeout: () => 1
  };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(DIST, 'Header1/header1.js'), 'utf8'), sandbox);

  assert.strictEqual(els['h1-life-val'].textContent, '2/3');
  assert.strictEqual(hearts[0].classList.contains('is-active'), true);
  assert.strictEqual(hearts[1].classList.contains('is-active'), true);
  assert.strictEqual(hearts[2].classList.contains('is-inactive'), true);
  assert.strictEqual(els['h1-stars-val'].textContent, '1/6');
  assert.strictEqual(stars[0].classList.contains('is-active'), true);
  assert.strictEqual(stars[1].classList.contains('is-inactive'), true);
});

test('Q004 includes Bonus Question flow, +3 Life Hearts reward, and Q004_Continue trigger', () => {
  const q4 = fs.readFileSync(path.join(DIST, 'Q004_EHSFocusAreas/index.html'), 'utf8');
  assert.ok(q4.includes('id="bonus-overlay"'), 'Q004 should include bonus-overlay');
  assert.ok(q4.includes('Q004_BonusCorrect'), 'Q004 should set Q004_BonusCorrect');
  assert.ok(q4.includes("p.SetVar('LivesRemaining', 3)"), 'Q004 bonus should restore LivesRemaining to 3');
  assert.ok(q4.includes('Restore up to 3 Hearts'), 'Q004 bonus badge should show Restore up to 3 Hearts');
  assert.ok(q4.includes('Q004_Continue'), 'Q004 bonus continue should fire Q004_Continue');
  assert.ok(q4.includes('Preventive Maintenance'), 'Q004 distractor should be Preventive Maintenance');
});

test('Q005 uses .png icons, Q006 order is R2 -> R3 -> R1, and all quizzes have Continue triggers', () => {
  const q5 = fs.readFileSync(path.join(DIST, 'Q005_SafetyCultureMaturity/index.html'), 'utf8');
  assert.ok(!q5.includes('assets/icons/reactive.svg'), 'Q005 should not reference .svg icons');
  assert.ok(q5.includes('assets/icons/reactive.png'), 'Q005 should reference reactive.png');
  assert.ok(q5.includes('Q005_Continue'), 'Q005 should fire Q005_Continue');

  const q3 = fs.readFileSync(path.join(DIST, 'Q003_EHSCommitments/index.html'), 'utf8');
  assert.ok(q3.includes('Q003_Continue'), 'Q003 should fire Q003_Continue');

  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(DIST, 'Q006_R2/committee-data.js'), 'utf8'), sandbox);
  const d = sandbox.window.DICV_COMMITTEE_DATA;
  assert.strictEqual(d.R2.roundIndex, 1, 'R2 should be round 1 of 3');
  assert.strictEqual(d.R3.roundIndex, 2, 'R3 should be round 2 of 3');
  assert.strictEqual(d.R1.roundIndex, 3, 'R1 should be round 3 of 3');
  assert.strictEqual(d.R2.storylineVariables.continueVar, 'Q006_R2_Continue');
  assert.strictEqual(d.R3.storylineVariables.continueVar, 'Q006_R3_Continue');
  assert.strictEqual(d.R1.storylineVariables.continueVar, 'Q006_R1_Continue');
});

console.log('\nResult: ' + passed + ' passed, ' + failed + ' failed\n');
process.exit(failed > 0 ? 1 : 0);
