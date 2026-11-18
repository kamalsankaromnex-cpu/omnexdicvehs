/**
 * coursemap-storyline-host.js — Authoritative Storyline-Side JavaScript Host Bridge
 * Runs in the Storyline parent window (Slide Master / CourseMapOverlay).
 * Performs prerequisite authorization in JS (since native Storyline triggers cannot inspect JSON).
 * Uses ONLY the 3 shared Storyline variables:
 *   - NavigationMode (True/False: false = Restricted, true = Free)
 *   - CourseProgressData (Text: compact JSON)
 *   - RequestedMission (Number: 0 = idle, 101/102 = requested destination)
 */
(function (root) {
  'use strict';

  var VARS = {
    NAV_MODE: 'NavigationMode',
    PROGRESS: 'CourseProgressData',
    REQUESTED_MISSION: 'RequestedMission'
  };

  var lastModeToggleTs = 0;

  function parseBoolVar(val) {
    return val === true || val === 'true' || val === 1 || val === '1';
  }

  function getPlayer() {
    try {
      if (typeof root.GetPlayer === 'function') return root.GetPlayer();
      if (root.parent && root.parent !== root && typeof root.parent.GetPlayer === 'function') {
        return root.parent.GetPlayer();
      }
      if (root.top && root.top !== root && typeof root.top.GetPlayer === 'function') {
        return root.top.GetPlayer();
      }
    } catch (e) {}
    return null;
  }

  function parseProgress(raw) {
    var fallback = { v: 1, t: {}, last: null };
    if (!raw || typeof raw !== 'string') return fallback;
    try {
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return fallback;
      var topics = {};
      if (parsed.t && typeof parsed.t === 'object') {
        Object.keys(parsed.t).forEach(function (k) {
          var n = Number(parsed.t[k]);
          topics[String(k)] = (n === 1 || n === 2) ? n : 0;
        });
      }
      return {
        v: 1,
        t: topics,
        last: typeof parsed.last === 'number' ? parsed.last : null
      };
    } catch (e) {
      return fallback;
    }
  }

  function serializeProgress(prog) {
    return JSON.stringify({
      v: 1,
      t: prog.t || {},
      last: prog.last || null
    });
  }

  function getConfig() {
    return root.DICV_COURSE_MAP_CONFIG || { modules: [] };
  }

  function findTopic(missionId) {
    var idNum = Number(missionId);
    var mods = getConfig().modules || [];
    for (var i = 0; i < mods.length; i++) {
      var topics = mods[i].topics || [];
      for (var j = 0; j < topics.length; j++) {
        if (Number(topics[j].missionId) === idNum) {
          return { module: mods[i], topic: topics[j] };
        }
      }
    }
    return null;
  }

  function getTopicStatus(prog, missionId) {
    var val = prog && prog.t ? prog.t[String(missionId)] : 0;
    return (val === 1 || val === 2) ? val : 0;
  }

  function arePrereqsMet(prog, prereqs) {
    if (!prereqs || !prereqs.length) return true;
    for (var i = 0; i < prereqs.length; i++) {
      if (getTopicStatus(prog, prereqs[i]) !== 2) {
        return false;
      }
    }
    return true;
  }

  function isTopicAuthorized(missionId, prog, isFreeMode) {
    var found = findTopic(missionId);
    if (!found) return { ok: false, reason: 'Unknown mission ID.' };
    if (isFreeMode) return { ok: true, found: found };
    if (!arePrereqsMet(prog, found.module.prereqs)) {
      return { ok: false, reason: 'Complete the previous required topic to unlock this module.' };
    }
    if (!arePrereqsMet(prog, found.topic.prereqs)) {
      return { ok: false, reason: 'Complete the prerequisite topic first.' };
    }
    return { ok: true, found: found };
  }

  function readStateFromPlayer() {
    var p = getPlayer();
    if (!p) {
      return { navigationMode: false, progress: parseProgress(''), playerFound: false };
    }
    var navMode = false;
    var rawProg = '';
    try { navMode = parseBoolVar(p.GetVar(VARS.NAV_MODE)); } catch (e) {}
    try { rawProg = p.GetVar(VARS.PROGRESS); } catch (e2) {}
    return {
      navigationMode: navMode,
      progress: parseProgress(rawProg),
      playerFound: true
    };
  }

  function postToMapFrames(type, payload) {
    var msg = { source: 'DICV_STORYLINE_HOST', type: type, payload: payload || {} };
    try {
      var frames = root.document ? root.document.querySelectorAll('iframe') : [];
      for (var i = 0; i < frames.length; i++) {
        if (frames[i].contentWindow) {
          frames[i].contentWindow.postMessage(msg, '*');
        }
      }
    } catch (e) {}
  }

  function broadcastState(reasonType) {
    var st = readStateFromPlayer();
    postToMapFrames(reasonType || 'STATE', {
      navigationMode: st.navigationMode,
      progress: st.progress
    });
    return st;
  }

  function handleOpenMission(missionId, replyWindow) {
    var p = getPlayer();
    var st = readStateFromPlayer();
    var auth = isTopicAuthorized(missionId, st.progress, st.navigationMode);

    if (!auth.ok) {
      var deniedMsg = {
        source: 'DICV_STORYLINE_HOST',
        type: 'NAVIGATION_DENIED',
        payload: { missionId: Number(missionId), reason: auth.reason }
      };
      if (replyWindow && typeof replyWindow.postMessage === 'function') {
        replyWindow.postMessage(deniedMsg, '*');
      } else {
        postToMapFrames('NAVIGATION_DENIED', deniedMsg.payload);
      }
      return false;
    }

    // Record last visited mission without downgrading existing completion
    st.progress.last = Number(missionId);
    if (getTopicStatus(st.progress, missionId) === 0) {
      st.progress.t[String(missionId)] = 1;
    }

    if (p && typeof p.SetVar === 'function') {
      try { p.SetVar(VARS.PROGRESS, serializeProgress(st.progress)); } catch (e) {}
      // Reset to 0 first so repeated clicks on the same mission always trigger "When variable changes"
      try { p.SetVar(VARS.REQUESTED_MISSION, 0); } catch (e2) {}
      setTimeout(function () {
        try { p.SetVar(VARS.REQUESTED_MISSION, Number(missionId)); } catch (e3) {}
      }, 20);
    }

    return true;
  }

  function markTopicStatus(missionId, newStatus) {
    var status = Number(newStatus);
    if (status !== 0 && status !== 1 && status !== 2) return false;
    var p = getPlayer();
    var st = readStateFromPlayer();
    var key = String(missionId);
    var cur = getTopicStatus(st.progress, missionId);

    // Never downgrade genuine completion (2) back to In Progress (1) on revisit
    if (status > cur) {
      st.progress.t[key] = status;
    }
    st.progress.last = Number(missionId);

    if (p && typeof p.SetVar === 'function') {
      try { p.SetVar(VARS.PROGRESS, serializeProgress(st.progress)); } catch (e) {}
    }
    broadcastState('PROGRESS_UPDATED');
    return true;
  }

  function toggleNavigationMode() {
    var now = Date.now();
    if (now - lastModeToggleTs < 250) return null;
    lastModeToggleTs = now;

    var p = getPlayer();
    var st = readStateFromPlayer();
    var nextMode = !st.navigationMode;

    if (p && typeof p.SetVar === 'function') {
      try { p.SetVar(VARS.NAV_MODE, nextMode); } catch (e) {}
    }
    broadcastState('STATE');
    return nextMode;
  }

  function attachHostListeners() {
    if (root.__DICV_COURSE_MAP_HOST_ATTACHED__) return;
    root.__DICV_COURSE_MAP_HOST_ATTACHED__ = true;

    root.addEventListener('message', function (event) {
      var d = event && event.data;
      if (!d || typeof d !== 'object' || d.source !== 'DICV_COURSEMAP_WEBOBJECT') return;
      if (d.type === 'READY') {
        var st = readStateFromPlayer();
        if (event.source && typeof event.source.postMessage === 'function') {
          event.source.postMessage({
            source: 'DICV_STORYLINE_HOST',
            type: 'STATE',
            payload: { navigationMode: st.navigationMode, progress: st.progress }
          }, '*');
        }
      } else if (d.type === 'OPEN_MISSION' && d.payload && d.payload.missionId) {
        handleOpenMission(d.payload.missionId, event.source);
      } else if (d.type === 'CHANGE_MODE') {
        toggleNavigationMode();
      }
    });
  }

  attachHostListeners();

  root.DICV_CourseMapHost = {
    VARS: VARS,
    parseBoolVar: parseBoolVar,
    parseProgress: parseProgress,
    serializeProgress: serializeProgress,
    isTopicAuthorized: isTopicAuthorized,
    readStateFromPlayer: readStateFromPlayer,
    handleOpenMission: handleOpenMission,
    markTopicStatus: markTopicStatus,
    toggleNavigationMode: toggleNavigationMode,
    broadcastState: broadcastState
  };
})(typeof window !== 'undefined' ? window : globalThis);
