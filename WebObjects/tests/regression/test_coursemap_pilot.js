/**
 * Regression & unit tests for Option B Six-Topic Module 1 Course Map.
 * Runs in Node (vm sandbox) — tests local JS logic, Phase B1 migration, & dist/CourseMap package integrity.
 * Does NOT test published Storyline 360 runtime or Oracle LMS / SCORM persistence.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..', '..');
const SRC_DIR = path.join(ROOT, 'coursemap');
const DIST_DIR = path.join(ROOT, 'dist', 'CourseMap');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  PASS  ${name}`);
    passed++;
  } catch (err) {
    console.error(`  FAIL  ${name}: ${err.message}`);
    failed++;
  }
}

function createHostSandbox(initialVars) {
  const vars = Object.assign(
    {
      NavigationMode: false,
      CourseProgressData: '',
      RequestedMission: 0,
    },
    initialVars || {}
  );
  const varSetHistory = [];
  const postedMessages = [];
  const timers = [];
  let now = 1000;

  const player = {
    GetVar(name) {
      return vars[name];
    },
    SetVar(name, val) {
      vars[name] = val;
      varSetHistory.push({ name, val });
    },
  };

  const sandbox = {
    console,
    Date: { now: () => now },
    setTimeout(fn, delay) {
      timers.push({ fn, delay });
      return timers.length;
    },
    clearTimeout() {},
    addEventListener() {},
    removeEventListener() {},
    GetPlayer: () => player,
    document: {
      querySelectorAll: () => [],
    },
    window: null,
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;

  const dataCode = fs.readFileSync(path.join(SRC_DIR, 'coursemap-data.js'), 'utf8');
  const hostCode = fs.readFileSync(path.join(SRC_DIR, 'coursemap-storyline-host.js'), 'utf8');
  vm.runInNewContext(dataCode, sandbox);
  vm.runInNewContext(hostCode, sandbox);

  const replyWindow = {
    postMessage(msg, origin) {
      postedMessages.push({ msg, origin });
    },
  };

  return {
    sandbox,
    host: sandbox.DICV_CourseMapHost,
    config: sandbox.DICV_COURSE_MAP_CONFIG,
    vars,
    varSetHistory,
    postedMessages,
    replyWindow,
    flushTimers() {
      while (timers.length) {
        const t = timers.shift();
        t.fn();
      }
    },
    advanceTime(ms) {
      now += ms;
    },
  };
}

console.log('\n=== Option B Six-Topic Course Map Tests ===');

test('Config has 6 modules, uses "Rules", and Module 1 has 5 topics in curriculum order [103,102,104,105,106]', () => {
  const ctx = createHostSandbox();
  assert.strictEqual(ctx.config.modules.length, 6);
  assert.ok(ctx.config.modules[5].title.includes('Rules'));
  const m1Topics = Array.from(ctx.config.modules[0].topics).map((t) => t.missionId);
  assert.deepStrictEqual(m1Topics, [103, 102, 104, 105, 106]);
  const m2Prereqs = Array.from(ctx.config.modules[1].prereqs);
  assert.deepStrictEqual(m2Prereqs, [103, 102, 104, 105, 106]);
});

test('Fresh learner in Restricted mode: only 103 authorized; 102, 104, 105, 106 denied', () => {
  const ctx = createHostSandbox();
  const prog = { v: 1, t: {}, last: null };
  assert.strictEqual(ctx.host.isTopicAuthorized(103, prog, false).ok, true);
  [102, 104, 105, 106].forEach((id) => {
    assert.strictEqual(ctx.host.isTopicAuthorized(id, prog, false).ok, false, `Expected ${id} locked`);
  });

  const opened102 = ctx.host.handleOpenMission(102, ctx.replyWindow);
  assert.strictEqual(opened102, false);
  assert.strictEqual(ctx.vars.RequestedMission, 0);
  assert.ok(
    ctx.postedMessages.some(
      (m) => m.msg && m.msg.type === 'NAVIGATION_DENIED' && m.msg.payload && m.msg.payload.missionId === 102
    )
  );
});

test('Sequential unlock 103 -> 102 -> 104 -> 105 -> 106 and Module 2 gate', () => {
  const ctx = createHostSandbox();
  const seq = [103, 102, 104, 105, 106];
  seq.forEach((id, idx) => {
    assert.strictEqual(ctx.host.handleOpenMission(id, ctx.replyWindow), true, `Open ${id}`);
    ctx.flushTimers();
    assert.strictEqual(ctx.vars.RequestedMission, id);
    ctx.host.markTopicStatus(id, 2);
    if (idx < seq.length - 1) {
      const nextId = seq[idx + 1];
      const prog = JSON.parse(ctx.vars.CourseProgressData);
      assert.strictEqual(ctx.host.isTopicAuthorized(nextId, prog, false).ok, true, `Next ${nextId} unlocked`);
    }
  });

  const finalProg = JSON.parse(ctx.vars.CourseProgressData);
  const m2Prereqs = Array.from(ctx.config.modules[1].prereqs);
  const m2Unlocked = m2Prereqs.every((id) => finalProg.t[String(id)] === 2);
  assert.strictEqual(m2Unlocked, true);
});

test('Phase B1 migration preserves 101=2 and 102=2, selects 103 next, skips 102 after 103=2, keeps M2 locked', () => {
  const ctx = createHostSandbox({
    CourseProgressData: JSON.stringify({ v: 1, t: { '101': 2, '102': 2 }, last: 102 }),
  });

  // 101 & 102 remain 2, 103 is authorized
  let prog = JSON.parse(ctx.vars.CourseProgressData);
  assert.strictEqual(prog.t['101'], 2);
  assert.strictEqual(prog.t['102'], 2);
  assert.strictEqual(ctx.host.isTopicAuthorized(103, prog, false).ok, true);
  assert.strictEqual(ctx.host.isTopicAuthorized(106, prog, false).ok, false);

  const m1Order = Array.from(ctx.config.modules[0].topics).map((t) => t.missionId);
  const firstUnfinished = m1Order.find((id) => (prog.t[String(id)] || 0) < 2);
  assert.strictEqual(firstUnfinished, 103);

  // Complete 103 -> next unfinished should skip already-completed 102 and pick 104
  ctx.host.markTopicStatus(103, 2);
  prog = JSON.parse(ctx.vars.CourseProgressData);
  const nextAfter103 = m1Order.find((id) => (prog.t[String(id)] || 0) < 2);
  assert.strictEqual(nextAfter103, 104);

  // Module 2 still locked until 104, 105, 106 are 2
  const m2Unlocked = Array.from(ctx.config.modules[1].prereqs).every((id) => prog.t[String(id)] === 2);
  assert.strictEqual(m2Unlocked, false);
});

test('Repeated handleOpenMission(103) resets RequestedMission to 0 before setting 103', () => {
  const ctx = createHostSandbox({ RequestedMission: 103 });
  assert.strictEqual(ctx.host.handleOpenMission(103, ctx.replyWindow), true);
  assert.deepStrictEqual(
    ctx.varSetHistory.filter((e) => e.name === 'RequestedMission').map((e) => e.val),
    [0]
  );
  ctx.flushTimers();
  assert.deepStrictEqual(
    ctx.varSetHistory.filter((e) => e.name === 'RequestedMission').map((e) => e.val),
    [0, 103]
  );
});

test('Revisit protection: markTopicStatus(101, 1) after status 2 does not downgrade 101', () => {
  const ctx = createHostSandbox({
    CourseProgressData: JSON.stringify({ v: 1, t: { '101': 2 }, last: 101 }),
  });
  assert.strictEqual(ctx.host.markTopicStatus(101, 1), true);
  const prog = JSON.parse(ctx.vars.CourseProgressData);
  assert.strictEqual(prog.t['101'], 2);
});

test('Free mode opens 106 without marking 106 Completed; returning to Restricted re-locks 106 while preserving 101=2', () => {
  const ctx = createHostSandbox({
    CourseProgressData: JSON.stringify({ v: 1, t: { '101': 2 }, last: 101 }),
  });

  assert.strictEqual(ctx.host.toggleNavigationMode(), true);
  assert.strictEqual(ctx.host.handleOpenMission(106, ctx.replyWindow), true);
  ctx.flushTimers();
  assert.strictEqual(ctx.vars.RequestedMission, 106);

  let prog = JSON.parse(ctx.vars.CourseProgressData);
  assert.strictEqual(prog.t['106'], 1);

  ctx.advanceTime(300);
  assert.strictEqual(ctx.host.toggleNavigationMode(), false);
  assert.strictEqual(ctx.host.isTopicAuthorized(106, prog, false).ok, false);
  assert.strictEqual(prog.t['101'], 2);
});

test('Malformed CourseProgressData JSON falls back safely without throwing', () => {
  const ctx = createHostSandbox({ CourseProgressData: '{broken-json' });
  assert.strictEqual(ctx.host.handleOpenMission(103, ctx.replyWindow), true);
  const prog = JSON.parse(ctx.vars.CourseProgressData);
  assert.strictEqual(prog.t['103'], 1);
});

test('Web Object bridge (coursemap-bridge.js) initializes, sends READY, and cleans up on destroy', () => {
  const sentToParent = [];
  const listeners = {};
  let cleared = false;

  const player = {
    GetVar(name) {
      if (name === 'NavigationMode') return false;
      if (name === 'CourseProgressData') return JSON.stringify({ v: 1, t: { '101': 2 }, last: 101 });
      return 0;
    },
  };

  const sandbox = {
    console,
    Date,
    setInterval: () => 42,
    clearInterval: (id) => {
      if (id === 42) cleared = true;
    },
    addEventListener: (ev, fn) => {
      listeners[ev] = fn;
    },
    removeEventListener: (ev) => {
      delete listeners[ev];
    },
    parent: {
      GetPlayer: () => player,
      postMessage(msg) {
        sentToParent.push(msg);
      },
    },
    window: null,
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;

  const bridgeCode = fs.readFileSync(path.join(SRC_DIR, 'coursemap-bridge.js'), 'utf8');
  vm.runInNewContext(bridgeCode, sandbox);

  let lastState = null;
  const bridge = new sandbox.DICVCourseMapBridge({
    onState(state) {
      lastState = state;
    },
  });

  assert.ok(sentToParent.some((m) => m.type === 'READY'));
  assert.strictEqual(lastState.progress.t['101'], 2);

  bridge.destroy();
  assert.strictEqual(cleared, true);
  assert.strictEqual(listeners.message, undefined);
});

test('Standalone dist/CourseMap package is complete and self-contained', () => {
  const requiredFiles = [
    'index.html',
    'coursemap.css',
    'coursemap.js',
    'coursemap-data.js',
    'coursemap-bridge.js',
    'coursemap-storyline-host.js',
    'README_STORYLINE_SETUP.md',
    'fonts.css',
  ];
  for (const f of requiredFiles) {
    assert.ok(fs.existsSync(path.join(DIST_DIR, f)), `Missing dist/CourseMap/${f}`);
  }
  const fontFiles = fs.readdirSync(path.join(DIST_DIR, 'fonts')).filter((n) => n.endsWith('.ttf'));
  assert.ok(fontFiles.length >= 4);

  const svgDir = path.join(DIST_DIR, 'SVG');
  assert.ok(fs.existsSync(path.join(svgDir, 'Full converyor belt latest.svg')));
  for (let i = 1; i <= 7; i++) {
    assert.ok(fs.existsSync(path.join(svgDir, `Asset ${i}.svg`)));
  }

  const distCss = fs.readFileSync(path.join(DIST_DIR, 'coursemap.css'), 'utf8');
  assert.ok(distCss.includes("@import url('fonts.css');"));
  assert.ok(!distCss.includes('../shared/styles/fonts.css'));
});

console.log(`\nResult: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
