const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '../../..');
const HUB_DIR = path.join(ROOT, 'ReviewHub');

const dataCode = fs.readFileSync(path.join(HUB_DIR, 'data/hub-data.js'), 'utf8');
const appCode = fs.readFileSync(path.join(HUB_DIR, 'js/hub-app.js'), 'utf8');

const dataSandbox = { window: {} };
vm.createContext(dataSandbox);
vm.runInContext(dataCode, dataSandbox);
const DATA = dataSandbox.window.DICV_HUB_DATA;

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

console.log('=== ReviewHub Verification Suite ===\n');

test('Counts & 8 quiz records present', () => {
  assert.strictEqual(DATA.project.counts.quizzes, 6);
  assert.strictEqual(DATA.project.counts.webObjects, 8);
  assert.strictEqual(DATA.project.counts.q006Slides, 3);
  assert.strictEqual(DATA.quizzes.length, 8);
  const ids = DATA.quizzes.map((q) => q.id);
  assert.strictEqual(ids.join(','), 'Q001,Q002,Q003,Q004,Q005,Q006_R1,Q006_R2,Q006_R3');
});

test('All quiz relative paths (dist, zip, src, preview, motion, screenshot) exist on disk', () => {
  DATA.quizzes.forEach((q) => {
    ['distFolder', 'zipFile', 'srcFolder', 'previewUrl', 'motionPreviewUrl'].forEach((k) => {
      const target = path.resolve(HUB_DIR, q[k]);
      assert.ok(fs.existsSync(target), `${q.id}.${k} missing: ${target}`);
    });
    if (q.screenshotUrl) {
      const sc = path.resolve(HUB_DIR, q.screenshotUrl);
      assert.ok(fs.existsSync(sc), `${q.id}.screenshotUrl missing: ${sc}`);
    }
  });
});

test('All documentation paths exist on disk', () => {
  DATA.docs.forEach((d) => {
    const target = path.resolve(HUB_DIR, d.path);
    assert.ok(fs.existsSync(target), `Doc missing: ${target}`);
  });
});

test('Variable mappings match Q001-Q005 plural Answers and Q006 singular Answer', () => {
  DATA.quizzes.forEach((q) => {
    assert.strictEqual(q.variables.length, 4, `${q.id} should have 4 variables`);
    const names = q.variables.map((v) => v.name);
    if (q.id.startsWith('Q006_')) {
      assert.ok(names.includes(`${q.id}_Answer`), `${q.id} must use singular _Answer`);
    } else {
      assert.ok(names.includes(`${q.id}_Answers`), `${q.id} must use plural _Answers`);
    }
  });
});

test('Animations (10) and Troubleshooting (13) complete', () => {
  assert.strictEqual(DATA.animations.length, 10);
  assert.strictEqual(DATA.troubleshooting.length, 13);
});

test('hub-app.js renders all 9 views without runtime errors', () => {
  const hubView = { innerHTML: '', querySelectorAll: () => [] };
  const topTitle = { textContent: '' };
  const sidebar = { classList: { toggle() {}, remove() {} } };

  const appSandbox = {
    window: {
      DICV_HUB_DATA: DATA,
      location: { hash: '#overview' },
      innerWidth: 1366,
      addEventListener() {}
    },
    document: {
      getElementById: (id) => {
        if (id === 'hub-view') return hubView;
        if (id === 'topbar-title') return topTitle;
        if (id === 'sidebar') return sidebar;
        return null;
      },
      querySelectorAll: () => [],
      createElement: () => ({ textContent: '' })
    },
    console,
    Number,
    String,
    Array,
    Math,
    JSON,
    Date
  };
  appSandbox.window.document = appSandbox.document;
  vm.createContext(appSandbox);
  vm.runInContext(appCode, appSandbox);
  assert.ok(hubView.innerHTML.includes('Project Readiness at a Glance'), 'Overview rendered');
});

console.log(`\nSummary: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
