/**
 * sfx.js — Lightweight Web Audio API Sound-Effects Synthesizer for DICV Interactive
 * - Zero external audio assets (100% offline / SCORM-safe)
 * - Obeys Header 1 Mute state via localStorage ('dicv_sfx_muted') & postMessage
 * - Safe in headless / Node VM test environments (all browser globals guarded)
 */
(function (root) {
  'use strict';

  var STORAGE_KEY = 'dicv_sfx_muted';
  var ctx = null;
  var muted = false;

  try {
    if (root.localStorage) {
      muted = root.localStorage.getItem(STORAGE_KEY) === 'true';
    }
  } catch (e) {}

  function getContext() {
    if (muted) return null;
    if (!ctx) {
      var AudioCtx = root.AudioContext || root.webkitAudioContext;
      if (!AudioCtx) return null;
      try {
        ctx = new AudioCtx();
      } catch (e) {
        return null;
      }
    }
    if (ctx && ctx.state === 'suspended' && typeof ctx.resume === 'function') {
      try { ctx.resume().catch(function () {}); } catch (e2) {}
    }
    return ctx;
  }

  function tone(freq, duration, type, volume, delay, endFreq) {
    var c = getContext();
    if (!c) return;
    try {
      var t0 = c.currentTime + (delay || 0);
      var osc = c.createOscillator();
      var gain = c.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, t0);
      if (endFreq && endFreq !== freq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), t0 + duration);
      }
      var v = Math.max(0.001, volume || 0.08);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(v, t0 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(t0);
      osc.stop(t0 + duration + 0.02);
    } catch (e) {}
  }

  var EFFECTS = {
    click: function () {
      tone(620, 0.045, 'triangle', 0.06, 0, 480);
    },
    select: function () {
      tone(540, 0.055, 'sine', 0.07, 0, 720);
    },
    deselect: function () {
      tone(520, 0.055, 'sine', 0.05, 0, 380);
    },
    drop: function () {
      tone(320, 0.07, 'triangle', 0.08, 0, 520);
    },
    limit: function () {
      tone(220, 0.08, 'sine', 0.06, 0, 180);
    },
    correct: function () {
      tone(523.25, 0.14, 'sine', 0.09, 0);       // C5
      tone(659.25, 0.16, 'sine', 0.09, 0.09);    // E5
      tone(783.99, 0.24, 'sine', 0.09, 0.18);    // G5
    },
    incorrect: function () {
      tone(310, 0.14, 'triangle', 0.07, 0, 260);
      tone(240, 0.20, 'triangle', 0.07, 0.13, 210);
    },
    heart_lost: function () {
      tone(360, 0.13, 'sine', 0.08, 0, 260);
      tone(240, 0.22, 'sine', 0.08, 0.12, 160);
    },
    heart_gain: function () {
      tone(523.25, 0.11, 'sine', 0.08, 0);
      tone(659.25, 0.11, 'sine', 0.08, 0.08);
      tone(783.99, 0.12, 'sine', 0.09, 0.16);
      tone(1046.5, 0.24, 'sine', 0.09, 0.24);
    },
    star: function () {
      tone(659.25, 0.12, 'sine', 0.08, 0);
      tone(880.00, 0.14, 'sine', 0.08, 0.09);
      tone(1174.66, 0.26, 'sine', 0.09, 0.18);
    }
  };

  function setMuted(nextMuted) {
    muted = !!nextMuted;
    try {
      if (root.localStorage) {
        root.localStorage.setItem(STORAGE_KEY, muted ? 'true' : 'false');
      }
    } catch (e) {}
    return muted;
  }

  function isMuted() {
    try {
      if (root.localStorage) {
        var stored = root.localStorage.getItem(STORAGE_KEY);
        if (stored === 'true' || stored === 'false') {
          muted = stored === 'true';
        }
      }
    } catch (e) {}
    return muted;
  }

  function play(name) {
    if (isMuted()) return false;
    var fn = EFFECTS[name];
    if (typeof fn === 'function') {
      fn();
      return true;
    }
    return false;
  }

  if (typeof root.addEventListener === 'function') {
    root.addEventListener('message', function (event) {
      var d = event && event.data;
      if (d && d.type === 'SFX_MUTE_CHANGED' && typeof d.muted === 'boolean') {
        setMuted(d.muted);
      }
    });
  }

  root.DICVSFX = {
    play: play,
    setMuted: setMuted,
    isMuted: isMuted
  };
})(typeof window !== 'undefined' ? window : globalThis);
