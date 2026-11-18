/**
 * DICV Interactive — Reusable UI Components Generator
 * Module: WebObjects/shared/components/ui-components.js
 *
 * Implements accessible, standard DOM builders for Daimler quiz widgets.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.DICVComponents = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var DICVComponents = {};

  /**
   * Builds Question Header
   */
  DICVComponents.createHeader = function (props) {
    var header = document.createElement('header');
    header.className = 'dicv-header';

    var metaRow = document.createElement('div');
    metaRow.className = 'dicv-meta-row';

    if (props.quizId) {
      var badge = document.createElement('span');
      badge.className = 'dicv-badge';
      badge.textContent = props.quizId;
      metaRow.appendChild(badge);
    }

    if (props.category) {
      var catBadge = document.createElement('span');
      catBadge.className = 'dicv-badge dicv-badge-yellow';
      catBadge.textContent = props.category;
      metaRow.appendChild(catBadge);
    }

    header.appendChild(metaRow);

    var qTitle = document.createElement('h1');
    qTitle.className = 'dicv-question-text';
    qTitle.textContent = props.question || 'Quiz Question';
    header.appendChild(qTitle);

    if (props.instruction) {
      var inst = document.createElement('p');
      inst.className = 'dicv-instruction-text';
      inst.textContent = props.instruction;
      header.appendChild(inst);
    }

    return header;
  };

  /**
   * Builds an Answer Card (Single or Multiple Choice)
   */
  DICVComponents.createAnswerCard = function (props) {
    var card = document.createElement('div');
    card.className = 'dicv-answer-card';
    card.setAttribute('role', props.isMultiple ? 'checkbox' : 'radio');
    card.setAttribute('aria-checked', 'false');
    card.setAttribute('tabindex', '0');
    card.dataset.optionId = props.id;

    var indicator = document.createElement('div');
    indicator.className = 'dicv-control-indicator ' + (props.isMultiple ? 'is-checkbox' : 'is-radio');
    if (props.isMultiple) {
      indicator.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 12l5 5L20 6"></path></svg>';
    }

    var text = document.createElement('span');
    text.className = 'dicv-answer-text';
    text.textContent = props.text;

    card.appendChild(indicator);
    card.appendChild(text);

    return card;
  };

  /**
   * Builds Action Footer with Submit and optional Reset
   */
  DICVComponents.createFooter = function (props) {
    var footer = document.createElement('footer');
    footer.className = 'dicv-footer';

    if (props.showReset) {
      var resetBtn = document.createElement('button');
      resetBtn.type = 'button';
      resetBtn.className = 'dicv-btn dicv-btn-secondary';
      resetBtn.textContent = props.resetLabel || 'Reset';
      resetBtn.id = 'btn-reset';
      footer.appendChild(resetBtn);
    }

    var submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.className = 'dicv-btn dicv-btn-primary';
    submitBtn.textContent = props.submitLabel || 'Submit';
    submitBtn.id = 'btn-submit';
    submitBtn.disabled = true; // Initially disabled until user selects an answer
    footer.appendChild(submitBtn);

    return footer;
  };

  /**
   * Builds Sequence / Ordering Row
   */
  DICVComponents.createOrderRow = function (props) {
    var row = document.createElement('div');
    row.className = 'dicv-order-row';
    row.dataset.itemId = props.id;

    var badge = document.createElement('div');
    badge.className = 'dicv-order-badge';
    badge.textContent = props.index;

    var text = document.createElement('span');
    text.className = 'dicv-answer-text';
    text.textContent = props.text;

    var actions = document.createElement('div');
    actions.className = 'dicv-order-actions';

    var btnUp = document.createElement('button');
    btnUp.type = 'button';
    btnUp.className = 'dicv-btn-icon dicv-btn-up';
    btnUp.setAttribute('aria-label', 'Move item up');
    btnUp.innerHTML = '▲';

    var btnDown = document.createElement('button');
    btnDown.type = 'button';
    btnDown.className = 'dicv-btn-icon dicv-btn-down';
    btnDown.setAttribute('aria-label', 'Move item down');
    btnDown.innerHTML = '▼';

    actions.appendChild(btnUp);
    actions.appendChild(btnDown);

    row.appendChild(badge);
    row.appendChild(text);
    row.appendChild(actions);

    return row;
  };

  /**
   * Builds Hotspot Marker
   */
  DICVComponents.createHotspotMarker = function (props) {
    var marker = document.createElement('button');
    marker.type = 'button';
    marker.className = 'dicv-hotspot-marker';
    marker.style.left = props.x + '%';
    marker.style.top = props.y + '%';
    marker.dataset.hotspotId = props.id;
    marker.setAttribute('aria-label', props.label || 'Interactive hotspot');
    marker.innerHTML = '<span aria-hidden="true">+</span>';
    return marker;
  };

  return DICVComponents;
});
