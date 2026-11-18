/**
 * Regression & Unit Tests for Header 1 Life Meter Display & ReviewHub Life Meter Docs
 * Run: node WebObjects/tests/regression/test_header1_lifemeter.js
 */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');
var assert = require('assert');

var ROOT = path.resolve(__dirname, '../../..');
var SRC_DIR = path.join(ROOT, 'WebObjects', 'header1');
var DIST_DIR = path.join(ROOT, 'WebObjects', 'dist', 'Header1');

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

function makeClassList(initial) {
  var set = {};
  (initial || []).forEach(function (c) { set[c] = true; });
  return {
    add: function () { for (var i = 0; i < arguments.length; i++) set[arguments[i]] = true; },
    remove: function () { for (var i = 0; i < arguments.length; i++) delete set[arguments[i]]; },
    toggle: function (c, force) {
      if (force === true) set[c] = true;
      else if (force === false) delete set[c];
      else if (set[c]) delete set[c];
      else set[c] = true;
    },
    contains: function (c) { return !!set[c]; }
  };
}

function makeEl(id, classes, attrs) {
  return {
    id: id,
    classList: makeClassList(classes),
    attrs: Object.assign({}, attrs || {}),
    textContent: '',
    listeners: {},
    setAttribute: function (k, v) { this.attrs[k] = String(v); },
    getAttribute: function (k) { return this.attrs.hasOwnProperty(k) ? this.attrs[k] : null; },
    addEventListener: function (ev, fn) { this.listeners[ev] = fn; }
  };
}

function bootHeader1(vars) {
  var posted = [];
  var msgListeners = [];
  var stateVars = Object.assign({
    HeaderProfile: 'C',
    CourseProgressData: '{"v":1,"t":{"101":2,"103":2,"102":2,"104":2,"105":2,"106":2}}',
    LivesRemaining: 3,
    HeaderAction: ''
  }, vars || {});

  var hearts = [
    makeEl('heart-1', ['dicv-ico', 'dicv-heart', 'is-unavailable']),
    makeEl('heart-2', ['dicv-ico', 'dicv-heart', 'is-unavailable']),
    makeEl('heart-3', ['dicv-ico', 'dicv-heart', 'is-unavailable'])
  ];
  var btns = [
    makeEl('btn-guidelines', ['dicv-h1-btn'], { 'data-action': 'OPEN_GUIDELINES' }),
    makeEl('btn-map', ['dicv-h1-btn'], { 'data-action': 'OPEN_MAP' }),
    makeEl('btn-mute', ['dicv-h1-btn'], { 'data-action': 'TOGGLE_MUTE', 'aria-pressed': 'false' }),
    makeEl('btn-exit', ['dicv-h1-btn'], { 'data-action': 'EXIT_COURSE' }),
    makeEl('btn-fullscreen', ['dicv-h1-btn'], { 'data-action': 'TOGGLE_FULLSCREEN', 'aria-pressed': 'false' })
  ];
  var byId = {
    'h1-life': makeEl('h1-life', ['dicv-h1-stat']),
    'h1-life-val': makeEl('h1-life-val', ['dicv-stat-val']),
    'h1-stars': makeEl('h1-stars', ['dicv-h1-stat']),
    'h1-stars-val': makeEl('h1-stars-val', ['dicv-stat-val']),
    'btn-guidelines': btns[0],
    'btn-map': btns[1],
    'btn-mute': btns[2],
    'btn-exit': btns[3],
    'btn-fullscreen': btns[4]
  };

  var parentStub = {
    GetPlayer: function () {
      return {
        GetVar: function (k) { return stateVars.hasOwnProperty(k) ? stateVars[k] : null; },
        SetVar: function (k, v) { stateVars[k] = v; }
      };
    },
    postMessage: function (msg) { posted.push(msg); }
  };

  var ctx = {
    location: { search: '' },
    URLSearchParams: URLSearchParams,
    parent: parentStub,
    top: parentStub,
    document: {
      getElementById: function (id) { return byId[id] || null; },
      querySelectorAll: function (sel) {
        if (sel === '#h1-hearts .dicv-heart') return hearts;
        if (sel === '.dicv-h1-btn[data-action]') return btns;
        return [];
      }
    },
    addEventListener: function (ev, fn) { if (ev === 'message') msgListeners.push(fn); },
    console: console
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(DIST_DIR, 'header1.js'), 'utf8'), ctx);

  return {
    stateVars: stateVars,
    hearts: hearts,
    btns: btns,
    byId: byId,
    posted: posted,
    parentStub: parentStub,
    sendMessage: function (data, source) {
      msgListeners.forEach(function (fn) { fn({ data: data, source: source || parentStub }); });
    }
  };
}

console.log('\n=== Header 1 Life Meter & ReviewHub Integration Tests ===');

test('dist/Header1 matches source files and has zero external URLs', function () {
  ['index.html', 'header1.css', 'header1.js'].forEach(function (f) {
    var src = fs.readFileSync(path.join(SRC_DIR, f), 'utf8');
    var dst = fs.readFileSync(path.join(DIST_DIR, f), 'utf8');
    assert.strictEqual(dst, src, f + ' out of sync with dist/Header1');
    assert.strictEqual(/https?:\/\//i.test(dst), false, f + ' contains external URL');
  });
});

test('TC-LIFE-01: Displays 3, 2, 1, 0 hearts accurately and clamps out-of-range numbers', function () {
  [3, 2, 1, 0].forEach(function (n) {
    var h = bootHeader1({ LivesRemaining: n });
    assert.strictEqual(h.byId['h1-life-val'].textContent, n + '/3');
    assert.strictEqual(h.byId['h1-life'].getAttribute('aria-label'), n + ' of 3 lives remaining');
    for (var i = 0; i < 3; i++) {
      assert.strictEqual(h.hearts[i].classList.contains('is-active'), i < n);
      assert.strictEqual(h.hearts[i].classList.contains('is-inactive'), i >= n);
      assert.strictEqual(h.hearts[i].classList.contains('is-unavailable'), false);
    }
  });
  assert.strictEqual(bootHeader1({ LivesRemaining: 9 }).byId['h1-life-val'].textContent, '3/3');
  assert.strictEqual(bootHeader1({ LivesRemaining: -2 }).byId['h1-life-val'].textContent, '0/3');
});

test('Missing, null, empty, or invalid LivesRemaining shows "--" unavailable (NOT 0)', function () {
  [null, undefined, '', 'Pending', true].forEach(function (bad) {
    var h = bootHeader1({ LivesRemaining: bad });
    assert.strictEqual(h.byId['h1-life-val'].textContent, '--');
    assert.strictEqual(h.byId['h1-life'].getAttribute('aria-label'), 'Lives unavailable');
    assert.strictEqual(h.hearts[0].classList.contains('is-unavailable'), true);
  });
});

test('Preserves HEADER1_READY handshake, HEADER1_SYNC refresh, and HeaderAction dispatch', function () {
  var h = bootHeader1({ LivesRemaining: 3 });
  assert.strictEqual(h.posted[0].type, 'HEADER1_READY');

  h.stateVars.LivesRemaining = 2;
  h.sendMessage({ type: 'HEADER1_SYNC' });
  assert.strictEqual(h.byId['h1-life-val'].textContent, '2/3');

  h.sendMessage({ type: 'HEADER1_SET_PROFILE', profile: 'B' });
  assert.strictEqual(h.byId['btn-map'].classList.contains('is-hidden'), true);
  assert.strictEqual(h.byId['btn-guidelines'].classList.contains('is-hidden'), false);

  h.btns[0].listeners.click();
  assert.strictEqual(h.stateVars.HeaderAction, 'OPEN_GUIDELINES');
  assert.strictEqual(h.posted[h.posted.length - 1].payload.action, 'OPEN_GUIDELINES');
});

test('ReviewHub renders UI-16 Life Meter and corrected UI-00 variables cleanly', function () {
  var ctx = { window: {}, localStorage: { getItem: function () { return null; }, setItem: function () {} }, console: console, encodeURIComponent: encodeURIComponent, decodeURIComponent: decodeURIComponent };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'ReviewHub/data/hub-data.js'), 'utf8'), ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'ReviewHub/data/story-manifest.js'), 'utf8'), ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'ReviewHub/data/global-controls-data.js'), 'utf8'), ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'ReviewHub/js/story-view.js'), 'utf8'), ctx);

  ctx.DICV_STORY_VIEW.setSelectedSlideId('ui_life_meter');
  var lifeHtml = ctx.DICV_STORY_VIEW.render();
  assert.ok(/TC-LIFE-01/.test(lifeHtml) && /TC-LIFE-10/.test(lifeHtml), 'Missing TC-LIFE test cases');
  assert.ok(/LivesRemaining/.test(lifeHtml) && /M1_BonusRefillUsed/.test(lifeHtml), 'Missing Life Meter variables');

  ctx.DICV_STORY_VIEW.setSelectedSlideId('ui_course_setup');
  var setupHtml = ctx.DICV_STORY_VIEW.render();
  assert.ok(/NavigationMode.*True\/False.*False/.test(setupHtml), 'NavigationMode must be True/False False');
  assert.ok(/RequestedMission.*Number.*0/.test(setupHtml), 'RequestedMission must be Number 0');
});

test('Header 1 initializes mute from localStorage, lowers stars on StarsEarned=0, and syncs fullscreenchange', function () {
  var docListeners = {};
  var byId = {
    'h1-life': makeEl('h1-life', ['dicv-h1-stat']),
    'h1-life-val': makeEl('h1-life-val', ['dicv-stat-val']),
    'h1-stars': makeEl('h1-stars', ['dicv-h1-stat']),
    'h1-stars-val': makeEl('h1-stars-val', ['dicv-stat-val']),
    'btn-mute': makeEl('btn-mute', ['dicv-h1-btn'], { 'data-action': 'TOGGLE_MUTE', 'aria-pressed': 'false' }),
    'btn-fullscreen': makeEl('btn-fullscreen', ['dicv-h1-btn'], { 'data-action': 'TOGGLE_FULLSCREEN', 'aria-pressed': 'true' })
  };
  var stateVars = {
    HeaderProfile: 'C',
    CourseProgressData: '{"v":1,"t":{"103":2,"102":2,"104":2,"105":2,"106":2}}',
    StarsEarned: 0,
    LivesRemaining: 3
  };
  var docStub = {
    fullscreenElement: null,
    getElementById: function (id) { return byId[id] || null; },
    querySelectorAll: function () { return []; },
    addEventListener: function (ev, fn) { docListeners[ev] = fn; }
  };
  var ctx = {
    location: { search: '', origin: 'https://lms.example.com' },
    URLSearchParams: URLSearchParams,
    localStorage: { getItem: function (k) { return k === 'dicv_sfx_muted' ? 'true' : null; }, setItem: function () {} },
    parent: {
      GetPlayer: function () { return { GetVar: function (k) { return stateVars.hasOwnProperty(k) ? stateVars[k] : null; }, SetVar: function (k, v) { stateVars[k] = v; } }; },
      postMessage: function () {}
    },
    document: docStub,
    addEventListener: function () {},
    console: console
  };
  ctx.window = ctx; ctx.top = ctx.parent;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(DIST_DIR, 'header1.js'), 'utf8'), ctx);

  assert.strictEqual(byId['btn-mute'].getAttribute('aria-pressed'), 'true', 'Mute button should initialize pressed from dicv_sfx_muted');
  assert.strictEqual(byId['h1-stars-val'].textContent, '0/6', 'StarsEarned=0 should override Module 1 completion star on reset');
  docStub.fullscreenElement = {};
  docListeners.fullscreenchange();
  assert.strictEqual(byId['btn-fullscreen'].getAttribute('aria-pressed'), 'true');
  docStub.fullscreenElement = null;
  docListeners.fullscreenchange();
  assert.strictEqual(byId['btn-fullscreen'].getAttribute('aria-pressed'), 'false', 'fullscreenchange should clear pressed state on Esc exit');
});

test('Header 2 dist sync, config-driven aria-valuetext, title priority, and M1_CompletedCount fallback', function () {
  var h2Src = path.join(ROOT, 'WebObjects', 'header2');
  var h2Dist = path.join(ROOT, 'WebObjects', 'dist', 'Header2');
  ['header2.css', 'header2.js'].forEach(function (f) {
    assert.strictEqual(fs.readFileSync(path.join(h2Dist, f), 'utf8'), fs.readFileSync(path.join(h2Src, f), 'utf8'), f + ' out of sync with dist/Header2');
    assert.strictEqual(/https?:\/\//i.test(fs.readFileSync(path.join(h2Dist, f), 'utf8')), false, f + ' contains external URL');
  });
  assert.strictEqual(fs.existsSync(path.join(h2Dist, 'coursemap-data.js')), true, 'dist/Header2/coursemap-data.js missing');

  function runH2(vars) {
    var segs = ['103', '102', '104', '105', '106'].map(function (id) {
      return makeEl('seg-' + id, ['dicv-h2-seg'], { 'data-topic': id });
    });
    var bar = makeEl('h2-segments', ['dicv-h2-segments'], { role: 'progressbar' });
    bar.querySelectorAll = function () { return segs; };
    var byId = {
      'h2-module-badge': makeEl('h2-module-badge', ['dicv-h2-badge']),
      'h2-title': makeEl('h2-title', ['dicv-h2-title']),
      'h2-segments': bar,
      'h2-count': makeEl('h2-count', ['dicv-h2-count']),
      'h2-pct': makeEl('h2-pct', ['dicv-h2-pct'])
    };
    var ctx = {
      location: { search: '', origin: 'https://lms.example.com' },
      URLSearchParams: URLSearchParams,
      parent: {
        GetPlayer: function () { return { GetVar: function (k) { return vars.hasOwnProperty(k) ? vars[k] : null; }, SetVar: function () {} }; },
        postMessage: function () {}
      },
      document: {
        getElementById: function (id) { return byId[id] || null; },
        querySelectorAll: function (sel) { return sel === '#h2-segments .dicv-h2-seg' ? segs : []; }
      },
      addEventListener: function () {},
      console: console
    };
    ctx.window = ctx; ctx.top = ctx.parent;
    vm.createContext(ctx);
    vm.runInContext(fs.readFileSync(path.join(h2Dist, 'coursemap-data.js'), 'utf8'), ctx);
    vm.runInContext(fs.readFileSync(path.join(h2Dist, 'header2.js'), 'utf8'), ctx);
    return { byId: byId, segs: segs, bar: bar };
  }

  // In-progress topic (104=1) must take priority over stale RequestedMission (103)
  var r1 = runH2({
    CourseProgressData: JSON.stringify({ v: 2, t: { '103': 2, '102': 2, '104': 1, '105': 0, '106': 0 } }),
    RequestedMission: 103
  });
  assert.strictEqual(r1.byId['h2-title'].textContent, 'Safety Strategy');
  assert.strictEqual(r1.bar.getAttribute('aria-valuetext'), '2 of 5 topics');

  // M1_CompletedCount=2 fallback should mark index 2 (104) as active
  var r2 = runH2({ CourseProgressData: '', M1_CompletedCount: 2 });
  assert.strictEqual(r2.segs[0].classList.contains('is-completed'), true);
  assert.strictEqual(r2.segs[1].classList.contains('is-completed'), true);
  assert.strictEqual(r2.segs[2].classList.contains('is-active'), true);
  assert.strictEqual(r2.byId['h2-title'].textContent, 'Safety Strategy');
});

console.log('\nResult: ' + passed + ' passed, ' + failed + ' failed\n');
if (failed > 0) process.exit(1);
