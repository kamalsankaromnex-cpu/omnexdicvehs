/**
 * coursemap-bridge.js — Web Object-side Bridge for CourseMapOverlay
 * Communicates with Storyline parent via postMessage + GetPlayer() fallback.
 */
(function (root) {
  'use strict';

  function parseBoolVar(val) {
    return val === true || val === 'true' || val === 1 || val === '1';
  }

  function parseProgress(raw) {
    var fallback = { v: 1, t: {}, last: null };
    if (!raw) return fallback;
    if (typeof raw === 'object') {
      return { v: 1, t: raw.t || {}, last: typeof raw.last === 'number' ? raw.last : null };
    }
    try {
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return fallback;
      return {
        v: 1,
        t: parsed.t && typeof parsed.t === 'object' ? parsed.t : {},
        last: typeof parsed.last === 'number' ? parsed.last : null
      };
    } catch (e) {
      return fallback;
    }
  }

  function CourseMapBridge(options) {
    this.opts = options || {};
    this.state = {
      navigationMode: false,
      progress: { v: 1, t: {}, last: null }
    };
    this._pollId = null;
    this._boundMessage = this._onMessage.bind(this);
    this._boundDestroy = this.destroy.bind(this);

    root.addEventListener('message', this._boundMessage);
    root.addEventListener('pagehide', this._boundDestroy);

    this.syncFromPlayer();
    this.send('READY', { timestamp: Date.now() });
    this._startPoll();
  }

  CourseMapBridge.prototype.getPlayer = function () {
    try {
      if (root.parent && root.parent !== root && typeof root.parent.GetPlayer === 'function') {
        return root.parent.GetPlayer();
      }
      if (root.top && root.top !== root && typeof root.top.GetPlayer === 'function') {
        return root.top.GetPlayer();
      }
      if (typeof root.GetPlayer === 'function') {
        return root.GetPlayer();
      }
    } catch (e) {}
    return null;
  };

  CourseMapBridge.prototype.syncFromPlayer = function () {
    var p = this.getPlayer();
    if (!p || typeof p.GetVar !== 'function') return false;
    try {
      var navMode = parseBoolVar(p.GetVar('NavigationMode'));
      var rawProg = p.GetVar('CourseProgressData');
      var prog = parseProgress(rawProg);
      var prevJson = JSON.stringify(this.state);
      var nextState = { navigationMode: navMode, progress: prog };
      if (prevJson !== JSON.stringify(nextState)) {
        this.state = nextState;
        if (typeof this.opts.onState === 'function') {
          this.opts.onState(this.state);
        }
      }
      return true;
    } catch (e) {
      return false;
    }
  };

  CourseMapBridge.prototype._startPoll = function () {
    var self = this;
    if (this._pollId) return;
    this._pollId = root.setInterval(function () {
      self.syncFromPlayer();
    }, 350);
  };

  CourseMapBridge.prototype.send = function (type, payload) {
    var msg = {
      source: 'DICV_COURSEMAP_WEBOBJECT',
      type: type,
      payload: payload || {}
    };
    try {
      if (root.parent && root.parent !== root) {
        root.parent.postMessage(msg, '*');
      }
    } catch (e) {}
  };

  CourseMapBridge.prototype.requestMission = function (missionId) {
    var idNum = Number(missionId);
    if (!Number.isFinite(idNum) || idNum <= 0) return;

    // Prefer Storyline-side host if directly reachable, else postMessage
    try {
      if (root.parent && root.parent.DICV_CourseMapHost) {
        root.parent.DICV_CourseMapHost.handleOpenMission(idNum, root);
        return;
      }
    } catch (e) {}

    this.send('OPEN_MISSION', { missionId: idNum });
  };

  CourseMapBridge.prototype.requestClose = function () {
    var player = this.getPlayer();
    if (!player || typeof player.GetVar !== 'function' || typeof player.SetVar !== 'function') return false;
    try {
      var requested = player.GetVar('CourseMapCloseRequested');
      if (typeof requested !== 'boolean' && !/^(true|false)$/i.test(String(requested))) return false;
      player.SetVar('CourseMapCloseRequested', !parseBoolVar(requested));
      return true;
    } catch (e) {
      return false;
    }
  };

  CourseMapBridge.prototype.requestModeToggle = function () {
    try {
      if (root.parent && root.parent.DICV_CourseMapHost) {
        root.parent.DICV_CourseMapHost.toggleNavigationMode();
        return;
      }
    } catch (e) {}

    this.send('CHANGE_MODE', {});
  };

  var TRANSITION_COMMANDS = {
    START_MODULE_INTRO: true,
    HIGHLIGHT_MODULE: true,
    REVEAL_TOPICS: true,
    SHOW_EARNED_STAR: true,
    MOVE_CONVEYOR_HIGHLIGHT: true,
    TRANSITION_COMPLETE: true,
    RESET_TRANSITION: true
  };

  CourseMapBridge.prototype._onMessage = function (event) {
    if (root.parent && root.parent !== root && event.source !== root.parent) return;
    var d = event && event.data;
    if (!d || typeof d !== 'object' || d.source !== 'DICV_STORYLINE_HOST') return;

    if (d.type === 'STATE' || d.type === 'PROGRESS_UPDATED') {
      var p = d.payload || {};
      this.state = {
        navigationMode: parseBoolVar(p.navigationMode),
        progress: parseProgress(p.progress)
      };
      if (typeof this.opts.onState === 'function') {
        this.opts.onState(this.state);
      }
    } else if (d.type === 'NAVIGATION_DENIED') {
      if (typeof this.opts.onDenied === 'function') {
        this.opts.onDenied(d.payload || {});
      }
    } else if (TRANSITION_COMMANDS[d.type]) {
      if (typeof this.opts.onTransitionCommand === 'function') {
        this.opts.onTransitionCommand(d.type, d.payload || {});
      }
    }
  };

  CourseMapBridge.prototype.destroy = function () {
    if (this._pollId) {
      root.clearInterval(this._pollId);
      this._pollId = null;
    }
    root.removeEventListener('message', this._boundMessage);
    root.removeEventListener('pagehide', this._boundDestroy);
  };

  root.DICVCourseMapBridge = CourseMapBridge;
})(typeof window !== 'undefined' ? window : globalThis);
