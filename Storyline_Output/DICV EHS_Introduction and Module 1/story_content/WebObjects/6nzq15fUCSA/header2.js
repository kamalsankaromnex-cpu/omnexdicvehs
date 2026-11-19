/**
 * header2.js — Reusable Global Header 2 Progress Bar Web Object
 * - Reads CourseProgressData, M1_CompletedCount, and Header2Title from Storyline GetPlayer()
 * - Falls back to standalone preview params when opened outside Storyline
 */
(function (root) {
  'use strict';

  var DEFAULT_MODULE_CONFIG = {
    id: 1,
    title: 'DICV Safety Culture & Vision Zero',
    topics: ['103', '102', '104', '105', '106'],
    titles: {
      '103': "DICV's Commitment to a Safer Workplace",
      '102': 'EHS Vision',
      '104': 'Safety Strategy',
      '105': 'Safety Culture',
      '106': 'Safety Review Structure'
    }
  };

  function getActiveModuleConfig(player) {
    var modId = Number(getQueryParam('module')) || 0;
    if (!modId && player && typeof player.GetVar === 'function') {
      try {
        modId = Number(player.GetVar('ActiveModule') || player.GetVar('CurrentModule')) || 0;
      } catch (e) {}
    }
    if (!modId) modId = 1;

    var cfg = root.DICV_COURSE_MAP;
    if (cfg && Array.isArray(cfg.modules)) {
      var mod = null;
      for (var i = 0; i < cfg.modules.length; i++) {
        if (Number(cfg.modules[i].id) === modId) { mod = cfg.modules[i]; break; }
      }
      if (!mod) mod = cfg.modules[0];
      if (mod && Array.isArray(mod.topics) && mod.topics.length > 0) {
        var topicIds = [];
        var titles = {};
        mod.topics.forEach(function (t) {
          var id = String(t.missionId);
          topicIds.push(id);
          titles[id] = t.title || ('Topic ' + id);
        });
        return {
          id: Number(mod.id) || 1,
          title: mod.title || DEFAULT_MODULE_CONFIG.title,
          topics: topicIds,
          titles: titles
        };
      }
    }
    return DEFAULT_MODULE_CONFIG;
  }

  function getTargetOrigin() {
    try {
      if (root.location && root.location.origin && root.location.origin !== 'null') {
        return root.location.origin;
      }
      if (typeof document !== 'undefined' && document.referrer) {
        return new URL(document.referrer).origin;
      }
    } catch (e) {}
    return '*';
  }

  function resolveTopicTitle(states, explicitTitle, requestedMission, modCfg) {
    if (explicitTitle && String(explicitTitle).trim()) {
      return String(explicitTitle).trim();
    }
    var topics = modCfg.topics;
    var titles = modCfg.titles;
    for (var i = 0; i < topics.length; i++) {
      var id = topics[i];
      if (Number(states[id]) === 1 && titles[id]) {
        return titles[id];
      }
    }
    var reqKey = requestedMission ? String(requestedMission) : '';
    if (reqKey && titles[reqKey]) {
      return titles[reqKey];
    }
    for (var j = 0; j < topics.length; j++) {
      var nextId = topics[j];
      if (Number(states[nextId]) !== 2 && titles[nextId]) {
        return titles[nextId];
      }
    }
    return modCfg.title;
  }

  function getQueryParam(name) {
    try {
      var params = new URLSearchParams(root.location.search || '');
      return params.get(name);
    } catch (e) {
      return null;
    }
  }

  function findPlayer() {
    try {
      if (root.parent && root.parent !== root && typeof root.parent.GetPlayer === 'function') {
        return root.parent.GetPlayer();
      }
      if (root.top && root.top !== root && typeof root.top.GetPlayer === 'function') {
        return root.top.GetPlayer();
      }
      if (typeof root.GetPlayer === 'function') return root.GetPlayer();
    } catch (e) {}
    return null;
  }

  function parseTopicMap(rawProgress) {
    if (!rawProgress) return null;
    try {
      var parsed = typeof rawProgress === 'string' ? JSON.parse(rawProgress) : rawProgress;
      return (parsed && parsed.t && typeof parsed.t === 'object') ? parsed.t : null;
    } catch (e) {
      return null;
    }
  }

  function ensureSegments(barEl, modCfg) {
    if (!barEl || typeof document === 'undefined' || typeof document.createElement !== 'function') return;
    var existing = barEl.querySelectorAll('.dicv-h2-seg');
    var needsRebuild = existing.length !== modCfg.topics.length;
    if (!needsRebuild) {
      for (var i = 0; i < modCfg.topics.length; i++) {
        if (existing[i].getAttribute('data-topic') !== modCfg.topics[i]) {
          needsRebuild = true;
          break;
        }
      }
    }
    if (!needsRebuild) return;
    barEl.innerHTML = '';
    modCfg.topics.forEach(function (id) {
      var span = document.createElement('span');
      span.className = 'dicv-h2-seg';
      span.setAttribute('data-topic', id);
      span.setAttribute('title', modCfg.titles[id] || '');
      barEl.appendChild(span);
    });
  }

  function renderProgress(topicStates, titleText, modCfg) {
    var topics = modCfg.topics;
    var completed = 0;
    var barEl = document.getElementById('h2-segments');
    ensureSegments(barEl, modCfg);

    var segs = document.querySelectorAll('#h2-segments .dicv-h2-seg');

    segs.forEach(function (seg, idx) {
      var id = seg.getAttribute('data-topic') || topics[idx];
      var st = Number(topicStates[id]) || 0;
      seg.classList.toggle('is-completed', st === 2);
      seg.classList.toggle('is-active', st === 1);
      if (st === 2) completed += 1;
    });

    var total = topics.length || 1;
    var pct = Math.round((completed / total) * 100);
    var badgeEl = document.getElementById('h2-module-badge');
    var countEl = document.getElementById('h2-count');
    var pctEl = document.getElementById('h2-pct');
    var titleEl = document.getElementById('h2-title');

    if (badgeEl) badgeEl.textContent = 'MODULE ' + modCfg.id;
    if (countEl) countEl.textContent = completed + '/' + total + ' Topics';
    if (pctEl) pctEl.textContent = pct + '%';
    if (barEl) {
      barEl.setAttribute('aria-valuemax', String(total));
      barEl.setAttribute('aria-valuenow', String(completed));
      barEl.setAttribute('aria-valuetext', completed + ' of ' + total + ' topics');
    }
    if (titleEl && titleText) titleEl.textContent = titleText;
  }

  function syncFromStoryline() {
    var player = findPlayer();
    var modCfg = getActiveModuleConfig(player);
    var topics = modCfg.topics;
    var states = {};
    var explicitTitle = getQueryParam('title') || '';
    var requestedMission = '';

    if (player && typeof player.GetVar === 'function') {
      var topicMap = null;
      try {
        topicMap = parseTopicMap(player.GetVar('CourseProgressData'));
      } catch (e1) {}

      if (topicMap && Object.keys(topicMap).length > 0) {
        topics.forEach(function (id) {
          states[id] = Number(topicMap[id]) || 0;
        });
      } else {
        var count = 0;
        try {
          count = Math.max(0, Math.min(topics.length, Math.round(Number(player.GetVar('M1_CompletedCount')) || 0)));
        } catch (e2) {}
        topics.forEach(function (id, idx) {
          states[id] = idx < count ? 2 : (idx === count ? 1 : 0);
        });
      }

      try {
        var customTitle = player.GetVar('Header2Title');
        if (customTitle && String(customTitle).trim()) {
          explicitTitle = String(customTitle).trim();
        }
      } catch (e3) {}
      try {
        var req = player.GetVar('RequestedMission');
        if (req) requestedMission = String(req);
      } catch (e4) {}
    } else {
      var simDone = Math.max(0, Math.min(topics.length, Math.round(Number(getQueryParam('completed')) || 0)));
      var activeId = getQueryParam('active') || '';
      topics.forEach(function (id, idx) {
        if (idx < simDone) states[id] = 2;
        else if (id === activeId) states[id] = 1;
        else states[id] = 0;
      });
    }

    var titleText = resolveTopicTitle(states, explicitTitle, requestedMission, modCfg);
    renderProgress(states, titleText, modCfg);
  }

  function announceReady() {
    if (root.parent && root.parent !== root) {
      try {
        root.parent.postMessage({
          source: 'DICV_HEADER2_WEBOBJECT',
          type: 'HEADER2_READY',
          payload: { timestamp: Date.now() }
        }, getTargetOrigin());
      } catch (e) {}
    }
  }

  if (typeof root.addEventListener === 'function') {
    root.addEventListener('message', function (event) {
      if (root.parent && root.parent !== root && event.source !== root.parent) return;
      var d = event && event.data;
      if (!d || typeof d !== 'object') return;
      if (d.type === 'HEADER2_SYNC') {
        syncFromStoryline();
      }
    });
  }

  syncFromStoryline();
  announceReady();

  // Live poll Storyline variables when embedded so topic name & progress update immediately
  var liveSyncTimer = null;
  if (typeof setInterval === 'function' && findPlayer()) {
    liveSyncTimer = setInterval(syncFromStoryline, 600);
    if (typeof root.addEventListener === 'function') {
      root.addEventListener('pagehide', function () {
        if (liveSyncTimer && typeof clearInterval === 'function') {
          clearInterval(liveSyncTimer);
          liveSyncTimer = null;
        }
      });
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
