/**
 * story-view.js — Final Master Storyline 360 Course Builder & Six-Star Mission Workspace
 * Three-area layout:
 *   Left:   Course Construction Tree (Learner Journey <-> 17-Step Storyline Build Order)
 *   Center: Visual Workspace (Actual Web Object/Screenshot, Reference Layout, Proposed Star/Mission Preview, Not Verified)
 *   Right:  Storyline Build Guide (Guided Mode default <-> Advanced Details 13-section inspector)
 */
(function (root) {
  'use strict';

  var STORAGE_KEY = 'dicv_storyview_setup_v2';
  var selectedSlideId = 's14';
  var centerViewMode = 'live';      // 'live' | 'screenshot'
  var leftPerspective = 'journey';  // 'journey' | 'buildorder'
  var rightMode = 'guided';         // 'guided' | 'advanced'
  var guidedStepIdx = 0;

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function copyBtn(text, label) {
    return '<button type="button" class="copy-btn" data-copy="' + esc(text) + '">' + esc(label || 'Copy') + '</button>';
  }

  function loadStore() {
    if (typeof localStorage === 'undefined') return {};
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveStore(store) {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {}
  }

  function getSlideState(store, slideId) {
    var entry = store[slideId];
    if (!entry || typeof entry !== 'object') {
      return { status: 'Not Started', checks: {}, stepChecks: {}, qa: {} };
    }
    return {
      status: entry.status || 'Not Started',
      checks: entry.checks || {},
      stepChecks: entry.stepChecks || {},
      qa: entry.qa || {}
    };
  }

  function statusClass(status) {
    if (status === 'Completed') return 'sv-status-done';
    if (status === 'In Progress') return 'sv-status-progress';
    if (status === 'Needs Verification') return 'sv-status-verify';
    return 'sv-status-todo';
  }

  function originBadgeClass(origin) {
    if (origin === 'Proposed / To Build') return 'sv-origin-proposed';
    if (origin === 'Future Placeholder') return 'sv-origin-placeholder';
    if (origin === 'QA Checklist') return 'sv-origin-qa';
    return 'sv-origin-baseline';
  }

  function visualBadgeClass(badge) {
    if (badge === 'Actual') return 'sv-vis-actual';
    if (badge === 'Proposed') return 'sv-vis-proposed';
    if (badge === 'Not Verified') return 'sv-vis-unverified';
    return 'sv-vis-reference';
  }

  function getAllNodes() {
    var manifest = root.DICV_STORY_MANIFEST;
    if (!manifest) return [];
    var list = [];
    if (Array.isArray(manifest.allNodes)) list = list.concat(manifest.allNodes);
    else {
      if (Array.isArray(manifest.setupNodes)) list = list.concat(manifest.setupNodes);
      else if (manifest.masterSlide) list.push(manifest.masterSlide);
      if (Array.isArray(manifest.slides)) list = list.concat(manifest.slides);
    }
    var gc = root.DICV_GLOBAL_CONTROLS;
    if (gc && Array.isArray(gc.uiNodes)) {
      list = list.concat(gc.uiNodes);
    }
    return list;
  }

  function findSlide(slideId) {
    var all = getAllNodes();
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === slideId) return all[i];
    }
    return all[0] || null;
  }

  function getQuizData(quizId) {
    var hub = root.DICV_HUB_DATA;
    if (!hub || !Array.isArray(hub.quizzes) || !quizId) return null;
    for (var i = 0; i < hub.quizzes.length; i++) {
      if (hub.quizzes[i].id === quizId) return hub.quizzes[i];
    }
    return null;
  }

  function getCourseMapTopics() {
    var cfg = root.DICV_COURSE_MAP_CONFIG;
    if (!cfg || !Array.isArray(cfg.modules)) return [];
    for (var i = 0; i < cfg.modules.length; i++) {
      if (cfg.modules[i].id === 1 && Array.isArray(cfg.modules[i].topics)) {
        return cfg.modules[i].topics;
      }
    }
    return [];
  }

  function renderLeftRail(allNodes, store, activeId) {
    var doneCount = 0;
    allNodes.forEach(function (n) {
      if (getSlideState(store, n.id).status === 'Completed') doneCount++;
    });

    var html = '<aside class="sv-left" aria-label="Course construction tree">';
    html += '<div class="sv-rail-head">';
    html += '<div><strong>Course Construction Tree</strong><div class="sv-muted">' + doneCount + ' / ' + allNodes.length + ' authored (local aid)</div></div>';
    html += '<button type="button" class="btn btn-secondary sv-mini-btn" id="sv-next-todo">Next →</button>';
    html += '</div>';

    html += '<div class="sv-persp-tabs" role="tablist" aria-label="Course perspective">';
    html += '<button type="button" class="sv-persp-btn' + (leftPerspective === 'journey' ? ' active' : '') + '" data-sv-persp="journey">Learner Journey</button>';
    html += '<button type="button" class="sv-persp-btn' + (leftPerspective === 'buildorder' ? ' active' : '') + '" data-sv-persp="buildorder">Build Order (17)</button>';
    html += '</div>';

    if (leftPerspective === 'buildorder') {
      var steps = (root.DICV_STORY_MANIFEST && root.DICV_STORY_MANIFEST.buildOrder) || [];
      html += '<div class="sv-scene-group"><div class="sv-scene-title">Recommended Storyline Build Sequence</div>';
      steps.forEach(function (st) {
        var node = findSlide(st.nodeId);
        var nodeStatus = node ? getSlideState(store, node.id).status : 'Not Started';
        var isActive = st.nodeId === activeId;
        html += '<button type="button" class="sv-slide-btn' + (isActive ? ' active' : '') + '" data-sv-slide="' + esc(st.nodeId) + '">';
        html += '<div class="sv-slide-row1"><span class="sv-slide-no">STEP ' + esc(st.step) + '</span><span class="sv-status-pill ' + statusClass(nodeStatus) + '">' + esc(nodeStatus) + '</span></div>';
        html += '<div class="sv-slide-title">' + esc(st.title) + '</div>';
        html += '<div class="sv-type-txt">' + esc(st.note) + '</div>';
        html += '</button>';
      });
      html += '</div></aside>';
      return html;
    }

    var groups = [
      { id: 'setup', label: 'Project Setup (Foundation)' },
      { id: 'global_ui', label: 'Global UI & Player Controls (15)' },
      { id: 'scene1', label: 'Introduction & Course Journey (1–8)' },
      { id: 'scene2', label: 'Module 1 · Vision Zero (9–21 + ★1)' },
      { id: 'scene3', label: 'Module 2 · Incident Mgmt (Orig. 22 + ★2)' },
      { id: 'scene4', label: 'Module 3 · HIRA & Controls (★3)' },
      { id: 'scene5', label: 'Module 4 · Ergonomics (★4)' },
      { id: 'scene6', label: 'Module 5 · Chemical Safety (★5)' },
      { id: 'scene7', label: 'Module 6 · Shopfloor & Rules (★6)' },
      { id: 'final', label: 'Final Mission & LMS QA' }
    ];

    groups.forEach(function (grp) {
      var items = allNodes.filter(function (n) { return n.sceneId === grp.id; });
      if (!items.length) return;
      html += '<div class="sv-scene-group">';
      html += '<div class="sv-scene-title">' + esc(grp.label) + '</div>';
      items.forEach(function (item) {
        var st = getSlideState(store, item.id).status;
        var isActive = item.id === activeId;
        var labelNo = item.originalNo ? ('SLIDE ' + item.originalNo) : String(item.no || '').toUpperCase();
        if (item.id === 's22') labelNo = 'ORIG. SLIDE 22';
        html += '<button type="button" class="sv-slide-btn' + (isActive ? ' active' : '') + '" data-sv-slide="' + esc(item.id) + '">';
        html += '<div class="sv-slide-row1">';
        html += '<span class="sv-slide-no">' + esc(labelNo) + '</span>';
        html += '<span class="sv-badges">';
        if (item.missionId) html += '<span class="sv-badge sv-badge-mission">M' + esc(item.missionId) + '</span>';
        if (item.quizId) html += '<span class="sv-badge sv-badge-quiz">' + esc(item.quizId) + '</span>';
        else if (item.isCourseMap) html += '<span class="sv-badge sv-badge-map">Map</span>';
        else if (item.starNumber) html += '<span class="sv-badge sv-badge-star">★' + esc(item.starNumber) + '</span>';
        html += '</span></div>';
        html += '<div class="sv-slide-title">' + esc(item.title) + '</div>';
        html += '<div class="sv-slide-row2">';
        html += '<span class="sv-origin-pill ' + originBadgeClass(item.originStatus) + '">' + esc(item.originStatus || 'Baseline') + '</span>';
        html += '<span class="sv-status-pill ' + statusClass(st) + '">' + esc(st) + '</span>';
        html += '</div></button>';
      });
      html += '</div>';
    });

    html += '</aside>';
    return html;
  }

  function renderCourseMapReference() {
    var cfg = root.DICV_COURSE_MAP_CONFIG;
    var topics = getCourseMapTopics();
    var html = '<div class="sv-card">';
    html += '<h4>Course Map Configuration (Live from coursemap-data.js)</h4>';
    if (!topics.length) {
      html += '<p class="sv-muted">Course Map config not loaded (`window.DICV_COURSE_MAP_CONFIG`).</p></div>';
      return html;
    }
    var m2 = (cfg && Array.isArray(cfg.modules)) ? cfg.modules.filter(function (m) { return m.id === 2; })[0] : null;
    var m2Rule = (m2 && Array.isArray(m2.prereqs) && m2.prereqs.length)
      ? ('All Module 1 topics [' + m2.prereqs.join(', ') + '] == 2')
      : 'All 6 Module 1 topics == 2';
    html += '<p class="sv-muted">Module 2 unlock rule: <code>' + esc(m2Rule) + '</code></p>';
    html += '<div class="table-wrap"><table><thead><tr><th>Mission</th><th>Topic</th><th>Prerequisites</th><th>Storyline Slide Reference</th></tr></thead><tbody>';
    topics.forEach(function (t) {
      html += '<tr><td><strong>' + esc(t.missionId) + '</strong></td><td>' + esc(t.title) + '</td>';
      html += '<td>' + (t.prereqs && t.prereqs.length ? esc(t.prereqs.join(', ')) : 'None') + '</td>';
      html += '<td>' + esc(t.storylineSlideRef || '') + '</td></tr>';
    });
    html += '</tbody></table></div></div>';
    return html;
  }

  function renderStarOrMissionPreview(slide) {
    var isFinal = slide.id === 'mission_complete';
    var activeStars = isFinal ? 6 : (slide.starNumber || 1);
    var html = '<div class="sv-star-stage">';
    html += '<div class="sv-vis-bar"><span class="sv-vis-badge sv-vis-proposed">Proposed — To Build in Storyline 360</span><span class="sv-muted">Not an actual .story screenshot</span></div>';
    html += '<h3>' + esc(slide.title) + '</h3>';
    html += '<p class="sv-muted">' + esc(slide.purpose) + '</p>';
    html += '<div class="sv-six-stars" aria-label="Six-star mission progress preview">';
    for (var s = 1; s <= 6; s++) {
      var earned = s <= activeStars;
      var current = !isFinal && s === activeStars;
      html += '<div class="sv-star-slot' + (earned ? ' earned' : '') + (current ? ' current' : '') + '">';
      html += '<div class="sv-star-icon">' + (earned ? '★' : '☆') + '</div>';
      html += '<div class="sv-star-lbl">Module ' + s + '</div>';
      html += '</div>';
    }
    html += '</div>';
    html += '<div class="sv-mockup-cols">';
    html += '<div><strong>Completion Gate (Authoritative)</strong><p>' + esc(slide.completionRule) + '</p></div>';
    html += '<div><strong>Navigation & Revisit</strong><p>' + esc(slide.navigation) + '</p><p><strong>Revisit:</strong> ' + esc(slide.revisitResume) + '</p></div>';
    html += '</div></div>';
    return html;
  }

  function renderBlackHeaderPreview(slide) {
    var html = '<div class="sv-card">';
    html += '<div class="sv-vis-bar"><span class="sv-vis-badge sv-vis-proposed">Hybrid Header Architecture — Header 1 (HTML Web Object) + Header 2 (Native Storyline)</span><span class="sv-muted">Header 1 = <code>WebObjects/dist/Header1/</code> · Header 2 = Native <code>#004355</code></span></div>';

    if (slide.id === 'ui_header1') {
      html += '<div class="sv-h1-sim-bar">';
      html += '<span class="sv-sim-note"><strong>Isolated HTML Preview (Mock Data — Not Authoritative Storyline Proof):</strong> Simulates <code>WebObjects/dist/Header1/</code> with <code>simLife=3</code>, <code>simStars=1/6</code>.</span>';
      html += '<div class="sv-h1-prof-btns" role="group" aria-label="HeaderProfile Switcher">';
      ['A', 'B', 'C', 'D'].forEach(function (prof) {
        html += '<button type="button" class="btn btn-outline sv-mini-btn' + (prof === 'C' ? ' active' : '') + '" data-sv-h1-profile="' + prof + '">Layout ' + prof + '</button>';
      });
      html += '</div></div>';
      html += '<div class="sv-h1-iframe-wrap"><iframe id="sv-h1-iframe" title="Header 1 HTML Web Object Preview" src="../WebObjects/dist/Header1/index.html?profile=C&amp;simLife=3&amp;simStars=1"></iframe></div>';
      html += '<div class="sv-h1-action-log" id="sv-h1-action-log">Click any Header 1 button above (Guidelines, Map, Mute, Exit, Fullscreen) to inspect the emitted <code>HeaderAction</code> payload.</div>';
    } else {
      html += '<div class="sv-black-header">';
      html += '<div class="sv-bh-brand">DICV SAFETY eLEARNING</div>';
      html += '<div class="sv-bh-right">';
      html += '<div class="sv-bh-indicators"><span class="sv-bh-life" title="1. Life / Heart (status indicator)">♥ 3</span><span class="sv-bh-stars" title="2. Six-Star Progress (status indicator)">★ 0/6</span></div>';
      html += '<div class="sv-bh-actions">';
      html += '<button type="button" class="sv-bh-btn" title="3. Guidelines (Lightbox Slide 7)">Guidelines</button>';
      html += '<button type="button" class="sv-bh-btn" title="4. Course Map (Lightbox Slide 8)">Map</button>';
      html += '<button type="button" class="sv-bh-btn" title="5. Mute / Unmute">Mute</button>';
      html += '<button type="button" class="sv-bh-btn" title="6. Exit">Exit</button>';
      html += '<button type="button" class="sv-bh-btn" title="7. Fullscreen">Fullscreen</button>';
      html += '</div></div></div>';
    }

    // Header 2: Native Storyline Bar (#004355, 1-line, NO buttons, NO Web Object)
    html += '<div class="sv-sub-header-dark" aria-label="Header 2 native Storyline bar preview">';
    html += '<div class="sv-h2-left"><span class="sv-h2-mod">DICV Safety Culture &amp; Vision Zero</span><span class="sv-h2-sep">|</span><span class="sv-h2-topic">Safety Strategy</span></div>';
    html += '<div class="sv-h2-prog"><span class="sv-h2-count">3 / 6 Topics (Native Header 2 · Zero Buttons)</span><span class="sv-h2-segs" aria-hidden="true">';
    for (var seg = 1; seg <= 6; seg++) {
      html += '<span class="sv-h2-seg' + (seg <= 3 ? ' done' : '') + '"></span>';
    }
    html += '</span></div></div>';

    html += '<div class="sv-state-swatches">';
    html += '<div><strong>Normal:</strong> Transparent on <code>#080A0C</code>, white icon, no box</div>';
    html += '<div><strong>Hover:</strong> <code>#24282B</code> bg, <code>#FFFF40</code> icon</div>';
    html += '<div><strong>Pressed (Down):</strong> <code>#004355</code> bg, <code>#FFFF40</code> icon</div>';
    html += '<div><strong>Disabled / Focus:</strong> Muted grey / <code>2px #FFFF40</code> outline</div>';
    html += '</div>';

    html += '<div class="table-wrap" style="margin-top:12px;"><table><thead><tr><th>Master Layout</th><th><code>HeaderProfile</code></th><th>Applies To</th><th>Header 1 (HTML Web Object)</th><th>Header 2 (Native Storyline)</th></tr></thead><tbody>';
    html += '<tr><td><strong>Layout A</strong></td><td><code>"A"</code></td><td>Slides 1–7 (Intro &amp; Guidelines)</td><td>Branding, Mute*, Exit, Fullscreen (Hide Life, Stars, Guidelines, Map)</td><td>Hidden</td></tr>';
    html += '<tr><td><strong>Layout B</strong></td><td><code>"B"</code></td><td>Slide 8 (Course Journey)</td><td>Life, Stars, Guidelines, Mute*, Exit, Fullscreen (Hide Map)</td><td>Hidden</td></tr>';
    html += '<tr><td><strong>Layout C</strong></td><td><code>"C"</code></td><td>Overviews, Training, Quizzes, Explanations, Stars</td><td>All 7: Life, Stars, Guidelines, Map, Mute*, Exit, Fullscreen</td><td>Shown on Training / Quiz / Explanation only</td></tr>';
    html += '<tr><td><strong>Layout D</strong></td><td><code>"D"</code></td><td>Mission Complete</td><td>6-Star Status, Mute*, Exit, Fullscreen (Hide Life, Guidelines, Map)</td><td>Hidden</td></tr>';
    html += '</tbody></table></div></div>';
    return html;
  }

  function renderPlayerStrategy() {
    var html = '<div class="sv-card">';
    html += '<div class="sv-vis-bar"><span class="sv-vis-badge sv-vis-actual">Final Strategy: Modern Player (Reduced Native Controls)</span></div>';
    html += '<p class="sv-muted"><strong>Final Rule:</strong> Disable built-in Player <strong>Previous</strong> &amp; <strong>Next</strong> buttons. Use custom Storyline buttons on individual slides + conditional automatic advancement. Retain Modern Player playback &amp; accessibility controls without duplicating Header 1.</p>';
    html += '<div class="table-wrap"><table><thead><tr><th>Control (Home → Player)</th><th>Final Setting</th><th>Reason</th></tr></thead><tbody>';
    html += '<tr><td>Built-in Previous / Next</td><td><strong>DISABLED (OFF)</strong></td><td>Replaced by custom slide buttons &amp; conditional auto-advance</td></tr>';
    html += '<tr><td>Native Submit</td><td><strong>DISABLED (OFF) on Quizzes</strong></td><td>HTML Web Objects own quiz submission</td></tr>';
    html += '<tr><td>Player Menu / Resources / Glossary</td><td><strong>DISABLED (OFF)</strong></td><td>Slide 8 Course Map handles course navigation</td></tr>';
    html += '<tr><td>Play / Pause</td><td><strong>RETAINED (ON)</strong></td><td>Narration &amp; slide timeline playback</td></tr>';
    html += '<tr><td>Seekbar</td><td><strong>CONDITIONAL</strong></td><td>Hidden on Cover, Slide 8, Quizzes, Stars, Mission Complete</td></tr>';
    html += '<tr><td>Volume &amp; Fullscreen</td><td><strong>RETAINED (ON)*</strong></td><td>Retain until custom Header 1 equivalents are verified</td></tr>';
    html += '<tr><td>Closed Captions &amp; Accessibility</td><td><strong>RETAINED (ON)</strong></td><td>WCAG keyboard, captions &amp; assistive access</td></tr>';
    html += '</tbody></table></div></div>';
    return html;
  }

  function renderButtonInventory() {
    var gc = root.DICV_GLOBAL_CONTROLS;
    var list = (gc && gc.buttonInventory) || [];
    var html = '<div class="sv-card"><div class="sv-vis-bar"><span class="sv-vis-badge sv-vis-reference">Button State Library &amp; Global Inventory (' + list.length + ' Controls)</span></div>';
    html += '<div class="table-wrap"><table><thead><tr><th>Button ID</th><th>Type &amp; Location</th><th>Trigger &amp; Condition</th><th>States &amp; Revisit</th></tr></thead><tbody>';
    list.forEach(function (b) {
      html += '<tr><td><code>' + esc(b.buttonId) + '</code> ' + copyBtn(b.buttonId) + '<br><strong>' + esc(b.displayLabel) + '</strong></td>';
      html += '<td>' + esc(b.systemType || '') + '<br><span class="sv-muted">' + esc(b.location) + '</span></td>';
      html += '<td>' + esc(b.triggerAction) + '<br><span class="sv-muted">Cond: ' + esc(b.condition) + '</span></td>';
      html += '<td>' + esc(b.states) + '<br><span class="sv-muted">Revisit: ' + esc(b.revisitBehavior) + '</span></td></tr>';
    });
    html += '</tbody></table></div></div>';
    return html;
  }

  function renderLifeMeterSpec() {
    var html = '<div class="sv-card">';
    html += '<div class="sv-vis-bar"><span class="sv-vis-badge sv-vis-proposed">Module-Wise Life Meter (Storyline-Owned) + Header 1 Display</span><span class="sv-muted">Header 1 displays <code>LivesRemaining</code> (0–3) read-only</span></div>';
    html += '<div class="sv-h1-sim-bar">';
    html += '<span class="sv-sim-note"><strong>Isolated HTML Preview (Mock Data — Not Authoritative Storyline Proof):</strong> Test <code>WebObjects/dist/Header1/</code> heart states (3, 2, 1, 0, unavailable).</span>';
    html += '<div class="sv-h1-prof-btns" role="group" aria-label="Life Meter Preview Switcher">';
    [{ val: '3', lbl: '3/3' }, { val: '2', lbl: '2/3' }, { val: '1', lbl: '1/3' }, { val: '0', lbl: '0/3' }, { val: 'na', lbl: 'Unavailable (--)' }].forEach(function (opt) {
      html += '<button type="button" class="btn btn-outline sv-mini-btn' + (opt.val === '3' ? ' active' : '') + '" data-sv-life-sim="' + opt.val + '">' + opt.lbl + '</button>';
    });
    html += '</div></div>';
    html += '<div class="sv-h1-iframe-wrap"><iframe id="sv-life-iframe" title="Header 1 Life Meter Preview" src="../WebObjects/dist/Header1/index.html?profile=C&amp;simLife=3&amp;simStars=1"></iframe></div>';
    html += '<div class="sv-h1-action-log" id="sv-life-sim-log">Showing <code>LivesRemaining = 3</code> (3 active red hearts).</div>';
    html += '</div>';

    html += '<div class="sv-card">';
    html += '<div class="sv-vis-bar"><span class="sv-vis-badge sv-vis-reference">Approved Module-Wise Rules &amp; Variable Contract</span></div>';
    html += '<div class="table-wrap"><table><thead><tr><th>Variable(s)</th><th>Type</th><th>Default</th><th>Owner &amp; Rule</th></tr></thead><tbody>';
    html += '<tr><td><code>LivesRemaining</code> ' + copyBtn('LivesRemaining') + '</td><td>Number</td><td><code>3</code></td><td>Active module display read by Header 1 (clamped 0–3; <code>--</code> if unavailable).</td></tr>';
    html += '<tr><td><code>M1_Lives</code> .. <code>M6_Lives</code></td><td>Number (×6)</td><td><code>3</code></td><td>Persistent per-module hearts. Set <code>LivesRemaining = Mx_Lives</code> on module entry (never reset on revisit).</td></tr>';
    html += '<tr><td><code>M1_BonusRefillUsed</code> .. <code>M6_BonusRefillUsed</code></td><td>True/False (×6)</td><td><code>False</code></td><td>Allows max 1 successful Bonus Safety Question refill per module.</td></tr>';
    html += '<tr><td><code>Q002_LifeDeducted</code> .. <code>Q006_R3_LifeDeducted</code></td><td>True/False (×7)</td><td><code>False</code></td><td>Prevents duplicate deduction per question. <strong>No guard on Q001 (excluded).</strong></td></tr>';
    html += '</tbody></table></div></div>';

    html += '<div class="sv-card">';
    html += '<div class="sv-vis-bar"><span class="sv-vis-badge sv-vis-unverified">Pilot Life Meter Test Cases (Storyline &amp; LMS = NOT TESTED)</span></div>';
    html += '<div class="table-wrap"><table><thead><tr><th>Test ID</th><th>Scenario</th><th>Expected Result</th><th>Storyline / LMS Status</th></tr></thead><tbody>';
    var cases = [
      ['TC-LIFE-01', 'Header Display (3, 2, 1, 0, missing)', 'Correct active/grey hearts & accessible text; missing != 0', 'HTML Isolated Verified / Storyline NOT TESTED'],
      ['TC-LIFE-02', 'Incorrect Q004 (first attempt)', 'Deducts 1 heart; sets Q004_LifeDeducted = True', 'NOT TESTED'],
      ['TC-LIFE-03', 'Revisit or retry Q004', 'No additional deduction', 'NOT TESTED'],
      ['TC-LIFE-04', 'Correct Q004', 'No deduction', 'NOT TESTED'],
      ['TC-LIFE-05', 'Zero hearts (0/3)', 'Learning & completion continue unrestricted (no Game Over)', 'NOT TESTED'],
      ['TC-LIFE-06', 'Module independence (M1 vs M2)', 'M1 deductions do not alter M2_Lives', 'NOT TESTED'],
      ['TC-LIFE-07', 'Bonus Safety Question — Correct', 'Restores Mx_Lives = 3, sets Mx_BonusRefillUsed = True', 'NOT TESTED'],
      ['TC-LIFE-08', 'Bonus Safety Question — Incorrect', 'Explanatory feedback; retry without heart deduction', 'NOT TESTED'],
      ['TC-LIFE-09', 'One successful refill per module', 'Second refill unavailable after Mx_BonusRefillUsed == True', 'NOT TESTED'],
      ['TC-LIFE-10', 'Revisit & Oracle LMS Resume', 'Mx_Lives, Qxxx_LifeDeducted & Mx_BonusRefillUsed persist', 'NOT TESTED']
    ];
    cases.forEach(function (c) {
      html += '<tr><td><code>' + c[0] + '</code></td><td>' + esc(c[1]) + '</td><td>' + esc(c[2]) + '</td><td><code>' + esc(c[3]) + '</code></td></tr>';
    });
    html += '</tbody></table></div></div>';
    return html;
  }

  function renderFinal20Tests() {
    var gc = root.DICV_GLOBAL_CONTROLS;
    var tests = (gc && gc.final20Tests) || [];
    var html = '<div class="sv-card"><div class="sv-vis-bar"><span class="sv-vis-badge sv-vis-unverified">20-Scenario Storyline & Oracle LMS QA Matrix</span></div>';
    html += '<div class="table-wrap"><table><thead><tr><th>Scenario</th><th>Status (Record Only With Real Evidence)</th></tr></thead><tbody>';
    tests.forEach(function (t) {
      html += '<tr><td>' + esc(t) + '</td><td><code>NOT TESTED</code></td></tr>';
    });
    html += '</tbody></table></div></div>';
    return html;
  }

  function renderCourseSetupCenter() {
    var hub = root.DICV_HUB_DATA;
    var quizzes = (hub && Array.isArray(hub.quizzes)) ? hub.quizzes : [];
    var html = '';

    // 1. 1920x1080 Canvas & Zone Coordinates
    html += '<div class="sv-card">';
    html += '<div class="sv-vis-bar"><span class="sv-vis-badge sv-vis-reference">1920 × 1080 Slide Canvas &amp; Exact Object Sizes</span><span class="sv-muted">All coordinates in px on 16:9 (1920×1080) stage</span></div>';
    html += '<div class="table-wrap"><table><thead><tr><th>Element</th><th>Where Used</th><th>X, Y</th><th>W × H</th><th>Notes</th></tr></thead><tbody>';
    html += '<tr><td><strong>Storyline Slide (Canvas)</strong></td><td>All Slides (<code>Design → Slide Size</code>)</td><td><code>0, 0</code></td><td><code>1920 × 1080</code></td><td>Base 16:9 canvas</td></tr>';
    html += '<tr><td><strong>Header 1</strong> (<code>WebObjects/dist/Header1/</code>)</td><td>Slide Master Layouts <strong>A, B, C, D</strong></td><td><code>0, 0</code></td><td><code>1920 × 80</code></td><td>HTML Web Object (<code>#080A0C</code>)</td></tr>';
    html += '<tr><td><strong>Header 2</strong> (Native <code>#004355</code>)</td><td>Layout <strong>C-Content</strong> (Training / Quiz / Explanation ONLY)</td><td><code>0, 80</code></td><td><code>1920 × 50</code></td><td>Native Storyline shapes only (0 buttons)</td></tr>';
    html += '<tr><td><strong>Quiz Web Objects</strong> (<code>Q001</code>–<code>Q006_R3</code>)</td><td>Quiz Slides (below Header 1 + Header 2)</td><td><code>0, 130</code></td><td><code>1920 × 950</code></td><td><code>80 + 50 = 130</code> (or <code>H = 890</code> if 60px bottom Next bar)</td></tr>';
    html += '<tr><td><strong>Course Map</strong> (<code>WebObjects/dist/CourseMap/</code>)</td><td><strong>Slide Master Layer</strong> (<code>CourseMapOverlay</code>) &amp; Slide 8</td><td><code>60, 50</code></td><td><code>1800 × 980</code></td><td>Centered on <code>1920×1080</code> over 60% dark backdrop</td></tr>';
    html += '<tr><td><strong>Intro / Overview / Star / Complete</strong></td><td>Slides 1–7, Overviews, Stars, Mission Complete</td><td><code>0, 80</code></td><td><code>1920 × 1000</code></td><td>Header 2 Hidden</td></tr>';
    html += '</tbody></table></div></div>';

    // 2. All Project Variables in One Place
    var globalVars = [
      { name: 'CourseProgressData', type: 'Text', init: '"{}"', status: 'Existing / Baseline', purpose: 'Single source of truth JSON for module/topic completion' },
      { name: 'NavigationMode', type: 'True/False', init: 'False', status: 'Existing / Baseline', purpose: 'Course Map gating (False = Restricted, True = Free)' },
      { name: 'RequestedMission', type: 'Number', init: '0', status: 'Existing / Baseline', purpose: 'Target topic ID (101..106) requested by Course Map jump (0 = idle)' },
      { name: 'CourseMapCloseRequested', type: 'True/False', init: 'False', status: 'Existing / Baseline', purpose: 'Toggled by CourseMap Close Map × button; triggers Hide layer CourseMapOverlay' },
      { name: 'HeaderProfile', type: 'Text', init: '"A"', status: 'New (Hybrid Header)', purpose: 'Set to A / B / C / D per Slide Master layout for Header 1' },
      { name: 'HeaderAction', type: 'Text', init: '""', status: 'New (Hybrid Header)', purpose: 'Receives OPEN_GUIDELINES, OPEN_MAP, TOGGLE_MUTE, EXIT_COURSE, TOGGLE_FULLSCREEN; Storyline resets ""' },
      { name: 'M1_CompletedCount', type: 'Number', init: '0', status: 'New (Header 2)', purpose: 'Presentation-only count (0–6) derived from CourseProgressData for Native Header 2' },
      { name: 'LivesRemaining', type: 'Number', init: '3', status: 'New (Life Meter)', purpose: 'Active module life count (0–3) read by Header 1' },
      { name: 'M1_Lives..M6_Lives', type: 'Number', init: '3', status: 'New (Life Meter)', purpose: 'Persistent per-module hearts (6 separate Number variables)' },
      { name: 'M1_BonusRefillUsed..M6_BonusRefillUsed', type: 'True/False', init: 'False', status: 'New (Life Meter)', purpose: 'Guards max 1 successful bonus refill per module (6 separate variables)' },
      { name: 'Q002..Q006_R3_LifeDeducted', type: 'True/False', init: 'False', status: 'New (Life Meter)', purpose: 'Per-question deduction guard (7 variables: Q002, Q003, Q004, Q005, Q006_R1, Q006_R2, Q006_R3; exclude Q001)' }
    ];

    html += '<div class="sv-card">';
    html += '<div class="sv-vis-bar"><span class="sv-vis-badge sv-vis-proposed">All Project Variables — One-Pass Creation List</span><span class="sv-muted">Case-sensitive · Home → Manage Project Variables (x)</span></div>';
    html += '<div class="table-wrap"><table><thead><tr><th>Variable Name</th><th>Type</th><th>Default</th><th>Status</th><th>Purpose</th></tr></thead><tbody>';
    globalVars.forEach(function (v) {
      html += '<tr><td><code>' + esc(v.name) + '</code> ' + copyBtn(v.name) + '</td><td>' + esc(v.type) + '</td><td><code>' + esc(v.init) + '</code></td><td><strong>' + esc(v.status) + '</strong></td><td>' + esc(v.purpose) + '</td></tr>';
    });
    quizzes.forEach(function (q) {
      (q.variables || []).forEach(function (v) {
        html += '<tr><td><code>' + esc(v.name) + '</code> ' + copyBtn(v.name) + '</td><td>' + esc(v.type) + '</td><td><code>' + esc(v.initial) + '</code></td><td>Existing / Baseline</td><td>' + esc(v.purpose) + '</td></tr>';
      });
    });
    html += '</tbody></table></div></div>';

    // 3. Non-Variable Updates + 7 Critical Storyline Rules
    html += '<div class="sv-card">';
    html += '<div class="sv-vis-bar"><span class="sv-vis-badge sv-vis-actual">Architecture Status &amp; 7 Critical Storyline 360 Rules</span></div>';
    html += '<div class="table-wrap"><table><thead><tr><th>Item</th><th>Status</th><th>Storyline Configuration Rule</th></tr></thead><tbody>';
    html += '<tr><td><strong>Header 1</strong> (<code>WebObjects/dist/Header1/</code>)</td><td><strong>New (Hybrid)</strong></td><td>HTML Web Object on Layouts A–D at <code>0,0</code> (<code>1920×80</code>); Storyline resets <code>HeaderAction = ""</code> as final trigger.</td></tr>';
    html += '<tr><td><strong>Header 2</strong> (Native <code>#004355</code>)</td><td><strong>Modified (Native)</strong></td><td>Native Storyline shapes only on Training/Quiz/Explanation slides (0 buttons, 0 Web Objects).</td></tr>';
    html += '<tr><td><strong>Slide Master Layouts A–D</strong></td><td><strong>Modified</strong></td><td>Set <code>HeaderProfile</code> at timeline start; place <code>Adjust variable</code> triggers BEFORE <code>Jump/Hide</code> triggers.</td></tr>';
    html += '<tr><td><strong>Modern Player</strong></td><td><strong>Modified</strong></td><td>Prev, Next, Menu, Submit = <strong>OFF</strong>; Play/Pause, Seekbar, Volume, Captions, Accessibility, Fullscreen = <strong>ON</strong>.</td></tr>';
    html += '<tr><td><strong>Per-Slide Properties (Cog)</strong></td><td><strong>Baseline Rule</strong></td><td>Uncheck Prev/Next/Submit on every slide; keep Quizzes/Map on <code>Automatically decide</code>/<code>Reset</code> and media slides on <code>Resume saved state</code>.</td></tr>';
    html += '<tr><td><strong>Web Object Settings</strong></td><td><strong>Baseline Rule</strong></td><td>Always select <strong>Display in slide</strong> + <strong>Load automatically</strong>, pointing to <code>WebObjects/dist/...</code>.</td></tr>';
    html += '<tr><td><strong>SCORM &amp; LMS Verification</strong></td><td><code>NOT TESTED</code></td><td>Track via Completion Trigger on Mission Complete (not slide count); test Mute, Fullscreen, Slide 8 Lightbox jump &amp; Resume in Oracle LMS.</td></tr>';
    html += '</tbody></table></div></div>';

    return html;
  }

  function renderCenterWorkspace(slide, quiz, allNodes) {
    var idx = -1;
    for (var i = 0; i < allNodes.length; i++) {
      if (allNodes[i].id === slide.id) { idx = i; break; }
    }
    var prevNode = idx > 0 ? allNodes[idx - 1] : null;
    var nextNode = idx >= 0 && idx < allNodes.length - 1 ? allNodes[idx + 1] : null;

    var vBadge = slide.visualBadge || 'Reference';
    var html = '<section class="sv-center" aria-label="Visual slide workspace">';
    html += '<div class="sv-center-head"><div>';
    html += '<div class="sv-kicker">' + esc(slide.sceneName) + ' · ' + esc(slide.slideType) + ' <span class="sv-vis-badge ' + visualBadgeClass(vBadge) + '">' + esc(vBadge) + '</span></div>';
    var headingPrefix = slide.originalNo ? ('Slide ' + slide.originalNo) : esc(slide.no);
    if (slide.id === 's22') headingPrefix = 'Original Slide 22 (Moved after Star 1)';
    html += '<h2>' + headingPrefix + ' — ' + esc(slide.title) + '</h2>';
    html += '</div><div class="sv-nav-btns">';
    if (prevNode) html += '<button type="button" class="btn btn-outline sv-mini-btn" data-sv-slide="' + esc(prevNode.id) + '">← Prev</button>';
    if (nextNode) html += '<button type="button" class="btn btn-primary sv-mini-btn" data-sv-slide="' + esc(nextNode.id) + '">Next →</button>';
    html += '</div></div>';

    if (quiz) {
      html += '<div class="preview-banner">';
      html += '<div><span class="sv-vis-badge sv-vis-actual">Actual Web Object</span> <strong>Isolated Quiz Preview (' + esc(quiz.id) + '):</strong> Local sandbox only — never writes to Oracle LMS.</div>';
      html += '<div class="sv-toggle-group">';
      html += '<button type="button" class="tab-btn' + (centerViewMode === 'live' ? ' active' : '') + '" data-sv-mode="live">Live Web Object</button>';
      if (quiz.screenshotUrl) {
        html += '<button type="button" class="tab-btn' + (centerViewMode === 'screenshot' ? ' active' : '') + '" data-sv-mode="screenshot">Verified Screenshot</button>';
      }
      html += '</div></div>';

      if (centerViewMode === 'screenshot' && quiz.screenshotUrl) {
        html += '<div class="sv-stage-box"><img class="sv-screenshot-img" src="' + esc(quiz.screenshotUrl) + '" alt="' + esc(quiz.id) + ' verified screenshot"></div>';
      } else {
        var cw = (quiz.canvas && quiz.canvas.width) || 1920;
        var ch = (quiz.canvas && quiz.canvas.height) || 1080;
        var scale = Math.min(0.38, 560 / cw);
        html += '<div class="sv-stage-box"><div class="sv-iframe-shell" style="width:' + Math.round(cw * scale) + 'px;height:' + Math.round(ch * scale) + 'px;">';
        html += '<iframe id="sv-preview-iframe" title="' + esc(quiz.id) + ' isolated preview" src="' + esc(quiz.previewUrl) + '" style="width:' + cw + 'px;height:' + ch + 'px;transform:scale(' + scale.toFixed(4) + ');transform-origin:top left;"></iframe>';
        html += '</div></div>';
        html += '<div class="sv-sim-bar">';
        html += '<button type="button" class="btn btn-primary sv-mini-btn" id="sv-sim-reveal">Simulate Reveal</button>';
        html += '<button type="button" class="btn btn-secondary sv-mini-btn" id="sv-sim-reset">Reset Attempt</button>';
        html += '<button type="button" class="btn btn-outline sv-mini-btn" id="sv-sim-reload">Reload</button>';
        html += '<a class="btn btn-outline sv-mini-btn" href="' + esc(quiz.previewUrl) + '" target="_blank">Open Full Quiz ↗</a>';
        if (quiz.motionPreviewUrl) html += '<a class="btn btn-outline sv-mini-btn" href="' + esc(quiz.motionPreviewUrl) + '" target="_blank">Motion Prototype ↗</a>';
        html += '<button type="button" class="btn btn-outline sv-mini-btn" data-quiz="' + esc(quiz.id) + '">Quiz Library Details</button>';
        html += '</div>';
        html += '<div class="mock-log" id="sv-mock-log"><div>Isolated bridge ready for ' + esc(quiz.id) + '. Submit or click Simulate Reveal.</div></div>';
      }
    } else if (slide.isCourseMap) {
      var cmUrl = slide.webObjectPath ? (slide.webObjectPath + 'index.html') : '../WebObjects/dist/CourseMap/index.html';
      var cmScale = 0.29;
      html += '<div class="preview-banner"><div><span class="sv-vis-badge sv-vis-actual">Actual Course Map</span> <strong>Slide 8 is the ONLY Course Map slide:</strong> <code>WebObjects/dist/CourseMap/</code></div>';
      html += '<a class="btn btn-outline sv-mini-btn" href="' + esc(cmUrl) + '" target="_blank">Open Full Course Map ↗</a></div>';
      html += '<div class="sv-stage-box"><div class="sv-iframe-shell" style="width:' + Math.round(1920 * cmScale) + 'px;height:' + Math.round(1080 * cmScale) + 'px;">';
      html += '<iframe id="sv-coursemap-iframe" title="Course Map Preview" src="' + esc(cmUrl) + '" style="width:1920px;height:1080px;transform:scale(' + cmScale + ');transform-origin:top left;"></iframe>';
      html += '</div></div>';
      html += renderCourseMapReference();
    } else if (slide.slideType === 'Star Earned' || slide.slideType === 'Mission Complete') {
      html += renderStarOrMissionPreview(slide);
    } else if (slide.id === 'ui_course_setup') {
      html += renderCourseSetupCenter();
    } else if (slide.id === 'ui_life_meter') {
      html += renderLifeMeterSpec();
    } else if (slide.id === 'ui_header1' || slide.id === 'ui_global_map' || slide.id === 'ui_master_layouts' || slide.id === 'ui_header2') {
      html += renderBlackHeaderPreview(slide);
    } else if (slide.id === 'ui_player_props') {
      html += renderPlayerStrategy();
    } else if (slide.id === 'ui_nav_buttons') {
      html += renderButtonInventory();
    } else if (slide.id === 'qa_publish') {
      html += renderFinal20Tests();
    } else {
      html += '<div class="sv-mockup-box">';
      html += '<div class="sv-vis-bar"><span class="sv-vis-badge ' + visualBadgeClass(vBadge) + '">' + esc(vBadge) + '</span><span class="sv-muted">' + esc(slide.originStatus || 'Baseline') + ' · Needs Storyline Verification in .story</span></div>';
      html += '<h3>' + esc(slide.title) + '</h3>';
      html += '<p>' + esc(slide.purpose) + '</p>';
      html += '<div class="sv-mockup-cols">';
      html += '<div><strong>What to Build in Storyline 360</strong><ul>' + (slide.whatToBuild || []).map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul></div>';
      html += '<div><strong>Navigation & Completion</strong><p>' + esc(slide.navigation) + '</p><p><strong>Completion:</strong> ' + esc(slide.completionRule) + '</p></div>';
      html += '</div></div>';
    }

    html += '</section>';
    return html;
  }

  function renderVariablesSection(slide, quiz) {
    var rows = [];
    if (quiz && Array.isArray(quiz.variables)) {
      quiz.variables.forEach(function (v) {
        rows.push({ name: v.name, type: v.type, init: v.initial, purpose: v.purpose });
      });
    }
    if (slide.isCourseMap || slide.id === 'project_setup' || slide.id === 'master' || slide.id === 's2' || slide.id === 's4' || slide.id === 's11' || slide.id === 's13' || slide.id === 's15' || slide.id === 's17' || slide.id === 's21' || slide.slideType === 'Star Earned' || slide.id === 'mission_complete') {
      rows.push({ name: 'NavigationMode', type: 'True/False', init: 'False', purpose: 'False = Sequential linear lock; True = Free navigation (L-key toggle).' });
      rows.push({ name: 'CourseProgressData', type: 'Text', init: '""', purpose: 'Authoritative serialized topic states (101–106: 0=Not Started, 1=In Progress, 2=Completed).' });
      rows.push({ name: 'RequestedMission', type: 'Number', init: '0', purpose: 'Requested topic destination from Slide 8 Course Map.' });
    }
    if (!rows.length) {
      return '<p class="sv-muted">No slide-specific variables required. Shared Course Map variables are configured in Project Setup.</p>';
    }
    var html = '<div class="table-wrap"><table><thead><tr><th>Variable</th><th>Type</th><th>Initial</th><th>Purpose</th></tr></thead><tbody>';
    rows.forEach(function (r) {
      html += '<tr><td><code>' + esc(r.name) + '</code> ' + copyBtn(r.name) + '</td><td>' + esc(r.type) + '</td><td><code>' + esc(r.init) + '</code></td><td>' + esc(r.purpose) + '</td></tr>';
    });
    html += '</tbody></table></div>';
    return html;
  }

  function renderTriggersSection(slide, quiz) {
    var html = '';
    if (quiz && Array.isArray(quiz.journeySteps) && quiz.journeySteps.length) {
      html += '<div class="flow-track">';
      quiz.journeySteps.forEach(function (step, i) {
        if (i > 0) html += '<span class="flow-arrow">→</span>';
        html += '<div class="flow-node' + (i === 1 ? ' highlight' : '') + '">' + esc(step) + '</div>';
      });
      html += '</div>';
    }
    html += '<p><strong>Required Trigger Actions:</strong> ' + esc(slide.navigation) + '</p>';
    html += '<p><strong>Completion Gate:</strong> ' + esc(slide.completionRule) + '</p>';
    if (quiz && quiz.overview && quiz.overview.bridgeProtocol) {
      html += '<p><strong>Verified Bridge Protocol:</strong> <code>' + esc(quiz.overview.bridgeProtocol) + '</code> ' + copyBtn(quiz.overview.bridgeProtocol, 'Copy') + '</p>';
    }
    return html;
  }

  function renderTroubleshootingSection(slide, quiz) {
    var hub = root.DICV_HUB_DATA;
    var allIssues = (hub && Array.isArray(hub.troubleshooting)) ? hub.troubleshooting : [];
    var matched = allIssues.filter(function (it) {
      var hay = ((it.appliesTo || '') + ' ' + (it.symptom || '')).toLowerCase();
      if (quiz && hay.indexOf(quiz.id.toLowerCase()) !== -1) return true;
      if (quiz && quiz.id.indexOf('Q006') === 0 && hay.indexOf('q006') !== -1) return true;
      if ((slide.isCourseMap || slide.id === 'master') && (hay.indexOf('map') !== -1 || hay.indexOf('navigation') !== -1 || hay.indexOf('lms') !== -1)) return true;
      return hay.indexOf('all quizzes') !== -1;
    }).slice(0, 5);

    var html = '';
    if (Array.isArray(slide.unverifiedNotes) && slide.unverifiedNotes.length) {
      html += '<div class="sv-verify-box"><strong>Needs Storyline Verification:</strong><ul>';
      slide.unverifiedNotes.forEach(function (n) { html += '<li>' + esc(n) + '</li>'; });
      html += '</ul></div>';
    }
    if (!matched.length) {
      html += '<p class="sv-muted">No slide-specific defects logged for this item. See Troubleshooting Center for global Storyline/LMS notes.</p>';
      return html;
    }
    matched.forEach(function (it) {
      html += '<div class="sv-issue-card">';
      html += '<div><strong>' + esc(it.id) + ' — ' + esc(it.symptom) + '</strong> <span class="sv-muted">(' + esc(it.appliesTo) + ')</span></div>';
      html += '<div><strong>Cause:</strong> ' + esc(it.cause) + '</div>';
      html += '<div><strong>Fix:</strong> ' + esc(it.fix) + '</div>';
      html += '</div>';
    });
    return html;
  }

  function renderGuidedMode(slide, quiz, st) {
    var steps = slide.clickByClick || [];
    if (!steps.length) {
      return '<div class="sv-card"><p class="sv-muted">No guided steps defined yet for this placeholder.</p></div>';
    }
    if (guidedStepIdx >= steps.length) guidedStepIdx = steps.length - 1;
    if (guidedStepIdx < 0) guidedStepIdx = 0;

    var step = steps[guidedStepIdx];
    var stepDone = !!(st.stepChecks && st.stepChecks[String(guidedStepIdx)]);

    var html = '<div class="sv-card sv-guided-card">';
    html += '<div class="sv-guided-head"><strong>Step ' + (guidedStepIdx + 1) + ' of ' + steps.length + ': ' + esc(step.what) + '</strong>';
    html += '<label class="sv-step-done-lbl"><input type="checkbox" data-sv-step-check="' + guidedStepIdx + '"' + (stepDone ? ' checked' : '') + '> Done</label></div>';
    html += '<div class="sv-guided-row"><strong>What you are creating:</strong> ' + esc(step.what) + '</div>';
    html += '<div class="sv-guided-row"><strong>Where to click in Storyline:</strong> ' + esc(step.where) + '</div>';
    html += '<div class="sv-guided-row"><strong>What to insert / enter:</strong> ' + esc(step.how) + '</div>';
    html += '<div class="sv-guided-row"><strong>Expected result:</strong> ' + esc(step.expected) + '</div>';
    html += '<div class="sv-guided-row"><strong>Test it:</strong> ' + esc(step.test || 'Preview slide in Storyline 360 and verify expected result.') + '</div>';
    if (step.mistakes) {
      html += '<div class="sv-guided-row sv-guided-warn"><strong>Common mistakes:</strong> ' + esc(step.mistakes) + '</div>';
    }

    html += '<div class="sv-guided-actions">';
    if (quiz) {
      html += copyBtn(quiz.id + '_Done', 'Copy ' + quiz.id + '_Done');
      html += '<a class="btn btn-outline sv-mini-btn" href="' + esc(quiz.zipFile) + '" download>Download ZIP</a>';
    } else if (slide.isCourseMap) {
      html += copyBtn('RequestedMission', 'Copy RequestedMission');
      html += copyBtn('CourseProgressData', 'Copy CourseProgressData');
    } else if (slide.id === 'project_setup' || slide.id === 'master') {
      html += copyBtn('NavigationMode', 'Copy NavigationMode');
    }
    html += '<button type="button" class="btn btn-outline sv-mini-btn" data-sv-rmode="advanced">Technical Details</button>';
    html += '</div>';

    html += '<div class="sv-guided-nav">';
    html += '<button type="button" class="btn btn-outline sv-mini-btn" id="sv-g-prev"' + (guidedStepIdx === 0 ? ' disabled' : '') + '>← Previous Step</button>';
    html += '<button type="button" class="btn btn-primary sv-mini-btn" id="sv-g-next"' + (guidedStepIdx >= steps.length - 1 ? ' disabled' : '') + '>Next Step →</button>';
    html += '</div></div>';

    // Slide-specific Header Visibility & Slide Properties
    var gc = root.DICV_GLOBAL_CONTROLS;
    var prof = (gc && typeof gc.getSlideControlProfile === 'function' && slide.sceneId !== 'global_ui' && slide.sceneId !== 'setup' && slide.id !== 'qa_publish')
      ? gc.getSlideControlProfile(slide)
      : null;
    if (prof) {
      html += '<div class="sv-card sv-props-card"><strong>Header Visibility, Slide Properties &amp; Navigation</strong>';
      html += '<div class="sv-props-grid">';
      html += '<div><strong>Master Layout:</strong> ' + esc(prof.masterLayout) + '</div>';
      html += '<div><strong>Header 1 (#080A0C):</strong> ' + esc(prof.header1) + '</div>';
      html += '<div><strong>Header 2 (#004355):</strong> ' + esc(prof.header2) + '</div>';
      html += '<div><strong>Native Player:</strong> ' + esc(prof.nativePlayer) + '</div>';
      html += '<div><strong>Slide Advancement:</strong> ' + esc(prof.advancement) + '</div>';
      html += '<div><strong>Seekbar:</strong> ' + esc(prof.seekbar) + '</div>';
      html += '<div><strong>When Revisiting:</strong> ' + esc(prof.revisit) + '</div>';
      html += '</div></div>';
    }

    // Slide-specific checklist
    var items = slide.checklistItems || [];
    if (items.length) {
      html += '<div class="sv-card sv-checklist-card"><strong>Slide Build Checklist</strong>';
      html += '<ul class="sv-check-list">';
      items.forEach(function (label, idx) {
        var checked = !!st.checks[String(idx)];
        html += '<li><label><input type="checkbox" data-sv-check="' + idx + '"' + (checked ? ' checked' : '') + '> <span>' + esc(label) + '</span></label></li>';
      });
      html += '</ul></div>';
    }
    return html;
  }

  function renderAdvancedDetails(slide, quiz) {
    var timeline = slide.storylineTimeline || { storyline: [], webObject: [] };
    var webObjHtml = quiz
      ? '<p><strong>Package Folder:</strong> <code>' + esc(quiz.distFolder) + '</code> ' + copyBtn(quiz.distFolder) + '</p>' +
        '<p><strong>ZIP Package:</strong> <code>' + esc(quiz.zipFile) + '</code> ' + copyBtn(quiz.zipFile) + '</p>' +
        '<p><strong>Canvas:</strong> ' + esc(quiz.canvas.width + ' × ' + quiz.canvas.height) + ' px (' + esc(quiz.interactionType) + ')</p>'
      : (slide.isCourseMap
        ? '<p><strong>Course Map Package:</strong> <code>' + esc(slide.webObjectPath || '../WebObjects/dist/CourseMap/') + '</code> ' + copyBtn(slide.webObjectWinPath || 'WebObjects/dist/CourseMap/') + '</p><p>Insert on Slide 8 ONLY at <code>1920 × 1080</code> (Display in slide). Do NOT embed in Slide Master.</p>'
        : '<p class="sv-muted">No HTML Web Object required on this slide. Build natively in Storyline 360.</p>');

    var feedbackHtml = (quiz && Array.isArray(quiz.feedbackLayers) && quiz.feedbackLayers.length)
      ? '<div class="table-wrap"><table><thead><tr><th>Layer</th><th>When Shown</th><th>Effect</th></tr></thead><tbody>' +
        quiz.feedbackLayers.map(function (fl) {
          return '<tr><td><strong>' + esc(fl.name) + '</strong></td><td>' + esc(fl.when) + '</td><td>' + esc(fl.behavior) + '</td></tr>';
        }).join('') + '</tbody></table></div>'
      : '<p class="sv-muted">No quiz feedback layers required on this item.</p>';

    var testingHtml = quiz
      ? '<p><strong>Local Web Object Status:</strong> ' + esc((quiz.testingStatus && quiz.testingStatus.automated) || 'See Testing tab') + '</p>' +
        '<p><strong>Storyline / LMS Status:</strong> ' + esc((quiz.testingStatus && quiz.testingStatus.storyline) || 'NOT TESTED (Needs Storyline Verification)') + '</p>'
      : '<p><strong>Status:</strong> NOT TESTED in Storyline 360 / Oracle LMS.</p>';

    var filesHtml = quiz
      ? '<p><strong>Source:</strong> <code>' + esc(quiz.srcFolder) + '</code></p>' +
        '<p><strong>Dist:</strong> <code>' + esc(quiz.distFolder) + '</code></p>' +
        '<p><strong>ZIP:</strong> <a href="' + esc(quiz.zipFile) + '" download>Download ZIP</a></p>'
      : '<p><strong>Course Map Host JS:</strong> <code>WebObjects/coursemap/coursemap-storyline-host.js</code></p>' +
        '<p><strong>Course Map Data JS:</strong> <code>WebObjects/coursemap/coursemap-data.js</code></p>';

    var sections = [
      { title: '1. Slide Overview', open: true, body: '<p><strong>Origin:</strong> ' + esc(slide.originStatus || 'Baseline') + (slide.originalNo ? ' (Original Slide ' + slide.originalNo + ')' : '') + '</p><p><strong>Purpose:</strong> ' + esc(slide.purpose) + '</p>' },
      { title: '2. Objects & Content', open: false, body: '<ul>' + (slide.whatToBuild || []).map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul>' },
      { title: '3. Web Object Installation', open: !!quiz || !!slide.isCourseMap, body: webObjHtml },
      { title: '4. Variables', open: !!quiz || !!slide.isCourseMap || slide.id === 'project_setup' || slide.id === 'master', body: renderVariablesSection(slide, quiz) },
      { title: '5. Triggers & Execution Order', open: false, body: renderTriggersSection(slide, quiz) },
      { title: '6. Feedback Layers', open: false, body: feedbackHtml },
      { title: '7. Animations & Timeline', open: false, body: '<p><strong>Storyline-controlled:</strong> ' + esc((timeline.storyline || []).join('; ') || 'None') + '</p><p><strong>HTML Web Object-controlled:</strong> ' + esc((timeline.webObject || []).join('; ') || 'None') + '</p>' },
      { title: '8. Navigation', open: false, body: '<p>' + esc(slide.navigation) + '</p>' },
      { title: '9. Completion, Stars & Unlocking', open: false, body: '<p>' + esc(slide.completionRule) + '</p>' },
      { title: '10. Revisit & Resume', open: false, body: '<p>' + esc(slide.revisitResume) + '</p>' },
      { title: '11. Testing', open: false, body: testingHtml },
      { title: '12. Troubleshooting', open: false, body: renderTroubleshootingSection(slide, quiz) },
      { title: '13. Files & Assets', open: false, body: filesHtml }
    ];

    var html = '';
    sections.forEach(function (sec) {
      html += '<details class="sv-details"' + (sec.open ? ' open' : '') + '>';
      html += '<summary>' + esc(sec.title) + '</summary>';
      html += '<div class="sv-details-body">' + sec.body + '</div>';
      html += '</details>';
    });
    return html;
  }

  function renderVerificationMatrix(slide, quiz, st) {
    var localStatus = (quiz || slide.isCourseMap) ? 'PASS (Standalone)' : 'N/A (Native Slide)';
    var qa = st.qa || {};
    var stages = [
      { key: 'storyline', label: 'Storyline Integration', def: 'NOT TESTED' },
      { key: 'published', label: 'Published Course', def: 'NOT TESTED' },
      { key: 'lms', label: 'Oracle LMS', def: 'NOT TESTED' }
    ];
    var html = '<div class="sv-card sv-qa-card"><strong>QA & Verification Status</strong>';
    html += '<div class="sv-qa-row"><span>Local Web Object:</span><span class="sv-qa-pill">' + esc(localStatus) + '</span></div>';
    stages.forEach(function (s) {
      var val = qa[s.key] || s.def;
      html += '<div class="sv-qa-row"><span>' + esc(s.label) + ':</span>';
      html += '<select class="sv-qa-sel" data-sv-qa="' + esc(s.key) + '" aria-label="' + esc(s.label) + '">';
      ['NOT TESTED', 'PASS', 'FAIL', 'BLOCKED'].forEach(function (opt) {
        html += '<option value="' + opt + '"' + (val === opt ? ' selected' : '') + '>' + opt + '</option>';
      });
      html += '</select></div>';
    });
    html += '</div>';
    return html;
  }

  function renderRightInspector(slide, quiz, store) {
    var st = getSlideState(store, slide.id);
    var html = '<aside class="sv-right" aria-label="Storyline build guide">';

    html += '<div class="sv-card sv-checklist-card">';
    html += '<div class="sv-check-head"><strong>Authoring Status</strong>';
    html += '<select id="sv-status-select" aria-label="Authoring status">';
    ['Not Started', 'In Progress', 'Completed', 'Needs Verification'].forEach(function (opt) {
      html += '<option value="' + esc(opt) + '"' + (st.status === opt ? ' selected' : '') + '>' + esc(opt) + '</option>';
    });
    html += '</select></div>';
    html += '<div class="sv-dev-aid-note">Local browser authoring tracker only — NOT Storyline or Oracle LMS test proof.</div>';
    html += '<div class="sv-persp-tabs">';
    html += '<button type="button" class="sv-persp-btn' + (rightMode === 'guided' ? ' active' : '') + '" data-sv-rmode="guided">Build in Storyline</button>';
    html += '<button type="button" class="sv-persp-btn' + (rightMode === 'advanced' ? ' active' : '') + '" data-sv-rmode="advanced">Advanced Details</button>';
    html += '</div></div>';

    if (rightMode === 'guided') {
      html += renderGuidedMode(slide, quiz, st);
    } else {
      html += renderAdvancedDetails(slide, quiz);
    }

    html += renderVerificationMatrix(slide, quiz, st);
    html += '</aside>';
    return html;
  }

  function render(requestedSlideId) {
    var allNodes = getAllNodes();
    if (!allNodes.length) {
      return '<div class="panel"><h2>Story View Unavailable</h2><p>Could not load <code>window.DICV_STORY_MANIFEST</code>.</p></div>';
    }
    if (requestedSlideId && findSlide(requestedSlideId)) {
      if (selectedSlideId !== requestedSlideId) guidedStepIdx = 0;
      selectedSlideId = requestedSlideId;
    }
    var slide = findSlide(selectedSlideId) || allNodes[0];
    selectedSlideId = slide.id;

    var store = loadStore();
    var quiz = getQuizData(slide.quizId);

    var html = '<div class="story-builder-grid">';
    html += renderLeftRail(allNodes, store, slide.id);
    html += renderCenterWorkspace(slide, quiz, allNodes);
    html += renderRightInspector(slide, quiz, store);
    html += '</div>';
    return html;
  }

  function appendSimLog(msg) {
    var log = document.getElementById('sv-mock-log');
    if (!log) return;
    var line = document.createElement('div');
    line.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
    log.prepend(line);
  }

  function bind(appEl, rerender) {
    if (!appEl) return;

    appEl.querySelectorAll('[data-sv-slide]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectedSlideId = btn.getAttribute('data-sv-slide');
        guidedStepIdx = 0;
        centerViewMode = 'live';
        if (typeof rerender === 'function') rerender();
      });
    });

    appEl.querySelectorAll('[data-sv-persp]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        leftPerspective = btn.getAttribute('data-sv-persp') || 'journey';
        if (typeof rerender === 'function') rerender();
      });
    });

    appEl.querySelectorAll('[data-sv-rmode]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        rightMode = btn.getAttribute('data-sv-rmode') || 'guided';
        if (typeof rerender === 'function') rerender();
      });
    });

    appEl.querySelectorAll('[data-sv-mode]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        centerViewMode = btn.getAttribute('data-sv-mode') || 'live';
        if (typeof rerender === 'function') rerender();
      });
    });

    var gPrev = document.getElementById('sv-g-prev');
    var gNext = document.getElementById('sv-g-next');
    if (gPrev) gPrev.addEventListener('click', function () { if (guidedStepIdx > 0) { guidedStepIdx--; if (typeof rerender === 'function') rerender(); } });
    if (gNext) gNext.addEventListener('click', function () { guidedStepIdx++; if (typeof rerender === 'function') rerender(); });

    var nextTodoBtn = document.getElementById('sv-next-todo');
    if (nextTodoBtn) {
      nextTodoBtn.addEventListener('click', function () {
        var all = getAllNodes();
        var store = loadStore();
        for (var i = 0; i < all.length; i++) {
          if (getSlideState(store, all[i].id).status !== 'Completed') {
            selectedSlideId = all[i].id;
            guidedStepIdx = 0;
            centerViewMode = 'live';
            if (typeof rerender === 'function') rerender();
            return;
          }
        }
      });
    }

    var statusSel = document.getElementById('sv-status-select');
    if (statusSel) {
      statusSel.addEventListener('change', function () {
        var store = loadStore();
        var cur = getSlideState(store, selectedSlideId);
        cur.status = statusSel.value;
        store[selectedSlideId] = cur;
        saveStore(store);
        if (typeof rerender === 'function') rerender();
      });
    }

    appEl.querySelectorAll('[data-sv-check]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        var idx = cb.getAttribute('data-sv-check');
        var store = loadStore();
        var cur = getSlideState(store, selectedSlideId);
        cur.checks[idx] = !!cb.checked;
        store[selectedSlideId] = cur;
        saveStore(store);
      });
    });

    appEl.querySelectorAll('[data-sv-step-check]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        var idx = cb.getAttribute('data-sv-step-check');
        var store = loadStore();
        var cur = getSlideState(store, selectedSlideId);
        cur.stepChecks[idx] = !!cb.checked;
        store[selectedSlideId] = cur;
        saveStore(store);
      });
    });

    appEl.querySelectorAll('[data-sv-qa]').forEach(function (sel) {
      sel.addEventListener('change', function () {
        var key = sel.getAttribute('data-sv-qa');
        var store = loadStore();
        var cur = getSlideState(store, selectedSlideId);
        cur.qa[key] = sel.value;
        store[selectedSlideId] = cur;
        saveStore(store);
      });
    });

    var iframe = document.getElementById('sv-preview-iframe');
    var slide = findSlide(selectedSlideId);
    var qid = (slide && slide.quizId) || '';
    var btnReveal = document.getElementById('sv-sim-reveal');
    var btnReset = document.getElementById('sv-sim-reset');
    var btnReload = document.getElementById('sv-sim-reload');

    if (btnReveal && iframe) {
      btnReveal.addEventListener('click', function () {
        iframe.contentWindow.postMessage({ type: 'QUIZ_REVEAL_ANSWERS', payload: { quizId: qid } }, '*');
        iframe.contentWindow.postMessage({ type: 'Q004_REVEAL', quizId: 'Q004' }, '*');
        appendSimLog('Sent isolated reveal signal to ' + qid);
      });
    }

    var lifeIframe = document.getElementById('sv-life-iframe');
    var lifeLog = document.getElementById('sv-life-sim-log');
    if (lifeIframe) {
      appEl.querySelectorAll('[data-sv-life-sim]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var v = btn.getAttribute('data-sv-life-sim');
          appEl.querySelectorAll('[data-sv-life-sim]').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          lifeIframe.src = '../WebObjects/dist/Header1/index.html?profile=C&simLife=' + encodeURIComponent(v) + '&simStars=1';
          if (lifeLog) {
            lifeLog.innerHTML = (v === 'na')
              ? 'Simulated missing/uninitialized <code>LivesRemaining</code> → displays <code>--</code> (unavailable, NOT 0).'
              : 'Simulated <code>LivesRemaining = ' + esc(v) + '</code> (' + esc(v) + ' of 3 active hearts).';
          }
        });
      });
    }

    var h1Iframe = document.getElementById('sv-h1-iframe');
    var h1Log = document.getElementById('sv-h1-action-log');
    if (h1Iframe) {
      appEl.querySelectorAll('[data-sv-h1-profile]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var prof = btn.getAttribute('data-sv-h1-profile');
          appEl.querySelectorAll('[data-sv-h1-profile]').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          h1Iframe.src = '../WebObjects/dist/Header1/index.html?profile=' + encodeURIComponent(prof) + '&simLife=3&simStars=1';
          if (h1Log) h1Log.innerHTML = 'Switched isolated Header 1 preview to <code>HeaderProfile = "' + esc(prof) + '"</code> (mock data).';
        });
      });
      if (!root._dicvH1MsgBound) {
        root._dicvH1MsgBound = true;
        root.addEventListener('message', function (ev) {
          var d = ev && ev.data;
          if (d && d.source === 'DICV_HEADER1_WEBOBJECT' && d.type === 'HEADER_ACTION') {
            var logEl = document.getElementById('sv-h1-action-log');
            var act = (d.payload && d.payload.action) || '';
            if (logEl) {
              logEl.innerHTML = 'Emitted <code>HeaderAction = "' + esc(act) + '"</code> → Storyline Slide Master executes native trigger for <code>' + esc(act) + '</code>.';
            }
          }
        });
      }
    }
    if (btnReset && iframe) {
      btnReset.addEventListener('click', function () {
        iframe.contentWindow.postMessage({ type: 'QUIZ_RESET_ATTEMPT', payload: { quizId: qid } }, '*');
        iframe.contentWindow.postMessage({ type: 'Q004_RESET', quizId: 'Q004' }, '*');
        appendSimLog('Sent isolated reset signal to ' + qid);
      });
    }
    if (btnReload && iframe) {
      btnReload.addEventListener('click', function () {
        iframe.src = iframe.src;
        appendSimLog('Reloaded ' + qid + ' preview');
      });
    }
  }

  if (typeof root.addEventListener === 'function') {
    root.addEventListener('message', function (e) {
      if (typeof document === 'undefined') return;
      var iframe = document.getElementById('sv-preview-iframe');
      if (!iframe || e.source !== iframe.contentWindow || !e.data) return;
      var slide = findSlide(selectedSlideId);
      var qid = (slide && slide.quizId) || 'Quiz';
      if (e.data.type === 'QUIZ_SUBMIT_REQUEST' || e.data.type === 'Q004_SUBMIT') {
        appendSimLog('Preview Submit captured (' + qid + '): ' + JSON.stringify(e.data.payload || e.data));
      } else if (e.data.type === 'QUIZ_DRAFT_CHANGE' || e.data.type === 'Q004_DRAFT') {
        appendSimLog('Draft change (' + qid + ')');
      }
    });
  }

  root.DICV_STORY_VIEW = {
    render: render,
    bind: bind,
    getSelectedSlideId: function () { return selectedSlideId; },
    setSelectedSlideId: function (id) { selectedSlideId = id; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
