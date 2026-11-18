/**
 * header2.js — Reusable Global Header 2 Progress Bar Web Object
 * - Reads CourseProgressData, M1_CompletedCount, and Header2Title from Storyline GetPlayer()
 * - Falls back to standalone preview params when opened outside Storyline
 */
(function (root) {
  'use strict';

  var MODULE1_TOPICS = ['103', '102', '104', '105', '106'];
  var MODULE1_TITLE = 'DICV Safety Culture & Vision Zero';
  var TOPIC_TITLES = {
    '103': "DICV's Commitment to a Safer Workplace",
    '102': 'EHS Vision',
    '104': 'Safety Strategy',
    '105': 'Safety Culture',
    '106': 'Safety Review Structure'
  };

  function resolveTopicTitle(states, explicitTitle, requestedMission) {
    if (explicitTitle && String(explicitTitle).trim()) {
      return String(explicitTitle).trim();
    }
    var reqKey = requestedMission ? String(requestedMission) : '';
    if (reqKey && TOPIC_TITLES[reqKey]) {
      return TOPIC_TITLES[reqKey];
    }
    for (var i = 0; i < MODULE1_TOPICS.length; i++) {
      var id = MODULE1_TOPICS[i];
      if (Number(states[id]) === 1 && TOPIC_TITLES[id]) {
        return TOPIC_TITLES[id];
      }
    }
    for (var j = 0; j < MODULE1_TOPICS.length; j++) {
      var nextId = MODULE1_TOPICS[j];
      if (Number(states[nextId]) !== 2 && TOPIC_TITLES[nextId]) {
        return TOPIC_TITLES[nextId];
      }
    }
    return MODULE1_TITLE;
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

  function renderProgress(topicStates, titleText) {
    var completed = 0;
    var segs = document.querySelectorAll('#h2-segments .dicv-h2-seg');

    segs.forEach(function (seg, idx) {
      var id = seg.getAttribute('data-topic') || MODULE1_TOPICS[idx];
      var st = Number(topicStates[id]) || 0;
      seg.classList.toggle('is-completed', st === 2);
      seg.classList.toggle('is-active', st === 1);
      if (st === 2) completed += 1;
    });

    var pct = Math.round((completed / MODULE1_TOPICS.length) * 100);
    var countEl = document.getElementById('h2-count');
    var pctEl = document.getElementById('h2-pct');
    var barEl = document.getElementById('h2-segments');
    var titleEl = document.getElementById('h2-title');

    if (countEl) countEl.textContent = completed + '/' + MODULE1_TOPICS.length + ' Topics';
    if (pctEl) pctEl.textContent = pct + '%';
    if (barEl) barEl.setAttribute('aria-valuenow', String(completed));
    if (titleEl && titleText) titleEl.textContent = titleText;
  }

  function syncFromStoryline() {
    var player = findPlayer();
    var states = {};
    var explicitTitle = getQueryParam('title') || '';
    var requestedMission = '';

    if (player && typeof player.GetVar === 'function') {
      var topicMap = null;
      try {
        topicMap = parseTopicMap(player.GetVar('CourseProgressData'));
      } catch (e1) {}

      if (topicMap && Object.keys(topicMap).length > 0) {
        MODULE1_TOPICS.forEach(function (id) {
          states[id] = Number(topicMap[id]) || 0;
        });
      } else {
        var count = 0;
        try {
          count = Math.max(0, Math.min(MODULE1_TOPICS.length, Math.round(Number(player.GetVar('M1_CompletedCount')) || 0)));
        } catch (e2) {}
        MODULE1_TOPICS.forEach(function (id, idx) {
          states[id] = idx < count ? 2 : 0;
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
      var simDone = Math.max(0, Math.min(MODULE1_TOPICS.length, Math.round(Number(getQueryParam('completed')) || 0)));
      var activeId = getQueryParam('active') || '';
      MODULE1_TOPICS.forEach(function (id, idx) {
        if (idx < simDone) states[id] = 2;
        else if (id === activeId) states[id] = 1;
        else states[id] = 0;
      });
    }

    var titleText = resolveTopicTitle(states, explicitTitle, requestedMission);
    renderProgress(states, titleText);
  }

  function announceReady() {
    if (root.parent && root.parent !== root) {
      try {
        root.parent.postMessage({
          source: 'DICV_HEADER2_WEBOBJECT',
          type: 'HEADER2_READY',
          payload: { timestamp: Date.now() }
        }, '*');
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
