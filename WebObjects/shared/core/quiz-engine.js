/**
 * DICV Interactive — Core Quiz Controller
 * Module: WebObjects/shared/core/quiz-engine.js
 *
 * Coordinates quiz configuration, rendering, canvas sizing,
 * keyboard accessibility, and Storyline bridge synchronization.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['../storyline/storyline-bridge.js', '../components/ui-components.js'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../storyline/storyline-bridge.js'), require('../components/ui-components.js'));
  } else {
    root.DICVQuizEngine = factory(root.DICVStorylineBridge, root.DICVComponents);
  }
})(typeof self !== 'undefined' ? self : this, function (StorylineBridge, Components) {
  'use strict';

  function QuizEngine(config) {
    this.config = config || {};
    this.quizId = config.quizId || 'Q000';
    this.container = null;
    this.selectedOptions = [];
    this.isMultiple = config.type === 'multiple_response';
    this.bridge = null;

    this.init();
  }

  QuizEngine.prototype.init = function () {
    this.setupCanvas();
    this.initBridge();
  };

  /**
   * Applies configurable canvas dimensions and border radii
   */
  QuizEngine.prototype.setupCanvas = function () {
    var canvasConfig = this.config.canvas || {};
    var root = document.documentElement;

    if (canvasConfig.width) {
      root.style.setProperty('--canvas-width', typeof canvasConfig.width === 'number' ? canvasConfig.width + 'px' : canvasConfig.width);
    }
    if (canvasConfig.height) {
      root.style.setProperty('--canvas-height', typeof canvasConfig.height === 'number' ? canvasConfig.height + 'px' : canvasConfig.height);
    }
    if (canvasConfig.radius !== undefined && canvasConfig.radius !== null) {
      root.style.setProperty('--canvas-radius', typeof canvasConfig.radius === 'number' ? canvasConfig.radius + 'px' : canvasConfig.radius);
    }
  };

  QuizEngine.prototype.initBridge = function () {
    var self = this;
    if (typeof StorylineBridge === 'function') {
      this.bridge = new StorylineBridge({
        quizId: this.quizId,
        storylineVariables: this.config.storylineVariables,
        onStateReceived: function (state) {
          self.handleStateRestoration(state);
        },
        onRevealAnswers: function (submittedSelection) {
          self.revealAnswers(submittedSelection);
        },
        onResetAttempt: function () {
          self.resetState();
        }
      });
    }
  };

  QuizEngine.prototype.handleStateRestoration = function (state) {
    if (state.submitted) {
      this.lockQuiz(state.submittedSelection);
    } else if (state.draftSelection) {
      this.restoreDraft(state.draftSelection);
    }
  };

  QuizEngine.prototype.selectOption = function (optionId, cardElement) {
    if (this.bridge && this.bridge.state.submitted) return;

    if (this.isMultiple) {
      var idx = this.selectedOptions.indexOf(optionId);
      if (idx > -1) {
        this.selectedOptions.splice(idx, 1);
        cardElement.classList.remove('is-selected');
        cardElement.setAttribute('aria-checked', 'false');
      } else {
        this.selectedOptions.push(optionId);
        cardElement.classList.add('is-selected');
        cardElement.setAttribute('aria-checked', 'true');
      }
    } else {
      this.selectedOptions = [optionId];
      var allCards = document.querySelectorAll('.dicv-answer-card');
      allCards.forEach(function (c) {
        c.classList.remove('is-selected');
        c.setAttribute('aria-checked', 'false');
      });
      cardElement.classList.add('is-selected');
      cardElement.setAttribute('aria-checked', 'true');
    }

    // Update Submit button status
    var submitBtn = document.getElementById('btn-submit');
    if (submitBtn) {
      submitBtn.disabled = this.selectedOptions.length === 0;
    }

    // Notify draft change
    if (this.bridge) {
      this.bridge.notifyDraftChange(this.selectedOptions);
    }
  };

  QuizEngine.prototype.submit = function () {
    if (this.selectedOptions.length === 0) return;
    if (this.bridge) {
      this.bridge.submit(this.selectedOptions);
    }
    this.lockQuiz(this.selectedOptions);
  };

  QuizEngine.prototype.lockQuiz = function (selectedOptions) {
    var canvas = document.querySelector('.dicv-canvas');
    if (canvas) {
      canvas.classList.add('is-submitted', 'is-locked');
    }

    var submitBtn = document.getElementById('btn-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
    }

    var resetBtn = document.getElementById('btn-reset');
    if (resetBtn) {
      resetBtn.disabled = true;
    }

    // Ensure selected cards match submitted selections
    if (selectedOptions) {
      var selArray = Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions];
      var allCards = document.querySelectorAll('.dicv-answer-card');
      allCards.forEach(function (card) {
        if (selArray.indexOf(card.dataset.optionId) > -1) {
          card.classList.add('is-selected');
          card.setAttribute('aria-checked', 'true');
        } else {
          card.classList.remove('is-selected');
          card.setAttribute('aria-checked', 'false');
        }
      });
    }
  };

  QuizEngine.prototype.restoreDraft = function (draftOptions) {
    if (!draftOptions) return;
    var draftArray = Array.isArray(draftOptions) ? draftOptions : [draftOptions];
    this.selectedOptions = draftArray.slice();

    var allCards = document.querySelectorAll('.dicv-answer-card');
    allCards.forEach(function (card) {
      if (draftArray.indexOf(card.dataset.optionId) > -1) {
        card.classList.add('is-selected');
        card.setAttribute('aria-checked', 'true');
      }
    });

    var submitBtn = document.getElementById('btn-submit');
    if (submitBtn) {
      submitBtn.disabled = this.selectedOptions.length === 0;
    }
  };

  QuizEngine.prototype.revealAnswers = function (userSelection) {
    var approvedKeys = this.config.approvedAnswerKey;
    if (!approvedKeys) return;
    var correctArray = Array.isArray(approvedKeys) ? approvedKeys : [approvedKeys];
    var selArray = userSelection ? (Array.isArray(userSelection) ? userSelection : [userSelection]) : this.selectedOptions;

    var allCards = document.querySelectorAll('.dicv-answer-card');
    allCards.forEach(function (card) {
      var optId = card.dataset.optionId;
      var isApproved = correctArray.indexOf(optId) > -1;
      var wasSelected = selArray.indexOf(optId) > -1;

      if (isApproved) {
        card.classList.add('is-revealed-correct');
      } else if (wasSelected && !isApproved) {
        card.classList.add('is-revealed-incorrect');
      }
    });
  };

  QuizEngine.prototype.resetState = function () {
    this.selectedOptions = [];
    var canvas = document.querySelector('.dicv-canvas');
    if (canvas) {
      canvas.classList.remove('is-submitted', 'is-locked');
    }
    var allCards = document.querySelectorAll('.dicv-answer-card');
    allCards.forEach(function (card) {
      card.classList.remove('is-selected', 'is-revealed-correct', 'is-revealed-incorrect');
      card.setAttribute('aria-checked', 'false');
    });
    var submitBtn = document.getElementById('btn-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
    }
    var resetBtn = document.getElementById('btn-reset');
    if (resetBtn) {
      resetBtn.disabled = false;
    }
  };

  return QuizEngine;
});
