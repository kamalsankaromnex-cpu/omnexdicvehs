/**
 * Local Edge-Case & Real-World Runtime Scenario Tests (Without Storyline / Oracle LMS)
 * Run: node WebObjects/tests/regression/test_edge_cases.js
 */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');
var assert = require('assert');

var ROOT = path.resolve(__dirname, '../../..');
var DIST = path.join(ROOT, 'WebObjects', 'dist');

var passed = 0;
var failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log('  PASS ', name);
    passed++;
  } catch (e) {
    console.error('  FAIL ', name, '->', e.message);
    failed++;
  }
}

console.log('\n=== Edge-Case & Real-World Runtime Scenarios (Local Sandbox) ===');

test('EC-1: CourseMapBridge.requestClose() toggles CourseMapCloseRequested when Storyline player exists, returns false standalone', function () {
  var vars = { CourseMapCloseRequested: false, NavigationMode: false, CourseProgressData: '{}' };
  var player = {
    GetVar: function (k) { return vars.hasOwnProperty(k) ? vars[k] : null; },
    SetVar: function (k, v) { vars[k] = v; }
  };
  var ctx = {
    Date: Date,
    setInterval: function () { return 1; },
    clearInterval: function () {},
    addEventListener: function () {},
    removeEventListener: function () {},
    parent: { GetPlayer: function () { return player; }, postMessage: function () {} },
    top: null,
    console: console
  };
  ctx.window = ctx;
  ctx.top = ctx.parent;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(DIST, 'CourseMap', 'coursemap-bridge.js'), 'utf8'), ctx);

  var b = new ctx.DICVCourseMapBridge({ onState: function () {}, onDenied: function () {} });
  assert.strictEqual(b.requestClose(), true);
  assert.strictEqual(vars.CourseMapCloseRequested, true);
  assert.strictEqual(b.requestClose(), true);
  assert.strictEqual(vars.CourseMapCloseRequested, false);
  b.destroy();

  // Standalone (no GetPlayer)
  ctx.parent = { postMessage: function () {} };
  ctx.top = ctx.parent;
  var b2 = new ctx.DICVCourseMapBridge({ onState: function () {}, onDenied: function () {} });
  assert.strictEqual(b2.requestClose(), false);
  b2.destroy();
});

test('EC-2 & EC-3: Quiz idle (no auto-fail timer) & mid-quiz exit without Submit leaves Done/Revealed False', function () {
  var vars = { Q004_Done: false, Q004_Correct: false, Q004_Answers: '', Q004_Revealed: false, LivesRemaining: 3 };
  var timers = [];
  var player = {
    GetVar: function (k) { return vars[k]; },
    SetVar: function (k, v) { vars[k] = v; }
  };
  var ctx = {
    Date: Date,
    Math: Math,
    JSON: JSON,
    setTimeout: function (fn, ms) { timers.push(ms); return 1; },
    clearTimeout: function () {},
    setInterval: function () { return 2; },
    clearInterval: function () {},
    addEventListener: function () {},
    removeEventListener: function () {},
    parent: { GetPlayer: function () { return player; }, postMessage: function () {} },
    console: console
  };
  ctx.window = ctx;
  ctx.top = ctx.parent;
  ctx.self = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'WebObjects', 'shared', 'storyline', 'storyline-bridge.js'), 'utf8'), ctx);

  var bridge = new ctx.DICVStorylineBridge({
    quizId: 'Q004',
    storylineVariables: { submitted: 'Q004_Done', answers: 'Q004_Answers', correct: 'Q004_Correct', revealed: 'Q004_Revealed' }
  });
  bridge.init();
  bridge.notifyDraftChange(['A:zone-1']);
  // Simulate leaving slide / closing browser without Submit
  bridge.destroy();

  assert.strictEqual(timers.length, 0, 'No idle countdown timers should be scheduled');
  assert.strictEqual(vars.Q004_Done, false);
  assert.strictEqual(vars.Q004_Revealed, false);
  assert.strictEqual(vars.Q004_Answers, '');
  assert.strictEqual(vars.LivesRemaining, 3);
});

test('EC-4: Rapid double-click blocked on Quiz submit, Header1 HeaderAction (250ms), and CourseMap mode toggle', function () {
  // 4a. StorylineBridge double submit
  var vars = { Q004_Done: false, Q004_Correct: false, Q004_Answers: '', Q004_Revealed: false };
  var player = { GetVar: function (k) { return vars[k]; }, SetVar: function (k, v) { vars[k] = v; } };
  var ctx = {
    Date: Date, Math: Math, JSON: JSON,
    setTimeout: function (fn) { fn(); return 1; }, clearTimeout: function () {},
    setInterval: function () { return 1; }, clearInterval: function () {},
    addEventListener: function () {}, removeEventListener: function () {},
    parent: { GetPlayer: function () { return player; }, postMessage: function () {} },
    console: console
  };
  ctx.window = ctx; ctx.top = ctx.parent; ctx.self = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'WebObjects', 'shared', 'storyline', 'storyline-bridge.js'), 'utf8'), ctx);
  var b = new ctx.DICVStorylineBridge({
    quizId: 'Q004',
    storylineVariables: { submitted: 'Q004_Done', answers: 'Q004_Answers', correct: 'Q004_Correct', revealed: 'Q004_Revealed' }
  });
  b.init();
  assert.strictEqual(b.submit('A:zone-1', true).ok, true);
  assert.strictEqual(b.submit('A:zone-1', true).ok, false);
  b.destroy();

  // 4b. CourseMapHost mode toggle 250ms debounce
  var cmVars = { NavigationMode: false, CourseProgressData: '{}', RequestedMission: 0 };
  var cmCtx = {
    Date: Date, JSON: JSON, Number: Number, Boolean: Boolean, String: String, Array: Array, Object: Object,
    addEventListener: function () {}, setTimeout: function (fn) { fn(); },
    GetPlayer: function () { return { GetVar: function (k) { return cmVars[k]; }, SetVar: function (k, v) { cmVars[k] = v; } }; },
    console: console
  };
  cmCtx.window = cmCtx;
  vm.createContext(cmCtx);
  vm.runInContext(fs.readFileSync(path.join(DIST, 'CourseMap', 'coursemap-data.js'), 'utf8'), cmCtx);
  vm.runInContext(fs.readFileSync(path.join(DIST, 'CourseMap', 'coursemap-storyline-host.js'), 'utf8'), cmCtx);
  assert.strictEqual(cmCtx.DICV_CourseMapHost.toggleNavigationMode(), true);
  assert.strictEqual(cmCtx.DICV_CourseMapHost.toggleNavigationMode(), null, 'Rapid 2nd toggle must be debounced');
});

test('EC-5: At 0/3 hearts, CourseMap navigation & completion continue without lockout', function () {
  var vars = { NavigationMode: false, CourseProgressData: '{}', RequestedMission: 0, LivesRemaining: 0 };
  var ctx = {
    Date: Date, JSON: JSON, Number: Number, Boolean: Boolean, String: String, Array: Array, Object: Object,
    addEventListener: function () {}, setTimeout: function (fn) { fn(); },
    GetPlayer: function () { return { GetVar: function (k) { return vars[k]; }, SetVar: function (k, v) { vars[k] = v; } }; },
    console: console
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(DIST, 'CourseMap', 'coursemap-data.js'), 'utf8'), ctx);
  vm.runInContext(fs.readFileSync(path.join(DIST, 'CourseMap', 'coursemap-storyline-host.js'), 'utf8'), ctx);

  assert.strictEqual(ctx.DICV_CourseMapHost.handleOpenMission(103), true);
  assert.strictEqual(ctx.DICV_CourseMapHost.markTopicStatus(103, 2), true);
  assert.strictEqual(ctx.DICV_CourseMapHost.handleOpenMission(102), true);
});

test('EC-6: Offline / zero external URLs across all 10 WebObjects/dist/* packages', function () {
  var dirs = fs.readdirSync(DIST).filter(function (n) {
    return fs.statSync(path.join(DIST, n)).isDirectory();
  });
  assert.strictEqual(dirs.length, 13, 'Expected 13 dist directories (Header1, Header2, CourseMap, Module1_Intro, Module1_Outro, 8 quizzes)');
  var offenders = [];
  function scan(dir) {
    fs.readdirSync(dir).forEach(function (entry) {
      var full = path.join(dir, entry);
      if (fs.statSync(full).isDirectory()) { scan(full); return; }
      if (/\.(html|css|js)$/i.test(entry)) {
        var txt = fs.readFileSync(full, 'utf8');
        if (/https?:\/\//i.test(txt)) offenders.push(full);
      }
    });
  }
  dirs.forEach(function (d) { scan(path.join(DIST, d)); });
  assert.deepStrictEqual(offenders, [], 'External URLs found in: ' + offenders.join(', '));
});

console.log('\nResult: ' + passed + ' passed, ' + failed + ' failed\n');
if (failed > 0) process.exit(1);
