/**
 * DICV Interactive — Cinematic Animation & Motion Controller
 * Coordinates sequential entrances, drag & drop physics, and post-feedback reveal sequencing.
 * Complies with Daimler Brand Guidelines & WCAG 2.1 AA Reduced Motion.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.DICVMotionController = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function MotionController(config) {
    this.quizId = config.quizId || 'Q000';
    this.container = config.container || document.querySelector('.quiz-container') || document.querySelector('.quiz-viewport') || document.body;
    this.bridge = config.bridge || null;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isEntranceComplete = false;
    this.init();
  }

  MotionController.prototype.init = function () {
    var self = this;
    // Watch for system reduced-motion preference changes
    try {
      var mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      mql.addEventListener('change', function (e) {
        self.reducedMotion = e.matches;
      });
    } catch (e) {}

    // Check for test/QA harness settled URL param
    try {
      var params = new URLSearchParams(window.location.search);
      if (params.get('settled') === 'true' || params.get('state')) {
        this.container.classList.add('motion-instant-ready');
        this.isEntranceComplete = true;
      }
    } catch (e) {}
  };

  /**
   * Dispatch lifecycle motion events to Storyline / parent harness
   */
  MotionController.prototype.emit = function (eventName, detail) {
    var payload = { quizId: this.quizId, timestamp: Date.now(), data: detail || {} };
    if (this.bridge && typeof this.bridge.sendToParent === 'function') {
      this.bridge.sendToParent(eventName, payload);
    }
    window.dispatchEvent(new CustomEvent('dicv-motion:' + eventName, { detail: payload }));
  };

  /**
   * Sequential Entrance Choreographer
   * Elements enter one after another: Header -> Diagram -> Instructions -> Cards -> Submit
   */
  MotionController.prototype.playEntrance = function (options) {
    options = options || {};
    var isRevisit = options.isRevisit || false;
    var onComplete = options.onComplete || function () {};

    if (this.reducedMotion || isRevisit || this.isEntranceComplete) {
      this.container.classList.add('motion-instant-ready');
      this.isEntranceComplete = true;
      this.emit('QUIZ_ENTRANCE_COMPLETE', { instant: true });
      onComplete();
      return;
    }

    this.container.classList.remove('motion-instant-ready');
    this.emit('QUIZ_ENTRANCE_START');

    // Total entrance duration is paced at ~1.35 seconds
    var self = this;
    var totalEntranceDuration = options.totalDuration || 1350;

    setTimeout(function () {
      self.isEntranceComplete = true;
      self.emit('QUIZ_ENTRANCE_COMPLETE', { instant: false });
      onComplete();
    }, totalEntranceDuration);
  };

  /**
   * Drag & Drop Invalid-Drop Auto-Return Animation
   * Eases the card smoothly back to its home origin without teleporting or aggressive shake.
   */
  MotionController.prototype.animateInvalidReturn = function (cardEl, homeRect, onComplete) {
    if (this.reducedMotion) {
      cardEl.style.transform = '';
      cardEl.style.left = '';
      cardEl.style.top = '';
      if (onComplete) onComplete();
      return;
    }

    var currentRect = cardEl.getBoundingClientRect();
    var deltaX = homeRect.left - currentRect.left;
    var deltaY = homeRect.top - currentRect.top;

    cardEl.classList.remove('motion-drag-lifted');
    cardEl.classList.add('motion-invalid-return');
    cardEl.style.transform = 'translate(' + deltaX + 'px, ' + deltaY + 'px) scale(1)';

    setTimeout(function () {
      cardEl.classList.remove('motion-invalid-return');
      cardEl.style.transform = '';
      cardEl.style.left = '';
      cardEl.style.top = '';
      if (onComplete) onComplete();
    }, 380);
  };

  /**
   * Drag & Drop Successful Snap Pulse
   */
  MotionController.prototype.animateDropSnap = function (cardEl, targetEl, onComplete) {
    this.emit('QUIZ_DROP_SUCCESS', { targetId: targetEl.getAttribute('data-target-id') || targetEl.id });

    if (this.reducedMotion) {
      cardEl.classList.remove('motion-drag-lifted');
      if (onComplete) onComplete();
      return;
    }

    cardEl.classList.remove('motion-drag-lifted');
    cardEl.classList.add('motion-snap-success');
    targetEl.classList.add('motion-target-hover');

    setTimeout(function () {
      cardEl.classList.remove('motion-snap-success');
      targetEl.classList.remove('motion-target-hover');
      if (onComplete) onComplete();
    }, 320);
  };

  /**
   * FLIP Swap Transition for Card Swapping
   */
  MotionController.prototype.animateCardSwap = function (cardA, cardB, doLogicalSwap) {
    if (this.reducedMotion) {
      doLogicalSwap();
      return;
    }

    var rectA1 = cardA.getBoundingClientRect();
    var rectB1 = cardB ? cardB.getBoundingClientRect() : null;

    doLogicalSwap();

    var rectA2 = cardA.getBoundingClientRect();
    var invertAX = rectA1.left - rectA2.left;
    var invertAY = rectA1.top - rectA2.top;

    cardA.style.transform = 'translate(' + invertAX + 'px, ' + invertAY + 'px)';
    cardA.style.transition = 'none';

    if (cardB && rectB1) {
      var rectB2 = cardB.getBoundingClientRect();
      var invertBX = rectB1.left - rectB2.left;
      var invertBY = rectB1.top - rectB2.top;
      cardB.style.transform = 'translate(' + invertBX + 'px, ' + invertBY + 'px)';
      cardB.style.transition = 'none';
    }

    requestAnimationFrame(function () {
      cardA.classList.add('motion-flip-transition');
      cardA.style.transform = '';
      cardA.style.transition = '';

      if (cardB) {
        cardB.classList.add('motion-flip-transition');
        cardB.style.transform = '';
        cardB.style.transition = '';
      }

      setTimeout(function () {
        cardA.classList.remove('motion-flip-transition');
        if (cardB) cardB.classList.remove('motion-flip-transition');
      }, 320);
    });
  };

  /**
   * Staggered Post-Feedback Correct-Answer Reveal Sequencer
   * Triggered strictly AFTER Storyline feedback completes
   */
  MotionController.prototype.sequenceAnswerReveal = function (items, onComplete) {
    this.emit('QUIZ_REVEAL_ANSWERS');

    if (this.reducedMotion) {
      items.forEach(function (item) {
        if (item.status === 'CORRECT') item.element.classList.add('motion-reveal-correct');
        else if (item.status === 'INCORRECT') item.element.classList.add('motion-reveal-incorrect');
        else if (item.status === 'MISSED') item.element.classList.add('motion-reveal-missed');
      });
      if (onComplete) onComplete();
      return;
    }

    var staggerInterval = 220; // Staggered progression
    items.forEach(function (item, idx) {
      setTimeout(function () {
        if (item.status === 'CORRECT') {
          item.element.classList.add('motion-reveal-correct');
        } else if (item.status === 'INCORRECT') {
          item.element.classList.add('motion-reveal-incorrect');
        } else if (item.status === 'MISSED') {
          item.element.classList.add('motion-reveal-missed');
        }
      }, idx * staggerInterval);
    });

    var totalRevealTime = (items.length * staggerInterval) + 400;
    setTimeout(function () {
      if (onComplete) onComplete();
    }, totalRevealTime);
  };

  return MotionController;
});
