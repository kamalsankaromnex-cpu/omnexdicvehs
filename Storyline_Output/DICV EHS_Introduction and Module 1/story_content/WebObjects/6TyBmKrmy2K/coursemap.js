(function () {
  'use strict';

  var CONFIG = window.DICV_COURSE_MAP_CONFIG;
  var stageEl = document.getElementById('map-stage');
  var checkpointsRow = document.getElementById('checkpoints-row');
  var moduleTagEl = document.getElementById('selected-module-tag');
  var moduleTitleEl = document.getElementById('selected-module-title');
  var moduleStatePill = document.getElementById('selected-module-state');
  var progressLabelEl = document.getElementById('modal-progress-label');
  var progressFillEl = document.getElementById('modal-progress-fill');
  var topicsGridEl = document.getElementById('topics-grid');
  var deniedBannerEl = document.getElementById('denied-banner');
  var backBtn = document.getElementById('btn-back-to-lesson');
  var resumeModalBtn = document.getElementById('btn-resume-next');

  var MODULE_ICON_FILES = {
    1: 'Asset 6.svg',
    2: 'Asset 5.svg',
    3: 'Asset 4.svg',
    4: 'Asset 1.svg',
    5: 'Asset 2.svg',
    6: 'Asset 3.svg'
  };

  // Bottom offsets seat the platform artwork on the sloped deck at the 1920 × 1080 stage size.
  var BELT_ANCHOR_X = 13.8;
  var BELT_ANCHOR_BOTTOM = 144;
  var BELT_RISE_PER_PCT = 144 / (85.8 - 13.8);

  function getBeltContactBottom(leftPct) {
    return Math.round(BELT_ANCHOR_BOTTOM + (leftPct - BELT_ANCHOR_X) * BELT_RISE_PER_PCT) + 'px';
  }

  var CHECKPOINT_POSITIONS = [
    { left: '13.8%', bottom: getBeltContactBottom(13.8) },
    { left: '28.2%', bottom: getBeltContactBottom(28.2) },
    { left: '42.6%', bottom: getBeltContactBottom(42.6) },
    { left: '57.0%', bottom: getBeltContactBottom(57.0) },
    { left: '71.4%', bottom: getBeltContactBottom(71.4) },
    { left: '85.8%', bottom: getBeltContactBottom(85.8) }
  ];

  var currentState = {
    navigationMode: false,
    progress: { v: 1, t: {}, last: null }
  };
  var selectedModuleId = 1;
  var userBrowsedModule = false;

  // VO-Synchronized Transition State (never mutates CourseProgressData)
  var pathwayPulseEl = document.getElementById('conveyor-pathway-pulse');
  var transitionState = {
    active: false,
    mode: null,
    litModules: {},
    earnedStarModuleId: null,
    topicsRevealed: false,
    continueEnabled: false,
    travelTimer: null
  };

  function getUrlParam(name) {
    try {
      return new URLSearchParams(window.location.search || '').get(name);
    } catch (e) {
      return null;
    }
  }

  function isPreviewDemo() {
    return getUrlParam('preview') === '1' && window.parent === window;
  }

  function resetTransitionVisuals(modeName) {
    if (transitionState.travelTimer) {
      window.clearTimeout(transitionState.travelTimer);
      transitionState.travelTimer = null;
    }
    transitionState.active = true;
    transitionState.mode = modeName || transitionState.mode || 'm1_intro';
    transitionState.litModules = {};
    transitionState.earnedStarModuleId = null;
    transitionState.topicsRevealed = false;
    transitionState.continueEnabled = false;
    document.body.classList.add('is-transition-mode');
    document.body.classList.remove('transition-topics-revealed', 'transition-continue-enabled');
    if (pathwayPulseEl) {
      pathwayPulseEl.classList.remove('is-traveling');
    }
  }

  function fitStage() {
    if (!stageEl) return;
    var vw = window.innerWidth || 1920;
    var vh = window.innerHeight || 1080;
    var scale = Math.min(vw / 1920, vh / 950);
    var stageHeight = Math.min(1440, vh / scale);
    stageEl.style.height = stageHeight + 'px';
    stageEl.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
  }
  window.addEventListener('resize', fitStage);
  fitStage();

  // Pause CSS animations when Storyline hides the layer/tab
  function syncVisibilityPause() {
    if (document.hidden) {
      document.body.classList.add('is-paused');
    } else {
      document.body.classList.remove('is-paused');
    }
  }
  document.addEventListener('visibilitychange', syncVisibilityPause);
  syncVisibilityPause();

  function getTopicStatus(missionId) {
    var val = currentState.progress && currentState.progress.t
      ? currentState.progress.t[String(missionId)]
      : 0;
    return (val === 1 || val === 2) ? val : 0;
  }

  function arePrereqsMet(prereqs) {
    if (!prereqs || !prereqs.length) return true;
    for (var i = 0; i < prereqs.length; i++) {
      if (getTopicStatus(prereqs[i]) !== 2) return false;
    }
    return true;
  }

  function isTopicLocked(mod, topic) {
    if (currentState.navigationMode) return false;
    return !arePrereqsMet(mod.prereqs) || !arePrereqsMet(topic.prereqs);
  }

  function getModuleState(mod) {
    if (!currentState.navigationMode && !arePrereqsMet(mod.prereqs)) {
      return 'locked';
    }
    var topics = mod.topics || [];
    if (!topics.length) {
      return arePrereqsMet(mod.prereqs) ? 'available' : 'locked';
    }
    var allDone = topics.every(function (t) { return getTopicStatus(t.missionId) === 2; });
    if (allDone) return 'completed';
    var anyStarted = topics.some(function (t) { return getTopicStatus(t.missionId) > 0; });
    return anyStarted ? 'in_progress' : 'available';
  }

  function findNextUnfinishedTopic() {
    var mods = CONFIG.modules || [];
    for (var i = 0; i < mods.length; i++) {
      var topics = mods[i].topics || [];
      for (var j = 0; j < topics.length; j++) {
        if (getTopicStatus(topics[j].missionId) < 2) {
          return { module: mods[i], topic: topics[j] };
        }
      }
    }
    return null;
  }

  function formatStatusLabel(mod, topic) {
    var st = getTopicStatus(topic.missionId);
    if (st === 2) return 'Completed';
    if (isTopicLocked(mod, topic)) return 'Locked';
    if (st === 1) return 'In Progress';
    return 'Available';
  }

  function formatStatusClass(mod, topic) {
    var st = getTopicStatus(topic.missionId);
    if (st === 2) return 'completed';
    if (isTopicLocked(mod, topic)) return 'locked';
    if (st === 1) return 'in_progress';
    return 'available';
  }

  function formatModuleStateLabel(mState) {
    if (mState === 'completed') return 'Completed';
    if (mState === 'in_progress') return 'In Progress';
    if (mState === 'available') return 'Available';
    return 'Locked';
  }

  function clearDenied() {
    if (deniedBannerEl) deniedBannerEl.textContent = '';
  }

  function showDenied(msg) {
    if (!deniedBannerEl) return;
    deniedBannerEl.textContent = msg || 'Complete the prerequisite topic first to unlock this lesson.';
  }

  function render() {
    var nextTarget = findNextUnfinishedTopic();
    if (!transitionState.active && !userBrowsedModule && nextTarget) {
      selectedModuleId = nextTarget.module.id;
    }

    // 1. Render 6 Conveyor Module Checkpoints
    checkpointsRow.innerHTML = '';
    CONFIG.modules.forEach(function (mod, idx) {
      var mState = getModuleState(mod);
      var pos = CHECKPOINT_POSITIONS[idx] || { left: (11 + idx * 15) + '%', bottom: '140px' };
      var btn = document.createElement('button');
      btn.type = 'button';
      var transClasses = '';
      if (transitionState.active) {
        if (transitionState.litModules[mod.id]) transClasses += ' is-transition-lit';
        if (transitionState.earnedStarModuleId === mod.id) transClasses += ' is-transition-completed';
      }
      btn.className = 'checkpoint-btn state-' + mState + (mod.id === selectedModuleId ? ' is-selected' : '') + transClasses;
      btn.style.left = pos.left;
      btn.style.bottom = pos.bottom;
      btn.setAttribute('aria-label', 'Module ' + mod.id + ': ' + mod.title + ' (' + formatModuleStateLabel(mState) + ')');
      btn.setAttribute('aria-controls', 'lesson-panel');
      btn.setAttribute('aria-pressed', mod.id === selectedModuleId ? 'true' : 'false');

      var statusDot = '';
      if (mState === 'completed') {
        statusDot = '<span class="checkpoint-status-dot is-done" aria-hidden="true"><svg class="cm-inline-ico" viewBox="0 0 24 24" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span>';
      } else if (mState === 'locked') {
        statusDot = '<span class="checkpoint-status-dot is-locked" aria-hidden="true"><svg class="cm-inline-ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></span>';
      }

      var starBadge = '';
      if (transitionState.active && transitionState.earnedStarModuleId === mod.id) {
        starBadge =
          '<span class="transition-earned-star is-visible" aria-label="Module ' + mod.id + ' star earned">' +
            '<svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true">' +
              '<circle cx="24" cy="24" r="21" fill="#004355" stroke="#FFFF40" stroke-width="3"/>' +
              '<path d="M24 9l4.3 8.8 9.7 1.4-7 6.8 1.7 9.6L24 31l-8.7 4.6 1.7-9.6-7-6.8 9.7-1.4z" fill="#FFFF40"/>' +
            '</svg>' +
          '</span>';
      }

      var iconFile = MODULE_ICON_FILES[mod.id] || ('Asset ' + mod.id + '.svg');
      btn.innerHTML =
        '<span class="checkpoint-label-card">' + mod.title + '</span>' +
        '<span class="checkpoint-badge-wrap">' +
          starBadge +
          '<img class="checkpoint-badge-img" src="SVG/' + iconFile + '" alt="" draggable="false" />' +
          statusDot +
        '</span>' +
        '<span class="checkpoint-pad-wrap" aria-hidden="true">' +
          '<img class="checkpoint-pad-img" src="SVG/Asset 7.svg" alt="" draggable="false" />' +
        '</span>';

      btn.addEventListener('click', function () {
        if (transitionState.active) return;
        userBrowsedModule = true;
        selectedModuleId = mod.id;
        clearDenied();
        render();
        checkpointsRow.querySelector('.is-selected').focus();
      });

      checkpointsRow.appendChild(btn);
    });

    // 2. Render Selected Module Popup Details
    var activeMod = CONFIG.modules.find(function (m) { return m.id === selectedModuleId; }) || CONFIG.modules[0];
    var activeState = getModuleState(activeMod);
    if (moduleTagEl) moduleTagEl.textContent = 'Module ' + activeMod.id + ' of ' + CONFIG.modules.length;
    moduleTitleEl.textContent = activeMod.title;
    moduleStatePill.textContent = formatModuleStateLabel(activeState);
    moduleStatePill.className = 'module-state-pill state-' + activeState;

    // Progress bar calculation
    var topics = activeMod.topics || [];
    var completedCount = topics.filter(function (t) { return getTopicStatus(t.missionId) === 2; }).length;
    if (topics.length > 0) {
      var pct = Math.round((completedCount / topics.length) * 100);
      progressLabelEl.textContent = completedCount + ' of ' + topics.length + ' Lessons Complete';
      progressFillEl.style.width = pct + '%';
    } else {
      progressLabelEl.textContent = '';
      progressFillEl.style.width = '0%';
    }

    // 3. Render Two-Column Topic Cards (or single Coming Soon card for Modules 2–6)
    topicsGridEl.innerHTML = '';
    if (!topics.length) {
      var badgeText = activeState === 'locked' ? 'Locked' : 'Coming Soon';
      var lockIco = '<svg class="cm-inline-ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
      var ph = document.createElement('button');
      ph.type = 'button';
      ph.className = 'topic-card is-locked is-placeholder';
      ph.disabled = true;
      ph.setAttribute('aria-disabled', 'true');
      ph.style.gridColumn = '1 / -1';
      ph.innerHTML =
        '<span class="topic-title">' + (activeState === 'locked' ? 'Complete Module 1 to unlock' : 'Coming soon') + '</span>' +
        '<span class="topic-status-badge status-locked">' + lockIco + '<span>' + badgeText + '</span></span>';
      topicsGridEl.appendChild(ph);
      if (progressLabelEl && !progressLabelEl.textContent) {
        progressLabelEl.textContent = activeState === 'locked' ? 'Locked — Complete Module 1' : 'Coming Soon';
      }
    } else {
      topics.forEach(function (topic) {
        var locked = isTopicLocked(activeMod, topic);
        var stClass = formatStatusClass(activeMod, topic);
        var isNext = nextTarget && nextTarget.topic.missionId === topic.missionId;
        var label = formatStatusLabel(activeMod, topic);
        var labelHtml = label;
        if (stClass === 'completed') labelHtml = '<svg class="cm-inline-ico" viewBox="0 0 24 24" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg><span>' + label + '</span>';
        if (stClass === 'locked') labelHtml = '<svg class="cm-inline-ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg><span>' + label + '</span>';

        var card = document.createElement('button');
        card.type = 'button';
        card.className = 'topic-card' +
          (locked ? ' is-locked' : '') +
          (isNext ? ' is-next-lesson' : '') +
          (stClass === 'completed' ? ' is-completed' : '');
        card.setAttribute('aria-disabled', locked ? 'true' : 'false');
        card.innerHTML =
          '<span class="topic-title">' + topic.title + '</span>' +
          '<span class="topic-status-badge status-' + stClass + '">' + labelHtml + '</span>';

        card.addEventListener('click', function () {
          clearDenied();
          if (locked) {
            showDenied('Complete the previous lesson first to unlock this topic.');
            return;
          }
          bridge.requestMission(topic.missionId);
        });

        topicsGridEl.appendChild(card);
      });
    }

    if (transitionState.active) {
      resumeModalBtn.disabled = !transitionState.continueEnabled;
      resumeModalBtn.textContent = activeMod.id === 2
        ? 'Begin Block 2 →'
        : (completedCount === 0 ? 'Start First Lesson →' : 'Continue →');
    } else if (!topics.length) {
      resumeModalBtn.disabled = true;
      resumeModalBtn.textContent = activeState === 'locked' ? 'Complete Module 1 to Unlock' : 'Coming Soon';
    } else {
      resumeModalBtn.disabled = !nextTarget;
      resumeModalBtn.textContent = nextTarget
        ? (completedCount === 0 ? 'Start First Lesson →' : 'Continue Next Lesson →')
        : 'All Pilot Lessons Completed';
    }
  }

  function handleResumeNext() {
    clearDenied();
    if (transitionState.active) {
      if (!transitionState.continueEnabled) return;
      bridge.send('TRANSITION_CONTINUE', { moduleId: selectedModuleId });
      return;
    }
    var activeMod = getModuleById(selectedModuleId);
    if (!activeMod || !activeMod.topics || !activeMod.topics.length) return;
    var target = findNextUnfinishedTopic();
    if (!target) return;
    bridge.requestMission(target.topic.missionId);
  }

  function handleTransitionCommand(cmd, payload) {
    var p = payload || {};
    var modId = Number(p.moduleId || 1);

    if (cmd === 'START_MODULE_INTRO' || cmd === 'RESET_TRANSITION') {
      resetTransitionVisuals(p.mode || (modId === 2 ? 'm1_to_m2' : 'm1_intro'));
      selectedModuleId = modId;
      render();
      return;
    }

    if (!transitionState.active) {
      resetTransitionVisuals(modId === 2 ? 'm1_to_m2' : 'm1_intro');
    }

    if (cmd === 'HIGHLIGHT_MODULE') {
      transitionState.litModules[modId] = true;
      selectedModuleId = modId;
      render();
    } else if (cmd === 'REVEAL_TOPICS') {
      if (p.moduleId) selectedModuleId = Number(p.moduleId);
      transitionState.topicsRevealed = true;
      document.body.classList.add('transition-topics-revealed');
      render();
    } else if (cmd === 'SHOW_EARNED_STAR') {
      var targetMod = CONFIG.modules.find(function (m) { return m.id === modId; });
      var earned = targetMod && (getModuleState(targetMod) === 'completed' || isPreviewDemo());
      if (earned) {
        transitionState.earnedStarModuleId = modId;
        transitionState.litModules[modId] = true;
        render();
      }
      bridge.send('EARNED_STAR_STATUS', { moduleId: modId, verified: !!earned });
    } else if (cmd === 'MOVE_CONVEYOR_HIGHLIGHT') {
      var toMod = Number(p.toModule || 2);
      var dur = Math.max(300, Number(p.durationMs) || 1400);
      if (pathwayPulseEl) {
        pathwayPulseEl.classList.remove('is-traveling');
        void pathwayPulseEl.offsetWidth;
        pathwayPulseEl.classList.add('is-traveling');
      }
      if (transitionState.travelTimer) window.clearTimeout(transitionState.travelTimer);
      transitionState.travelTimer = window.setTimeout(function () {
        transitionState.litModules[toMod] = true;
        selectedModuleId = toMod;
        render();
      }, dur);
    } else if (cmd === 'TRANSITION_COMPLETE') {
      transitionState.continueEnabled = true;
      document.body.classList.add('transition-continue-enabled');
      render();
      bridge.send('TRANSITION_COMPLETE_ACK', { moduleId: selectedModuleId });
    }
  }

  function backToLesson() {
    if (!bridge.requestClose()) {
      showDenied('The Storyline layer could not close.');
    }
  }

  resumeModalBtn.addEventListener('click', handleResumeNext);
  if (window.parent === window) {
    backBtn.disabled = true;
    backBtn.title = 'Available when the map is opened from a Storyline lesson';
  }
  backBtn.addEventListener('click', backToLesson);

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !backBtn.disabled) {
      backToLesson();
      return;
    }
    if (!e.key || e.key.toLowerCase() !== 'l') return;
    if (window.parent !== window && getUrlParam('admin') !== '1' && getUrlParam('preview') !== '1') return;
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    bridge.requestModeToggle();
  });

  var bridge = new window.DICVCourseMapBridge({
    onState: function (state) {
      currentState = state;
      render();
    },
    onDenied: function (payload) {
      showDenied((payload && payload.reason) || 'Complete the previous lesson first to unlock this topic.');
    },
    onTransitionCommand: function (cmd, payload) {
      handleTransitionCommand(cmd, payload);
    }
  });

  var initialMode = getUrlParam('mode');
  if (initialMode === 'm1_intro' || initialMode === 'm1_to_m2') {
    resetTransitionVisuals(initialMode);
  }

  render();
})();
