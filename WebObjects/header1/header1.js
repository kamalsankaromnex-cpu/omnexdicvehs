/**
 * header1.js — Reusable Global Header 1 Web Object Controller
 * - Reads CourseProgressData & HeaderProfile from Storyline GetPlayer() when available
 * - Falls back to isolated mock state ONLY when previewed outside Storyline
 * - Emits whitelisted HeaderAction requests with 250ms debounce
 */
(function (root) {
  'use strict';

  var ALLOWED_ACTIONS = {
    OPEN_GUIDELINES: true,
    OPEN_MAP: true,
    TOGGLE_MUTE: true,
    EXIT_COURSE: true,
    TOGGLE_FULLSCREEN: true
  };

  // Single configuration source for progressive visibility profiles
  var HEADER1_PROFILES = {
    A: { life: false, stars: false, guidelines: false, map: false, mute: true, fullscreen: true },
    B: { life: true,  stars: true,  guidelines: true,  map: false, mute: true, fullscreen: true },
    C: { life: true,  stars: true,  guidelines: true,  map: true,  mute: true, fullscreen: true },
    D: { life: false, stars: true,  guidelines: false, map: false, mute: true, fullscreen: true }
  };

  var MODULE1_TOPICS = ['103', '102', '104', '105', '106'];
  var lastActionTs = 0;

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

  function parseModule1Star(rawProgress) {
    if (!rawProgress) return 0;
    try {
      var parsed = typeof rawProgress === 'string' ? JSON.parse(rawProgress) : rawProgress;
      var t = (parsed && parsed.t) ? parsed.t : {};
      var allDone = MODULE1_TOPICS.every(function (id) { return Number(t[id]) === 2; });
      return allDone ? 1 : 0;
    } catch (e) {
      return 0;
    }
  }

  function applyProfile(profileKey) {
    var key = HEADER1_PROFILES[profileKey] ? profileKey : 'C';
    var p = HEADER1_PROFILES[key];
    var toggle = function (id, show) {
      var el = document.getElementById(id);
      if (el) el.classList.toggle('is-hidden', !show);
    };
    toggle('h1-life', p.life);
    toggle('h1-stars', p.stars);
    toggle('h1-center-sep', p.life && p.stars);
    toggle('btn-guidelines', p.guidelines);
    toggle('btn-map', p.map);
    toggle('btn-mute', p.mute);
    toggle('btn-fullscreen', p.fullscreen);
  }

  function parseLives(raw) {
    if (raw === null || raw === undefined || raw === '') {
      return { valid: false, count: null };
    }
    if (typeof raw === 'boolean') {
      return { valid: false, count: null };
    }
    var n = Number(raw);
    if (!isFinite(n)) {
      return { valid: false, count: null };
    }
    var clamped = Math.max(0, Math.min(3, Math.round(n)));
    return { valid: true, count: clamped };
  }

  var lastLivesCount = null;

  function renderLives(lifeState) {
    var lifeBox = document.getElementById('h1-life');
    var lifeEl = document.getElementById('h1-life-val');
    var hearts = document.querySelectorAll('#h1-hearts .dicv-heart');

    if (!lifeState || !lifeState.valid) {
      lastLivesCount = null;
      hearts.forEach(function (h) {
        h.classList.remove('is-active', 'is-inactive', 'is-just-lost', 'is-just-gained');
        h.classList.add('is-unavailable');
      });
      if (lifeEl) lifeEl.textContent = '--';
      if (lifeBox) lifeBox.setAttribute('aria-label', 'Lives unavailable');
      return;
    }

    var count = lifeState.count;
    var reduced = lastLivesCount !== null && count < lastLivesCount;
    var gained = lastLivesCount !== null && count > lastLivesCount;

    hearts.forEach(function (h, idx) {
      var active = idx < count;
      h.classList.remove('is-unavailable');
      h.classList.toggle('is-active', active);
      h.classList.toggle('is-inactive', !active);

      if (reduced && idx >= count && idx < lastLivesCount) {
        h.classList.remove('is-just-gained', 'is-just-lost');
        void h.offsetWidth;
        h.classList.add('is-just-lost');
        if (typeof setTimeout === 'function') {
          setTimeout(function () { h.classList.remove('is-just-lost'); }, 820);
        }
      } else if (gained && idx >= lastLivesCount && idx < count) {
        h.classList.remove('is-just-lost', 'is-just-gained');
        void h.offsetWidth;
        h.classList.add('is-just-gained');
        if (typeof setTimeout === 'function') {
          setTimeout(function () { h.classList.remove('is-just-gained'); }, 900);
        }
      }
    });

    if (lifeEl) {
      lifeEl.textContent = count + '/3';
      if (reduced) {
        lifeEl.classList.remove('is-life-gained', 'is-life-reduced');
        void lifeEl.offsetWidth;
        lifeEl.classList.add('is-life-reduced');
        if (root.DICVSFX) root.DICVSFX.play('heart_lost');
        if (typeof setTimeout === 'function') {
          setTimeout(function () { lifeEl.classList.remove('is-life-reduced'); }, 650);
        }
      } else if (gained) {
        lifeEl.classList.remove('is-life-reduced', 'is-life-gained');
        void lifeEl.offsetWidth;
        lifeEl.classList.add('is-life-gained');
        if (root.DICVSFX) root.DICVSFX.play('heart_gain');
        if (typeof setTimeout === 'function') {
          setTimeout(function () { lifeEl.classList.remove('is-life-gained'); }, 750);
        }
      }
    }
    lastLivesCount = count;
    if (lifeBox) lifeBox.setAttribute('aria-label', count + ' of 3 lives remaining');
  }

  var lastStarsCount = null;

  function renderStars(starsCount) {
    var count = Math.max(0, Math.min(6, Math.round(Number(starsCount) || 0)));
    var starsBox = document.getElementById('h1-stars');
    var starsEl = document.getElementById('h1-stars-val');
    var stars = document.querySelectorAll('#h1-stars-icons .dicv-star');
    var gained = lastStarsCount !== null && count > lastStarsCount;

    stars.forEach(function (s, idx) {
      var active = idx < count;
      s.classList.toggle('is-active', active);
      s.classList.toggle('is-inactive', !active);
      if (gained && idx >= lastStarsCount && idx < count) {
        s.classList.remove('is-just-earned');
        void s.offsetWidth;
        s.classList.add('is-just-earned');
        setTimeout(function () { s.classList.remove('is-just-earned'); }, 900);
      }
    });
    lastStarsCount = count;
    if (gained && root.DICVSFX) {
      root.DICVSFX.play('star');
    }
    if (starsEl) starsEl.textContent = count + '/6';
    if (starsBox) starsBox.setAttribute('aria-label', count + ' of 6 module stars earned');
  }

  function syncFromStoryline() {
    var player = findPlayer();
    var profile = getQueryParam('profile') || 'C';
    var starsCount = 0;
    var lifeState = { valid: false, count: null };

    if (player && typeof player.GetVar === 'function') {
      try {
        var hp = player.GetVar('HeaderProfile');
        if (hp && HEADER1_PROFILES[hp]) profile = hp;
      } catch (e) {}
      try {
        var rawProg = player.GetVar('CourseProgressData');
        starsCount = parseModule1Star(rawProg);
      } catch (e2) {}
      try {
        var rawStars = player.GetVar('StarsEarned');
        if (rawStars === null || rawStars === undefined || String(rawStars).trim() === '') {
          rawStars = player.GetVar('ModuleStars');
        }
        var nStars = Number(rawStars);
        if (isFinite(nStars) && nStars > starsCount) {
          starsCount = nStars;
        }
      } catch (e2b) {}
      try {
        var rawLives = player.GetVar('LivesRemaining');
        lifeState = parseLives(rawLives);
      } catch (e3) {
        lifeState = { valid: false, count: null };
      }
    } else {
      // Isolated standalone simulation preview (NOT authoritative Storyline state)
      var simStars = getQueryParam('simStars');
      starsCount = simStars !== null ? Number(simStars) : 1;
      var simLife = getQueryParam('simLife');
      if (simLife === 'na' || simLife === 'unavailable') {
        lifeState = { valid: false, count: null };
      } else {
        lifeState = parseLives(simLife !== null ? simLife : 3);
      }
    }

    applyProfile(profile);
    renderLives(lifeState);
    renderStars(starsCount);
  }

  function sendAction(action) {
    if (!ALLOWED_ACTIONS[action]) return;
    var now = Date.now();
    if (now - lastActionTs < 250) return;
    lastActionTs = now;

    var player = findPlayer();
    if (player && typeof player.SetVar === 'function') {
      try {
        // Clear then set so repeated clicks on the same action always fire Storyline's "When variable changes" trigger
        player.SetVar('HeaderAction', '');
        if (typeof setTimeout === 'function') {
          setTimeout(function () {
            try { player.SetVar('HeaderAction', action); } catch (e2b) {}
          }, 30);
        } else {
          player.SetVar('HeaderAction', action);
        }
      } catch (e2) {}
    }

    if (root.parent && root.parent !== root) {
      try {
        root.parent.postMessage({
          source: 'DICV_HEADER1_WEBOBJECT',
          type: 'HEADER_ACTION',
          payload: { action: action }
        }, '*');
      } catch (e3) {}
    }
  }

  function getHostDocument() {
    try {
      if (root.parent && root.parent !== root && root.parent.document) {
        return root.parent.document;
      }
    } catch (e) {}
    return root.document || null;
  }

  function updateMuteButtonUI(isMuted) {
    var btn = document.getElementById('btn-mute');
    if (!btn) return;
    var unmutedIco = btn.querySelector('.ico-unmuted');
    var mutedIco = btn.querySelector('.ico-muted');
    var lbl = btn.querySelector('.dicv-btn-lbl');
    if (unmutedIco) unmutedIco.classList.toggle('is-hidden', !!isMuted);
    if (mutedIco) mutedIco.classList.toggle('is-hidden', !isMuted);
    if (lbl) lbl.textContent = isMuted ? 'Unmute' : 'Mute';
    btn.setAttribute('aria-label', isMuted ? 'Unmute audio' : 'Mute audio');
  }

  function handleMuteToggle(isMuted) {
    updateMuteButtonUI(isMuted);
    if (root.DICVSFX && typeof root.DICVSFX.setMuted === 'function') {
      root.DICVSFX.setMuted(!!isMuted);
    }
    try {
      if (root.parent && root.parent !== root && root.parent.frames) {
        for (var i = 0; i < root.parent.frames.length; i++) {
          try {
            root.parent.frames[i].postMessage({ type: 'SFX_MUTE_CHANGED', muted: !!isMuted }, '*');
          } catch (ef) {}
        }
      }
    } catch (ef2) {}
    var doc = getHostDocument();
    if (!doc) return;
    try {
      var slVolBtn = doc.querySelector('#volume, button[aria-label*="volume" i], button[aria-label*="mute" i], .volume-control button');
      if (slVolBtn && typeof slVolBtn.click === 'function') {
        slVolBtn.click();
      }
    } catch (e1) {}
    try {
      var media = doc.querySelectorAll('audio, video');
      media.forEach(function (el) { el.muted = !!isMuted; });
    } catch (e2) {}
    try {
      var hostWin = (root.parent && root.parent !== root) ? root.parent : root;
      if (hostWin.Howler && typeof hostWin.Howler.mute === 'function') {
        hostWin.Howler.mute(!!isMuted);
      }
    } catch (e3) {}
  }

  function handleFullscreenToggle() {
    var doc = getHostDocument();
    if (!doc) return;
    try {
      var slFsBtn = doc.querySelector('#fullscreen-toggle, button[aria-label*="fullscreen" i], [data-action="fullscreen"]');
      if (slFsBtn && typeof slFsBtn.click === 'function') {
        slFsBtn.click();
        return;
      }
    } catch (e1) {}
    try {
      var fsEl = doc.fullscreenElement || doc.webkitFullscreenElement;
      if (fsEl) {
        if (doc.exitFullscreen) doc.exitFullscreen();
        else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
        return;
      }
      var target = doc.documentElement || doc.body;
      if (target && target.requestFullscreen) {
        target.requestFullscreen().catch(function () {});
      } else if (target && target.webkitRequestFullscreen) {
        target.webkitRequestFullscreen();
      }
    } catch (e2) {}
  }

  function announceReady() {
    if (root.parent && root.parent !== root) {
      try {
        root.parent.postMessage({
          source: 'DICV_HEADER1_WEBOBJECT',
          type: 'HEADER1_READY',
          payload: { timestamp: Date.now() }
        }, '*');
      } catch (e) {}
    }
  }

  document.querySelectorAll('.dicv-h1-btn[data-action]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var act = btn.getAttribute('data-action');
      if (act === 'TOGGLE_MUTE' || act === 'TOGGLE_FULLSCREEN') {
        var next = btn.getAttribute('aria-pressed') !== 'true';
        btn.setAttribute('aria-pressed', next ? 'true' : 'false');
        if (act === 'TOGGLE_MUTE') handleMuteToggle(next);
        else handleFullscreenToggle();
      }
      if (root.DICVSFX) root.DICVSFX.play('click');
      sendAction(act);
    });
  });

  if (typeof root.addEventListener === 'function') {
    root.addEventListener('message', function (event) {
      if (root.parent && root.parent !== root && event.source !== root.parent) return;
      var d = event && event.data;
      if (!d || typeof d !== 'object') return;
      if (d.type === 'HEADER1_SET_PROFILE' && d.profile) {
        applyProfile(d.profile);
      } else if (d.type === 'HEADER1_SYNC') {
        syncFromStoryline();
      }
    });
  }

  syncFromStoryline();
  announceReady();

  // Live poll Storyline variables when embedded so hearts/stars update immediately on the current slide
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
