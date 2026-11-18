/**
 * DICV Interactive — Articulate Storyline 360 Bridge Protocol
 * Module: WebObjects/shared/storyline/storyline-bridge.js
 *
 * Implements the bidirectional contract between the HTML Web Object iframe
 * and Articulate Storyline 360 (via GetPlayer() API or postMessage).
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.DICVStorylineBridge = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var PROTOCOL_VERSION = '1.0.0';

  function parseBoolVar(val) {
    return val === true || val === 'true' || val === 1 || val === '1';
  }

  function findStorylinePlayer() {
    // 1. Try window.parent
    try {
      if (window.parent && typeof window.parent.GetPlayer === 'function') {
        return window.parent.GetPlayer();
      }
    } catch (e) {}

    // 2. Try window.top
    try {
      if (window.top && typeof window.top.GetPlayer === 'function') {
        return window.top.GetPlayer();
      }
    } catch (e) {}

    // 3. Try traversing parent hierarchy
    try {
      var curr = window;
      while (curr.parent && curr.parent !== curr) {
        curr = curr.parent;
        if (typeof curr.GetPlayer === 'function') {
          return curr.GetPlayer();
        }
      }
    } catch (e) {}

    // 4. Try window.opener (for popout Web Objects)
    try {
      if (window.opener && typeof window.opener.GetPlayer === 'function') {
        return window.opener.GetPlayer();
      }
    } catch (e) {}

    return null;
  }

  function StorylineBridge(config) {
    this.quizId = config.quizId || 'UNKNOWN_QUIZ';
    this.variableMap = config.storylineVariables || {};
    this.onStateReceived = config.onStateReceived || function () {};
    this.onRevealAnswers = config.onRevealAnswers || function () {};
    this.onResetAttempt = config.onResetAttempt || function () {};
    this.allowedOrigins = config.allowedOrigins || ['*']; // Configurable for production

    this.state = {
      attemptId: 'attempt-1',
      draftSelection: null,
      submitted: false,
      submittedSelection: null,
      result: null,
      revealed: false
    };

    this.player = null;
    this.isStorylineAvailable = false;
    this._pollingInterval = null;
    this.init();
  }

  StorylineBridge.prototype.getPlayer = function () {
    if (!this.player) {
      this.player = findStorylinePlayer();
      if (this.player) {
        this.isStorylineAvailable = true;
      }
    }
    return this.player;
  };

  StorylineBridge.prototype.startPolling = function () {
    if (this._pollingInterval || this.state.revealed) return;
    var self = this;
    var revealedVar = this.variableMap.revealed || (this.quizId + '_Revealed');

    this._pollingInterval = setInterval(function () {
      try {
        if (self.state.revealed) {
          self.stopPolling();
          return;
        }
        var p = self.getPlayer();
        if (!p || typeof p.GetVar !== 'function') return;

        var val1 = p.GetVar(revealedVar);
        var val2 = p.GetVar(revealedVar.toLowerCase());
        var isRev = parseBoolVar(val1) || parseBoolVar(val2);
        if (isRev && !self.state.revealed) {
          self.state.revealed = true;
          self.stopPolling();
          console.log('[DICV StorylineBridge] Poller detected ' + revealedVar + ' = true. Triggering review mode.');
          self.onRevealAnswers(self.state.submittedSelection);
        }
      } catch (e) {}
    }, 150);
  };

  StorylineBridge.prototype.stopPolling = function () {
    if (this._pollingInterval) {
      clearInterval(this._pollingInterval);
      this._pollingInterval = null;
    }
  };

  StorylineBridge.prototype.init = function () {
    var self = this;

    // Check if Storyline GetPlayer() is available directly
    this.getPlayer();

    // Set up postMessage listener (with cleanup on unload)
    this._messageHandler = function (event) {
      self.handleIncomingMessage(event);
    };
    window.addEventListener('message', this._messageHandler);
    this._unloadHandler = function () {
      self.destroy();
    };
    window.addEventListener('pagehide', this._unloadHandler);

    // Notify parent that Web Object is loaded and ready
    this.sendToParent('QUIZ_READY', {
      quizId: this.quizId,
      protocolVersion: PROTOCOL_VERSION,
      timestamp: Date.now(),
      nonce: this.generateId()
    });

    // If direct player is available, read state immediately
    if (this.player) {
      this.syncFromDirectPlayer();
    }

    // Start polling only if not already revealed
    if (!this.state.revealed) {
      this.startPolling();
    }
  };

  StorylineBridge.prototype.destroy = function () {
    this.stopPolling();
    if (this._messageHandler) {
      window.removeEventListener('message', this._messageHandler);
      this._messageHandler = null;
    }
    if (this._unloadHandler) {
      window.removeEventListener('pagehide', this._unloadHandler);
      this._unloadHandler = null;
    }
  };

  StorylineBridge.prototype.generateId = function () {
    return 'evt_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  };

  StorylineBridge.prototype.syncFromDirectPlayer = function () {
    try {
      var submittedVar = this.variableMap.submitted || (this.quizId + '_Done');
      var answersVar = this.variableMap.answers || this.variableMap.answer || (this.quizId + '_Answers');
      var revealedVar = this.variableMap.revealed || (this.quizId + '_Revealed');
      var correctVar = this.variableMap.correct || (this.quizId + '_Correct');

      var isSubmitted = parseBoolVar(this.player.GetVar(submittedVar)) || parseBoolVar(this.player.GetVar(submittedVar.toLowerCase()));
      var savedAnswers = this.player.GetVar(answersVar);
      if ((savedAnswers === null || savedAnswers === undefined || savedAnswers === '') && this.quizId) {
        savedAnswers = this.player.GetVar(this.quizId + '_answers');
      }
      var isRevealed = parseBoolVar(this.player.GetVar(revealedVar)) || parseBoolVar(this.player.GetVar(revealedVar.toLowerCase()));
      var rawCorrect = this.player.GetVar(correctVar);
      var isCorrect = (rawCorrect !== null && rawCorrect !== undefined && rawCorrect !== '') ? parseBoolVar(rawCorrect) : null;

      var parsedAnswers = null;
      if (savedAnswers) {
        try {
          parsedAnswers = JSON.parse(savedAnswers);
        } catch (e) {
          parsedAnswers = savedAnswers;
        }
      }

      this.state.submitted = isSubmitted;
      this.state.submittedSelection = parsedAnswers;
      this.state.isCorrect = isCorrect;
      this.state.result = isCorrect;
      this.state.revealed = isRevealed;

      this.onStateReceived(this.state);

      if (isRevealed) {
        this.stopPolling();
        this.onRevealAnswers(parsedAnswers);
      }
    } catch (e) {
      console.warn('[DICV StorylineBridge] Direct GetVar read failed:', e);
    }
  };

  StorylineBridge.prototype.handleIncomingMessage = function (event) {
    // When embedded in an iframe, ignore messages from unrelated sibling/extension frames unless explicitly from parent/top/opener/self
    if (window.parent && window.parent !== window && event.source) {
      if (event.source !== window.parent && event.source !== window.top && event.source !== window.opener && event.source !== window) {
        return;
      }
    }
    var data = event.data;
    if (!data || typeof data !== 'object') {
      return;
    }
    if (data.quizId && data.quizId !== this.quizId) {
      return;
    }
    var payload = (data.payload && typeof data.payload === 'object') ? data.payload : {};

    switch (data.type) {
      case 'QUIZ_STATE':
        this.state = Object.assign(this.state, payload);
        this.onStateReceived(this.state);
        if (this.state.revealed) {
          this.stopPolling();
          this.onRevealAnswers(this.state.submittedSelection);
        }
        break;

      case 'QUIZ_SUBMIT_ACK':
        this.state.submitted = true;
        if (payload.answers !== undefined) {
          this.state.submittedSelection = payload.answers;
        }
        if (payload.result !== undefined) {
          this.state.result = payload.result;
        }
        break;

      case 'QUIZ_REVEAL_ANSWERS':
        if (this.state.revealed) {
          return;
        }
        this.state.revealed = true;
        this.stopPolling();
        this.onRevealAnswers(this.state.submittedSelection);
        break;

      case 'QUIZ_RESET_ATTEMPT':
        this.state = {
          attemptId: payload.attemptId || this.generateId(),
          draftSelection: null,
          submitted: false,
          submittedSelection: null,
          result: null,
          revealed: false
        };
        // Clear Storyline Done/Revealed flags on explicit reset so retry submission is permitted
        var resetPlayer = this.getPlayer();
        if (resetPlayer && typeof resetPlayer.SetVar === 'function') {
          var resetSubVar = this.variableMap.submitted || (this.quizId + '_Done');
          var resetRevVar = this.variableMap.revealed || (this.quizId + '_Revealed');
          try { resetPlayer.SetVar(resetSubVar, false); } catch (eRs1) {}
          try { resetPlayer.SetVar(resetSubVar.toLowerCase(), false); } catch (eRs2) {}
          try { resetPlayer.SetVar(resetRevVar, false); } catch (eRs3) {}
          try { resetPlayer.SetVar(resetRevVar.toLowerCase(), false); } catch (eRs4) {}
        }
        this.startPolling();
        this.onResetAttempt();
        break;

      default:
        break;
    }
  };

  StorylineBridge.prototype.sendToParent = function (type, payload) {
    var message = {
      protocol: 'DICV_STORYLINE_INTERACTIVE',
      version: PROTOCOL_VERSION,
      quizId: this.quizId,
      type: type,
      payload: payload
    };

    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(message, '*');
      }
    } catch (e) {}

    try {
      if (window.top && window.top !== window && window.top !== window.parent) {
        window.top.postMessage(message, '*');
      }
    } catch (e) {}
  };

  StorylineBridge.prototype.notifyDraftChange = function (selection) {
    this.state.draftSelection = selection;
    this.sendToParent('QUIZ_DRAFT_CHANGE', {
      selection: selection,
      timestamp: Date.now()
    });
  };

  StorylineBridge.prototype.submit = function (selection, isCorrect) {
    if (this.state.submitted) {
      console.warn('[DICV StorylineBridge] Submission already committed for this attempt.');
      return false;
    }

    var p = this.getPlayer();
    var submittedVar = this.variableMap.submitted || (this.quizId + '_Done');
    var answersVar = this.variableMap.answers || this.variableMap.answer || (this.quizId + '_Answers');
    var correctVar = this.variableMap.correct || (this.quizId + '_Correct');
    var revealedVar = this.variableMap.revealed || (this.quizId + '_Revealed');

    // Guard against stale/reloaded Web Object state when Storyline already recorded completion
    if (p && typeof p.GetVar === 'function') {
      try {
        var alreadyDone = parseBoolVar(p.GetVar(submittedVar)) || parseBoolVar(p.GetVar(submittedVar.toLowerCase()));
        var alreadyRevealed = parseBoolVar(p.GetVar(revealedVar)) || parseBoolVar(p.GetVar(revealedVar.toLowerCase()));
        if (alreadyDone || alreadyRevealed) {
          console.warn('[DICV StorylineBridge] Storyline already recorded completion for ' + this.quizId + '. Restoring saved state.');
          this.syncFromDirectPlayer();
          return false;
        }
      } catch (eGuard) {}
    }

    var eventId = this.generateId();
    var playerFound = false;

    if (p && typeof p.SetVar === 'function') {
      playerFound = true;
      var jsonAnswers = typeof selection === 'string' ? selection : JSON.stringify(selection);
      var answersSaved = false;
      var correctSaved = (typeof isCorrect === 'undefined');

      // 1. Save answers string variable (required before Done)
      try {
        p.SetVar(answersVar, jsonAnswers);
        answersSaved = true;
        try { p.SetVar(this.quizId + '_answers', jsonAnswers); } catch (eLowerA) {}
      } catch (eAns) {
        console.warn('[DICV StorylineBridge] Failed to save ' + answersVar + ':', eAns);
      }

      // 2. Save correct boolean variable BEFORE trigger fires (required before Done)
      var boolCorrect = Boolean(isCorrect);
      if (answersSaved && typeof isCorrect !== 'undefined') {
        try {
          p.SetVar(correctVar, boolCorrect);
          correctSaved = true;
          try { p.SetVar(this.quizId + '_correct', boolCorrect); } catch (eLowerC) {}
        } catch (eCorr) {
          console.warn('[DICV StorylineBridge] Failed to save ' + correctVar + ':', eCorr);
        }
      }

      // Abort cleanly without deducting lives or marking Done if required writes failed
      if (!answersSaved || !correctSaved) {
        this.state.submitted = false;
        return false;
      }

      // 3. Commit in-memory submission state & deduct 1 life heart on incorrect submission
      this.state.submitted = true;
      this.state.lastSubmissionId = eventId;
      this.state.submittedSelection = selection;
      this.state.result = isCorrect;

      if (typeof isCorrect !== 'undefined' && !boolCorrect && typeof p.GetVar === 'function') {
        try {
          var curLives = p.GetVar('LivesRemaining');
          if (curLives !== null && curLives !== undefined && String(curLives).trim() !== '') {
            var nLives = Number(curLives);
            if (isFinite(nLives) && nLives > 0) {
              p.SetVar('LivesRemaining', Math.max(0, Math.round(nLives) - 1));
            }
          }
        } catch (eLives) {}
      }

      // 4. Set submitted Done variable only after answer and correctness are confirmed saved
      var self = this;
      var currVal = false;
      try { currVal = p.GetVar(submittedVar); } catch (e) {}

      var commitDone = function () {
        try { p.SetVar(submittedVar, true); } catch (e) {}
        try { p.SetVar(submittedVar.toLowerCase(), true); } catch (e) {}
        console.log('[DICV StorylineBridge] SetVar committed successfully:', {
          quizId: self.quizId,
          answersVar: answersVar,
          correctVar: correctVar,
          correct: isCorrect,
          submittedVar: submittedVar
        });
      };

      if (parseBoolVar(currVal)) {
        try { p.SetVar(submittedVar, false); } catch (e) {}
        setTimeout(commitDone, 35);
      } else {
        setTimeout(commitDone, 25);
      }

      // Ensure poller is actively running to catch Qxxx_Revealed = true
      this.startPolling();
    } else {
      this.state.submitted = true;
      this.state.lastSubmissionId = eventId;
      this.state.submittedSelection = selection;
      this.state.result = isCorrect;
    }

    // Send Authoritative Submit Request to Storyline via postMessage
    this.sendToParent('QUIZ_SUBMIT_REQUEST', {
      eventId: eventId,
      answers: selection,
      isCorrect: isCorrect,
      timestamp: Date.now()
    });

    return playerFound;
  };

  return StorylineBridge;
});
