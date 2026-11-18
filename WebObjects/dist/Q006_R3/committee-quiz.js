/**
 * committee-quiz.js — Shared Interaction Controller for Q006 Scenarios
 * Used by Q006_R1, Q006_R2, and Q006_R3
 */
(function (global) {
  'use strict';

  function initCommitteeQuiz(roundKey) {
    var data = global.DICV_COMMITTEE_DATA && global.DICV_COMMITTEE_DATA[roundKey];
    if (!data) {
      console.error('Missing committee data for round:', roundKey);
      return;
    }

    var state = {
      selectedOptionId: null,
      status: 'READY', // 'READY', 'SUBMITTED', 'REVEALED'
      isCorrect: false
    };

    // DOM Elements
    var issueBadge = document.getElementById('issue-badge');
    var scenarioPill = document.getElementById('scenario-pill');
    var progressTracker = document.getElementById('progress-tracker');
    var scenarioImg = document.getElementById('scenario-image');
    var scenarioText = document.getElementById('scenario-text');
    var questionText = document.getElementById('question-text');
    var optionsGrid = document.getElementById('options-grid');
    var btnSubmit = document.getElementById('btn-submit');

    // Populate Static Content
    if (issueBadge) issueBadge.textContent = data.issueTitle;
    if (scenarioPill) scenarioPill.textContent = 'Scenario ' + data.roundIndex + ' of ' + data.totalRounds;
    if (scenarioImg) {
      scenarioImg.src = data.illustration;
      scenarioImg.alt = data.scenarioName;
    }
    if (scenarioText) scenarioText.textContent = data.scenarioText;
    if (questionText) questionText.textContent = data.questionText;

    // Render Progress Tracker (3 Steps matching reference image)
    if (progressTracker) {
      progressTracker.innerHTML = '';
      for (var i = 1; i <= data.totalRounds; i++) {
        var node = document.createElement('div');
        node.className = 'step-node';
        if (i < data.roundIndex) {
          node.classList.add('is-completed');
        } else if (i === data.roundIndex) {
          node.classList.add('is-active');
        }

        var circle = document.createElement('div');
        circle.className = 'step-circle';
        circle.textContent = i;
        node.appendChild(circle);

        if (i < data.totalRounds) {
          var line = document.createElement('div');
          line.className = 'step-line';
          node.appendChild(line);
        }

        progressTracker.appendChild(node);
      }
    }

    // Render Committee Option Cards
    if (optionsGrid) {
      optionsGrid.innerHTML = '';
      data.options.forEach(function (opt) {
        var card = document.createElement('div');
        card.className = 'committee-card';
        card.id = 'card-' + opt.id;
        card.setAttribute('data-option-id', opt.id);
        card.setAttribute('role', 'radio');
        card.setAttribute('aria-checked', 'false');
        card.setAttribute('tabindex', '0');

        card.innerHTML = 
          '<span class="card-status-badge"></span>' +
          '<div class="radio-control" aria-hidden="true">' +
            '<div class="radio-dot"></div>' +
          '</div>' +
          '<img class="committee-icon" src="' + opt.icon + '" alt="" aria-hidden="true">' +
          '<div class="committee-label">' + opt.label + '</div>';

        // Click Handler
        card.addEventListener('click', function () {
          if (state.status !== 'READY') return;
          if (global.DICVSFX) global.DICVSFX.play('select');
          selectOption(opt.id);
        });

        // Keyboard Handler
        card.addEventListener('keydown', function (e) {
          if (state.status !== 'READY') return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectOption(opt.id);
          }
        });

        optionsGrid.appendChild(card);
      });
    }

    // Selection Function
    function selectOption(optionId) {
      state.selectedOptionId = optionId;
      var cards = Array.from(document.querySelectorAll('.committee-card'));
      cards.forEach(function (c) {
        var cid = c.getAttribute('data-option-id');
        if (cid === optionId) {
          c.classList.add('is-selected');
          c.setAttribute('aria-checked', 'true');
        } else {
          c.classList.remove('is-selected');
          c.setAttribute('aria-checked', 'false');
        }
      });

      if (btnSubmit) {
        btnSubmit.disabled = (state.selectedOptionId === null || state.status !== 'READY');
      }
    }

    function normalizeCommitteeLabel(str) {
      return String(str || '').replace(/-\s+/g, '-').replace(/\s+/g, ' ').trim().toLowerCase();
    }

    function resolveOptionId(savedVal) {
      if (!savedVal) return null;
      var raw = typeof savedVal === 'string' ? savedVal : (savedVal.optionId || savedVal.id || '');
      var normalized = normalizeCommitteeLabel(raw);
      if (!normalized) return null;
      var matched = data.options.find(function (opt) {
        return opt.id.toLowerCase() === normalized || normalizeCommitteeLabel(opt.label) === normalized;
      });
      return matched ? matched.id : null;
    }

    function restoreFromBridgeState(bridgeState) {
      if (!bridgeState || !bridgeState.submitted) return;
      state.status = 'SUBMITTED';
      state.isCorrect = !!bridgeState.isCorrect;
      if (bridgeState.submittedSelection) {
        var prevId = resolveOptionId(bridgeState.submittedSelection);
        if (prevId) {
          selectOption(prevId);
        }
      }
      lockInteraction();
      if (bridgeState.revealed) {
        revealReviewMode();
      }
    }

    // Storyline Communication Bridge
    var bridge = new DICVStorylineBridge({
      quizId: data.quizId,
      autoPoll: true,
      pollIntervalMs: 150,
      storylineVariables: data.storylineVariables,
      onStateReceived: function (bridgeState) {
        restoreFromBridgeState(bridgeState);
      },
      onRevealAnswers: function () {
        revealReviewMode();
      },
      onResetAttempt: function () {
        resetQuiz();
      }
    });

    // Revisit Slide State Restoration
    if (bridge.state && bridge.state.submitted) {
      restoreFromBridgeState(bridge.state);
    }

    // Lock Interaction
    function lockInteraction() {
      var cards = Array.from(document.querySelectorAll('.committee-card'));
      cards.forEach(function (c) {
        c.classList.add('is-locked');
        c.setAttribute('tabindex', '-1');
      });
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.style.visibility = 'hidden';
        btnSubmit.style.pointerEvents = 'none';
      }
    }

    // Submit Handler
    if (btnSubmit) {
      btnSubmit.addEventListener('click', function () {
        if (btnSubmit.disabled || state.status !== 'READY' || !state.selectedOptionId) return;

        state.status = 'SUBMITTED';
        var isCorrect = (state.selectedOptionId === data.correctAnswerId);
        state.isCorrect = isCorrect;

        var selectedOpt = data.options.find(function (o) { return o.id === state.selectedOptionId; });
        var answerLabel = selectedOpt ? selectedOpt.label.replace(/\n/g, ' ') : state.selectedOptionId;

        lockInteraction();

        // Submit to Storyline Bridge
        bridge.submit(answerLabel, isCorrect);
        if (global.DICVSFX) global.DICVSFX.play(isCorrect ? 'correct' : 'incorrect');
        // In embedded Storyline mode, let Storyline show its feedback layer and trigger reveal via Q006_R*_Revealed
        if (!(bridge && bridge.isStorylineAvailable)) {
          showFeedbackPanel(isCorrect);
        }
      });
    }

    // Create & Manage Right-Side Feedback Panel
    var viewportEl = document.getElementById('quiz-viewport');
    var isHudPilot = Boolean(document.querySelector && document.querySelector('.quiz-board.is-hud-pilot'));
    var feedbackPanelEl = document.getElementById('feedback-side-panel');
    if (!feedbackPanelEl && viewportEl) {
      feedbackPanelEl = document.createElement('aside');
      feedbackPanelEl.className = isHudPilot ? 'feedback-side-panel is-two-portion' : 'feedback-side-panel';
      feedbackPanelEl.id = 'feedback-side-panel';
      feedbackPanelEl.setAttribute('role', 'status');
      feedbackPanelEl.setAttribute('aria-live', 'polite');
      feedbackPanelEl.setAttribute('aria-label', 'Quiz Feedback');
      if (isHudPilot) {
        feedbackPanelEl.innerHTML =
          '<div class="feedback-top-portion">' +
            '<div class="feedback-icon-circle" id="feedback-icon-circle" aria-hidden="true">' +
              '<svg class="feedback-icon-tick" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
              '<svg class="feedback-icon-cross" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
            '</div>' +
            '<div class="feedback-title-group">' +
              '<div class="feedback-badge" id="feedback-badge">Correct</div>' +
              '<div class="feedback-heading" id="feedback-heading">Correct!</div>' +
            '</div>' +
          '</div>' +
          '<div class="feedback-bottom-portion">' +
            '<div class="feedback-body" id="feedback-body"></div>' +
            '<div class="feedback-actions">' +
              '<button type="button" class="btn-submit btn-continue" id="btn-continue" aria-label="Continue to next slide">' +
                '<span>Continue</span>' +
                '<span class="submit-arrow">&#10132;</span>' +
              '</button>' +
            '</div>' +
          '</div>';
      } else {
        feedbackPanelEl.innerHTML =
          '<div class="feedback-header-row">' +
            '<div class="feedback-icon-circle" id="feedback-icon-circle" aria-hidden="true">' +
              '<svg class="feedback-icon-tick" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
              '<svg class="feedback-icon-cross" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
            '</div>' +
            '<div class="feedback-title-group">' +
              '<div class="feedback-badge" id="feedback-badge">Correct</div>' +
              '<div class="feedback-heading" id="feedback-heading">Correct!</div>' +
            '</div>' +
          '</div>' +
          '<div class="feedback-divider" aria-hidden="true"></div>' +
          '<div class="feedback-body" id="feedback-body"></div>' +
          '<div class="feedback-actions">' +
            '<button type="button" class="btn-submit btn-continue" id="btn-continue" aria-label="Continue to next slide">' +
              '<span>Continue</span>' +
              '<span class="submit-arrow">&#10132;</span>' +
            '</button>' +
          '</div>';
      }
      viewportEl.appendChild(feedbackPanelEl);
    }

    var feedbackBadgeEl = document.getElementById('feedback-badge');
    var feedbackHeadingEl = document.getElementById('feedback-heading');
    var feedbackBodyEl = document.getElementById('feedback-body');
    var btnContinue = document.getElementById('btn-continue');

    function showFeedbackPanel(isCorrect) {
      if (!feedbackPanelEl) return;
      var fb = data.feedback || {};
      feedbackPanelEl.classList.toggle('is-missed', !isCorrect);
      if (isCorrect) {
        if (feedbackBadgeEl) feedbackBadgeEl.textContent = 'Correct';
        if (feedbackHeadingEl) feedbackHeadingEl.textContent = fb.correctHeading || 'Correct!';
        if (feedbackBodyEl) feedbackBodyEl.textContent = fb.correctBody || '';
      } else {
        if (feedbackBadgeEl) feedbackBadgeEl.textContent = 'Incorrect';
        if (feedbackHeadingEl) feedbackHeadingEl.textContent = fb.incorrectHeading || 'Not quite!';
        if (feedbackBodyEl) feedbackBodyEl.textContent = fb.incorrectBody || '';
      }
      if (document.body && document.body.classList) {
        document.body.classList.add('is-feedback-split');
      }
    }

    if (btnContinue) {
      btnContinue.addEventListener('click', function () {
        var continueVar = (data.storylineVariables && data.storylineVariables.continueVar) || (data.quizId + '_Continue');
        var p = bridge && typeof bridge.getPlayer === 'function' ? bridge.getPlayer() : null;
        if (p && typeof p.SetVar === 'function') {
          try {
            var curVal = typeof p.GetVar === 'function' ? p.GetVar(continueVar) : false;
            var isAlreadyTrue = curVal === true || curVal === 'true' || curVal === 1 || curVal === '1';
            if (isAlreadyTrue) {
              p.SetVar(continueVar, false);
              setTimeout(function () {
                try {
                  p.SetVar(continueVar, true);
                  p.SetVar(continueVar.toLowerCase(), true);
                } catch (e2) {}
              }, 250);
            } else {
              p.SetVar(continueVar, true);
              p.SetVar(continueVar.toLowerCase(), true);
            }
          } catch (e) {}
        }
        if (bridge && typeof bridge.sendToParent === 'function') {
          bridge.sendToParent('QUIZ_CONTINUE_CLICKED', { timestamp: Date.now() });
        }
      });
    }

    // Review Mode (Triggered by Storyline Reveal)
    function revealReviewMode() {
      state.status = 'REVEALED';
      lockInteraction();

      var cards = Array.from(document.querySelectorAll('.committee-card'));
      cards.forEach(function (c) {
        var cid = c.getAttribute('data-option-id');
        var badge = c.querySelector('.card-status-badge');

        if (cid === data.correctAnswerId) {
          c.classList.add('is-review-correct');
          if (badge) {
            badge.style.display = '';
            badge.textContent = '✓ Correct';
          }
        } else if (cid === state.selectedOptionId) {
          c.classList.add('is-review-incorrect');
          if (badge) {
            badge.style.display = '';
            badge.textContent = '✕ Incorrect';
          }
        }
      });

      if (!(bridge && bridge.isStorylineAvailable)) {
        showFeedbackPanel(state.selectedOptionId === data.correctAnswerId);
      }
    }

    // Reset Quiz
    function resetQuiz() {
      state.selectedOptionId = null;
      state.status = 'READY';
      state.isCorrect = false;
      if (document.body && document.body.classList) {
        document.body.classList.remove('is-feedback-split');
      }

      var cards = Array.from(document.querySelectorAll('.committee-card'));
      cards.forEach(function (c) {
        c.classList.remove('is-selected', 'is-locked', 'is-review-correct', 'is-review-incorrect');
        c.setAttribute('aria-checked', 'false');
        c.setAttribute('tabindex', '0');
        var badge = c.querySelector('.card-status-badge');
        if (badge) {
          badge.textContent = '';
          badge.style.display = 'none';
        }
      });

      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.style.visibility = '';
        btnSubmit.style.pointerEvents = '';
      }
    }

    // Automated QA & Headless Capture URL Hooks: ?state=selected, ?state=review, ?no_anim=1
    try {
      var href = window.location.href;
      var searchMatch = href.match(/[?&]state=([^&]+)/);
      var hashMatch = href.match(/#([^?&]+)/);
      var qaState = searchMatch ? searchMatch[1] : (hashMatch ? hashMatch[1] : null);

      if (href.indexOf('no_anim=1') !== -1 || qaState) {
        document.documentElement.classList.add('no-animation');
      }

      if (qaState === 'selected') {
        selectOption(data.correctAnswerId);
      } else if (qaState === 'review') {
        var incOpt = data.options.find(function (o) { return o.id !== data.correctAnswerId; });
        selectOption(incOpt ? incOpt.id : data.correctAnswerId);
        state.status = 'SUBMITTED';
        revealReviewMode();
      } else if (qaState === 'review_correct') {
        selectOption(data.correctAnswerId);
        state.status = 'SUBMITTED';
        revealReviewMode();
      }
    } catch (e) {
      console.warn('QA hook init failed:', e);
    }
  }

  global.initCommitteeQuiz = initCommitteeQuiz;
})(window);
