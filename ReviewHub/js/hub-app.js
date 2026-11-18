(function () {
  'use strict';

  const DATA = window.DICV_HUB_DATA;
  const appEl = document.getElementById('hub-view');
  const titleEl = document.getElementById('topbar-title');
  const sidebarEl = document.getElementById('sidebar');
  const navButtons = Array.from(document.querySelectorAll('.nav-btn[data-route]'));

  let activeRoute = 'overview';
  let activeQuizId = 'Q001';
  let activeDetailTab = 'overview';
  let wizardQuizId = 'Q001';
  let wizardStep = 1;
  let activeFlowScenario = 'normal';
  let libraryFilter = 'all';
  let previewZoom = 'fit';

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function statusChip(status) {
    const s = String(status || 'NOT TESTED').toUpperCase();
    if (s === 'PASS' || s === 'READY' || s === 'CLOSED') return `<span class="chip chip-pass">${esc(status)}</span>`;
    if (s === 'BLOCKED' || s === 'FAIL') return `<span class="chip chip-blocked">${esc(status)}</span>`;
    if (s.includes('REVIEW') || s.includes('TESTING') || s === 'NOT TESTED') return `<span class="chip chip-testing">${esc(status)}</span>`;
    return `<span class="chip chip-neutral">${esc(status)}</span>`;
  }

  const WIN_ROOT = 'D:\\Development\\Projects\\dicv-interactive\\';

  function winDistPath(q) {
    return WIN_ROOT + q.distFolder.replace(/^\.\.\//, '').replace(/\//g, '\\');
  }

  function copyBtn(text, label) {
    return `<button type="button" class="copy-btn" data-copy="${esc(text)}">${esc(label || 'Copy')}</button>`;
  }

  function getQuiz(id) {
    return DATA.quizzes.find((q) => q.id === id) || DATA.quizzes[0];
  }

  function navigate(route, quizId, tab) {
    activeRoute = route || 'storyview';
    if (quizId) activeQuizId = quizId;
    if (tab) activeDetailTab = tab;
    if (activeRoute === 'storyview' && window.DICV_STORY_VIEW) {
      window.location.hash = `storyview/${window.DICV_STORY_VIEW.getSelectedSlideId()}`;
    } else {
      window.location.hash = quizId ? `${activeRoute}/${activeQuizId}` : activeRoute;
    }
    sidebarEl.classList.remove('open');
    render();
  }

  function syncFromHash() {
    const raw = (window.location.hash || '#storyview').replace(/^#/, '');
    const parts = raw.split('/');
    activeRoute = parts[0] || 'storyview';
    if (activeRoute === 'storyview' && parts[1] && window.DICV_STORY_VIEW) {
      window.DICV_STORY_VIEW.setSelectedSlideId(parts[1]);
    } else if (parts[1] && DATA.quizzes.some((q) => q.id === parts[1])) {
      activeQuizId = parts[1];
    }
    render();
  }

  function updateNavHighlight() {
    navButtons.forEach((btn) => {
      const r = btn.getAttribute('data-route');
      const match = r === activeRoute || (activeRoute === 'quiz' && r === 'library');
      btn.classList.toggle('active', match);
    });
  }

  // ---------------- VIEW: OVERVIEW ----------------
  function renderOverview() {
    titleEl.textContent = 'Project Overview — DICV Interactive Safety eLearning';
    const st = DATA.project.overallStatus;
    return `
      <div class="kpi-grid">
        <div class="kpi-card"><div class="kpi-num">${DATA.project.counts.quizzes}</div><div class="kpi-label">Safety Quizzes (Q001–Q006)</div></div>
        <div class="kpi-card"><div class="kpi-num">${DATA.project.counts.webObjects}</div><div class="kpi-label">Standalone Web Objects</div></div>
        <div class="kpi-card"><div class="kpi-num">${DATA.project.counts.q006Slides}</div><div class="kpi-label">Q006 Committee Slides</div></div>
        <div class="kpi-card"><div class="kpi-num">0</div><div class="kpi-label">Open P0/P1 Code Defects</div></div>
      </div>

      <div class="panel">
        <h2>Project Readiness at a Glance</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Area</th><th>Current Status</th><th>What This Means for You</th></tr></thead>
            <tbody>
              <tr><td><strong>Storyline-Ready Web Objects</strong></td><td>${statusChip(st.buildPackages.label)}</td><td>All 8 standalone folders in <code>WebObjects/dist/</code> and <code>.zip</code> exports are built and up to date.</td></tr>
              <tr><td><strong>Technical &amp; Bridge Audit</strong></td><td>${statusChip(st.technicalAudit.label)}</td><td>Automated tests verify SCORM string resume, Q006 singular variables, and post-feedback reveal timing.</td></tr>
              <tr><td><strong>Animation &amp; Motion Prototypes</strong></td><td>${statusChip(st.animationPrototypes.label)}</td><td>Interactive motion prototypes are ready in the Animation Library for stakeholder approval before production rollout.</td></tr>
              <tr><td><strong>Articulate Storyline 360 Testing</strong></td><td>${statusChip(st.storylineIntegration.label)}</td><td>Must be tested in Storyline <strong>Publish → Web</strong> or <strong>Review 360</strong> (not Desktop Preview F12).</td></tr>
              <tr><td><strong>Oracle LMS (SCORM) Validation</strong></td><td>${statusChip(st.oracleLms.label)}</td><td>Blocked in workspace because no <code>.story</code> or SCORM export exists here; requires staging upload.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid-2">
        <div class="panel">
          <h3>Quick Start for Non-Developers</h3>
          <p>Choose what you want to do today:</p>
          <div class="btn-row">
            <button class="btn btn-primary" data-go="library">Browse &amp; Preview Quizzes</button>
            <button class="btn btn-secondary" data-go="wizard">Open Storyline Integration Wizard</button>
            <button class="btn btn-outline" data-go="troubleshooting">Troubleshoot an Issue</button>
          </div>
        </div>
        <div class="panel">
          <h3>Key Rule Before Testing</h3>
          <p><strong>Never use Storyline Desktop Preview (F12)</strong> to test quiz submission or scoring. Desktop Preview blocks Web Object communication. Always test in <strong>Publish → Web</strong>, <strong>Review 360</strong>, or <strong>Oracle LMS</strong>.</p>
        </div>
      </div>
    `;
  }

  // ---------------- VIEW: QUIZ LIBRARY ----------------
  function renderLibrary() {
    titleEl.textContent = 'Quiz Library (Q001–Q006)';
    const filtered = DATA.quizzes.filter((q) => {
      if (libraryFilter === 'all') return true;
      return q.category.split(' ').includes(libraryFilter);
    });

    const cardsHtml = filtered.map((q) => `
      <article class="quiz-card">
        <div class="quiz-card-top">
          <span class="quiz-id">${esc(q.id)}</span>
          <span class="chip chip-neutral">${esc(q.interactionType)}</span>
        </div>
        <div class="quiz-thumb">
          ${q.screenshotUrl
            ? `<img src="${esc(q.screenshotUrl)}" alt="${esc(q.title)} screenshot" />`
            : `<div class="quiz-thumb-placeholder">${esc(q.title)}<span>Live interactive preview available (${esc(q.canvas.ratio)})</span></div>`}
        </div>
        <h3>${esc(q.title)}</h3>
        <p style="margin:0; font-size:13.5px; color:var(--muted);">${esc(q.shortDesc)}</p>
        <div style="display:flex; flex-wrap:wrap; gap:6px; align-items:center;">
          ${statusChip('Package: Ready')}
          ${statusChip('LMS: ' + q.testingStatus.oracleLms)}
          <span class="chip chip-neutral">Issues: ${q.knownIssues.length} closed</span>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" data-quiz="${esc(q.id)}" data-tab="preview">Live Preview</button>
          <button class="btn btn-secondary" data-quiz="${esc(q.id)}" data-tab="overview">Details &amp; Guide</button>
        </div>
      </article>
    `).join('');

    return `
      <div class="panel" style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:12px;">
        <div>
          <h2 style="margin:0;">All 8 Web Objects</h2>
          <p style="margin:4px 0 0; font-size:14px; color:var(--muted);">Select any quiz to preview it safely or view its Storyline setup.</p>
        </div>
        <div class="btn-row" style="margin:0;">
          <button class="tab-btn ${libraryFilter === 'all' ? 'active' : ''}" data-lib-filter="all">All (8)</button>
          <button class="tab-btn ${libraryFilter === 'choice' ? 'active' : ''}" data-lib-filter="choice">Choice (6)</button>
          <button class="tab-btn ${libraryFilter === 'dnd' ? 'active' : ''}" data-lib-filter="dnd">Drag &amp; Drop (2)</button>
          <button class="tab-btn ${libraryFilter === 'q006' ? 'active' : ''}" data-lib-filter="q006">Q006 Slides (3)</button>
        </div>
      </div>
      <div class="grid-3">${cardsHtml}</div>
    `;
  }

  // ---------------- VIEW: INDIVIDUAL QUIZ DETAIL ----------------
  function renderQuizDetail() {
    const q = getQuiz(activeQuizId);
    titleEl.textContent = `${q.id} — ${q.title}`;

    const tabs = [
      ['overview', 'Overview'],
      ['preview', 'Live Preview'],
      ['interaction', 'Interaction Guide'],
      ['integration', 'Storyline Integration'],
      ['variables', 'Variables & Layers'],
      ['files', 'Files & Assets'],
      ['testing', 'Testing & Issues']
    ];

    let tabBody = '';
    if (activeDetailTab === 'overview') {
      tabBody = `
        <div class="grid-2">
          <div class="panel">
            <h3>Plain-Language Summary</h3>
            <p><strong>Purpose:</strong> ${esc(q.overview.purpose)}</p>
            <p><strong>What Learners See:</strong> ${esc(q.overview.whatLearnerSees)}</p>
            <p><strong>What Learners Do:</strong> ${esc(q.overview.whatLearnerDoes)}</p>
            <p><strong>Required to Pass:</strong> ${esc(q.overview.requiredCount)}</p>
            <p><strong>Submit Rule:</strong> ${esc(q.overview.submitRule)}</p>
            <p><strong>Approved Answer Key:</strong> <span class="chip chip-pass">${esc(q.overview.answerKeySummary)}</span></p>
          </div>
          <div class="panel">
            <h3>Quick Facts</h3>
            <table>
              <tbody>
                <tr><th>Quiz ID</th><td><code>${esc(q.id)}</code> ${copyBtn(q.id)}</td></tr>
                <tr><th>Interaction</th><td>${esc(q.interactionType)}</td></tr>
                <tr><th>Canvas Size</th><td><strong>${esc(q.canvas.ratio)}</strong> ${copyBtn(`${q.canvas.width} x ${q.canvas.height}`, 'Copy Size')}</td></tr>
                <tr><th>Windows Import Path</th><td><code>${esc(winDistPath(q))}</code> ${copyBtn(winDistPath(q), 'Copy Path')}</td></tr>
                <tr><th>ZIP Package</th><td><a href="${esc(q.zipFile)}" download>${esc(q.id)}.zip</a></td></tr>
                <tr><th>Motion Prototype</th><td><a href="${esc(q.motionPreviewUrl)}" target="_blank">Open Motion Prototype ↗</a></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (activeDetailTab === 'preview') {
      const availWidth = Math.max(320, Math.min(820, window.innerWidth - 680));
      const scale = previewZoom === 'fit' ? Math.min(1, availWidth / q.canvas.width) : 1;
      const scaledW = Math.round(q.canvas.width * scale);
      const scaledH = Math.round(q.canvas.height * scale);
      tabBody = `
        <div class="preview-banner">
          <div>
            <strong>ISOLATED PREVIEW MODE</strong> — Safe standalone sandbox. Does <strong>not</strong> write to production Storyline variables or Oracle LMS.
          </div>
          <div class="btn-row" style="margin:0;">
            <button class="btn btn-outline" id="btn-zoom-fit">${previewZoom === 'fit' ? '✓ Fit to Screen' : 'Fit to Screen'}</button>
            <button class="btn btn-outline" id="btn-zoom-100">${previewZoom === '100' ? '✓ 100% Native' : '100% Native'}</button>
            <a class="btn btn-secondary" href="${esc(q.previewUrl)}" target="_blank">Open in New Tab ↗</a>
          </div>
        </div>
        <div class="preview-layout">
          <div class="preview-viewport">
            <div class="preview-frame-wrap" style="width:${scaledW}px; height:${scaledH}px;">
              <iframe
                id="quiz-preview-iframe"
                src="${esc(q.previewUrl)}"
                title="${esc(q.id)} Standalone Preview"
                width="${q.canvas.width}"
                height="${q.canvas.height}"
                style="width:${q.canvas.width}px; height:${q.canvas.height}px; transform:scale(${scale}); transform-origin:top left;">
              </iframe>
            </div>
          </div>
          <aside class="mock-panel">
            <h4>Isolated Mock Storyline Controls</h4>
            <p style="margin:0 0 10px; color:var(--muted);">Simulate Storyline feedback signals to test review badges and retry reset safely.</p>
            <div class="btn-row" style="flex-direction:column;">
              <button class="btn btn-primary" id="btn-sim-reveal">Simulate Feedback Closed (Reveal Answers)</button>
              <button class="btn btn-secondary" id="btn-sim-reset">Simulate Retry Reset</button>
              <button class="btn btn-outline" id="btn-reload-preview">Reload Fresh Quiz</button>
            </div>
            <div class="mock-log" id="mock-event-log">Waiting for quiz interaction…</div>
          </aside>
        </div>
      `;
    } else if (activeDetailTab === 'interaction') {
      tabBody = `
        <div class="panel">
          <h3>Learner Journey Step-by-Step</h3>
          <div class="flow-track">
            ${q.journeySteps.map((s, i) => `<div class="flow-node ${i === 3 || i === 5 ? 'highlight' : ''}">${i + 1}. ${esc(s)}</div>`).join('<span class="flow-arrow">→</span>')}
          </div>
          <details>
            <summary>Technical Interaction Notes</summary>
            <p>Keyboard accessibility (Tab, Enter, Space, and Escape for DND return) is built into the quiz. Submission locks all controls until Storyline authorizes a retry via <code>QUIZ_RESET_ATTEMPT</code>.</p>
          </details>
        </div>
      `;
    } else if (activeDetailTab === 'integration') {
      tabBody = `
        <div class="panel">
          <h3>Storyline 360 Integration Steps for ${esc(q.id)}</h3>
          <ol style="padding-left:20px; line-height:1.8;">
            <li>Create the 4 Storyline variables listed in the <strong>Variables &amp; Layers</strong> tab.</li>
            <li>In Storyline 360, go to <strong>Insert → Web Object</strong> and select <code>${esc(q.distFolder)}</code>.</li>
            <li>Set the Web Object size to match <strong>${esc(q.canvas.ratio)}</strong> (or proportional aspect ratio).</li>
            <li>Add slide triggers listening for <strong>When variable changes: <code>${esc(q.variables[0].name)}</code></strong>.</li>
            <li>Show the <strong>Correct</strong> layer if <code>${esc(q.variables[1].name)} == True</code>, or <strong>Incorrect</strong> layer if <code>False</code>.</li>
            <li>When the learner closes the feedback layer, set <code>${esc(q.variables[3].name)} = True</code> so review badges appear.</li>
            <li>Set Slide Properties → <strong>When revisiting</strong> to <strong>Resume saved state</strong>.</li>
          </ol>
          <button class="btn btn-primary" data-go-wizard="${esc(q.id)}">Open Full 9-Step Wizard for ${esc(q.id)}</button>
        </div>
      `;
    } else if (activeDetailTab === 'variables') {
      tabBody = `
        <div class="panel">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
            <h3 style="margin:0;">Required Storyline Variables</h3>
            ${copyBtn(q.variables.map((v) => `${v.name} (${v.type}, ${v.initial})`).join('\n'), 'Copy All 4 Variables')}
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Variable Name</th><th>Type</th><th>Initial</th><th>Purpose (Plain English)</th><th>Updated By</th><th>Expected Result</th></tr></thead>
              <tbody>
                ${q.variables.map((v) => `
                  <tr>
                    <td><code>${esc(v.name)}</code> ${copyBtn(v.name)}</td>
                    <td>${esc(v.type)}</td>
                    <td><code>${esc(v.initial)}</code></td>
                    <td>${esc(v.purpose)}</td>
                    <td>${esc(v.updatedBy)}</td>
                    <td>${esc(v.expectedResult)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        <div class="panel">
          <h3>Required Storyline Feedback Layers</h3>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Layer</th><th>Trigger Condition</th><th>Action When Feedback Closes</th></tr></thead>
              <tbody>
                ${q.feedbackLayers.map((f) => `<tr><td><strong>${esc(f.layer)}</strong></td><td><code>${esc(f.trigger)}</code></td><td>${esc(f.onClose)}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (activeDetailTab === 'files') {
      tabBody = `
        <div class="panel">
          <h3>Package Contents &amp; Export Links</h3>
          <p><strong>Storyline Import Folder:</strong> <code>${esc(q.distFolder)}</code></p>
          <p><strong>Download ZIP:</strong> <a class="btn btn-secondary" href="${esc(q.zipFile)}" download>Download ${esc(q.id)}.zip</a></p>
          <ul>${q.files.map((f) => `<li><code>${esc(f)}</code></li>`).join('')}</ul>
        </div>
      `;
    } else if (activeDetailTab === 'testing') {
      const ts = q.testingStatus;
      tabBody = `
        <div class="panel">
          <h3>Verification Matrix for ${esc(q.id)}</h3>
          <div class="table-wrap">
            <table>
              <tbody>
                <tr><th>Source Inspected</th><td>${statusChip(ts.sourceInspected)}</td><th>Browser / Harness Tested</th><td>${statusChip(ts.browserHarness)}</td></tr>
                <tr><th>Storyline 360 Tested</th><td>${statusChip(ts.storyline)}</td><th>Review 360 Tested</th><td>${statusChip(ts.review360)}</td></tr>
                <tr><th>Oracle LMS Tested</th><td>${statusChip(ts.oracleLms)}</td><th>Revisit Tested (Mock)</th><td>${statusChip(ts.revisit)}</td></tr>
                <tr><th>LMS Resume Tested</th><td>${statusChip(ts.resume)}</td><th>Feedback Sync (Mock)</th><td>${statusChip(ts.feedbackSync)}</td></tr>
                <tr><th>Animation Readiness</th><td>${statusChip(ts.animationReadiness)}</td><th>Known Issues</th><td>${q.knownIssues.map((k) => `${esc(k.id)} (${esc(k.status)})`).join(', ')}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="panel">
          <h3>Related Issue Records</h3>
          <ul>${q.knownIssues.map((k) => `<li><strong>${esc(k.id)}</strong> [${esc(k.status)}]: ${esc(k.summary)}</li>`).join('')}</ul>
        </div>
      `;
    }

    return `
      <div class="panel" style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:10px; padding:14px 20px;">
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <button class="btn btn-outline" data-go="library">← Back to Library</button>
          <span class="quiz-id">${esc(q.id)}</span>
          <strong>${esc(q.title)}</strong>
        </div>
        <select id="quiz-switcher" aria-label="Switch quiz" style="padding:6px 10px; border-radius:8px; border:1px solid var(--border); font-family:inherit; font-weight:700;">
          ${DATA.quizzes.map((item) => `<option value="${esc(item.id)}" ${item.id === q.id ? 'selected' : ''}>${esc(item.id)} — ${esc(item.title)}</option>`).join('')}
        </select>
      </div>
      <div class="tabs">
        ${tabs.map(([key, label]) => `<button class="tab-btn ${activeDetailTab === key ? 'active' : ''}" data-detail-tab="${key}">${label}</button>`).join('')}
      </div>
      ${tabBody}
    `;
  }

  // ---------------- VIEW: STORYLINE WIZARD ----------------
  function renderWizard() {
    titleEl.textContent = 'Storyline 360 Integration Wizard';
    const q = getQuiz(wizardQuizId);
    const steps = [
      { n: 1, title: 'Choose a Quiz', body: `Select which quiz slide you are building: <select id="wizard-quiz-select" style="padding:6px 10px; border-radius:8px; border:1px solid var(--border); font-weight:700;">${DATA.quizzes.map((x) => `<option value="${esc(x.id)}" ${x.id === q.id ? 'selected' : ''}>${esc(x.id)} — ${esc(x.title)}</option>`).join('')}</select>`, check: 'Each of the 8 Web Objects has its own package and variable prefix.', mistake: 'Mixing Q006_R1, R2, and R3 folders across slides.' },
      { n: 2, title: 'Locate the Web Object Package', body: `Use the standalone folder <code>${esc(winDistPath(q))}</code> ${copyBtn(winDistPath(q), 'Copy Path')} (or unzip <a href="${esc(q.zipFile)}" download>${esc(q.id)}.zip</a>).`, check: 'Folder must contain index.html, storyline-bridge.js, fonts.css, and assets/.', mistake: 'Importing from WebObjects/quizzes/ instead of WebObjects/dist/.' },
      { n: 3, title: 'Insert into Storyline 360', body: 'In Storyline 360, choose <strong>Insert → Web Object</strong>, browse to the folder, and select <strong>Display in slide</strong>.', check: 'Web Object placeholder appears on the slide stage.', mistake: 'Selecting "Display in a new browser window", which hides the quiz off-slide.' },
      { n: 4, title: 'Set Dimensions', body: `Size the Web Object container to match <strong>${esc(q.canvas.ratio)}</strong> ${copyBtn(`${q.canvas.width} x ${q.canvas.height}`, 'Copy Size')} (or maintain exact aspect ratio).`, check: 'No clipped Submit button or unwanted scrollbars.', mistake: 'Stretching the frame unevenly, causing clipping on smaller screens.' },
      { n: 5, title: 'Configure Storyline Variables', body: `Create these 4 variables ${copyBtn(q.variables.map((v) => v.name).join(', '), 'Copy All Names')}: ${q.variables.map((v) => `<code>${esc(v.name)}</code> (${esc(v.type)}, default ${esc(v.initial)})`).join(', ')}.`, check: 'Exact spelling & case match (note Q006 uses singular _Answer).', mistake: 'Typing Q006_R1_Answers instead of Q006_R1_Answer.' },
      { n: 6, title: 'Configure Feedback Layers', body: `Add triggers on <strong>When variable changes: <code>${esc(q.variables[0].name)}</code></strong> → Show Correct layer if <code>${esc(q.variables[1].name)} == True</code>, else show Incorrect layer.`, check: 'Both Correct and Incorrect layers are handled.', mistake: 'Checking only True and forgetting the False trigger.' },
      { n: 7, title: 'Configure Answer Reveal', body: `Keep <code>${esc(q.variables[3].name)}</code> as <code>False</code> initially. Set <code>${esc(q.variables[3].name)} = True</code> when the learner dismisses the feedback layer.`, check: 'Correct answers appear ONLY after feedback closes.', mistake: 'Setting Revealed = True on slide start, spoiling the quiz.' },
      { n: 8, title: 'Configure Revisit & Resume', body: 'In Storyline Slide Properties, set <strong>When revisiting</strong> to <strong>Resume saved state</strong>.', check: 'Revisiting a completed slide locks cards and restores the saved answer.', mistake: 'Leaving "Reset to initial state", which lets learners resubmit.' },
      { n: 9, title: 'Publish & Test', body: 'Test in <strong>Publish → Web</strong>, <strong>Review 360</strong>, and <strong>Oracle LMS (SCORM)</strong>.', check: 'Submit, feedback, reveal, retry, and LMS resume all work end-to-end.', mistake: 'Testing only in Desktop Preview (F12), which blocks GetPlayer().' }
    ];
    const cur = steps[wizardStep - 1];
    return `
      <div class="panel">
        <h2>9-Step Guided Integration (${esc(q.id)} — ${esc(q.title)})</h2>
        <div class="tabs">
          ${steps.map((s) => `<button class="tab-btn ${wizardStep === s.n ? 'active' : ''}" data-wstep="${s.n}">Step ${s.n}</button>`).join('')}
        </div>
        <div class="panel" style="background:var(--petrol-tint); box-shadow:none;">
          <h3>Step ${cur.n}: ${esc(cur.title)}</h3>
          <p>${cur.body}</p>
          <p><strong>Expected Result:</strong> ${esc(cur.check)}</p>
          <p><strong>Common Mistake to Avoid:</strong> ${esc(cur.mistake)}</p>
        </div>
        <div class="btn-row">
          <button class="btn btn-outline" id="w-prev" ${wizardStep === 1 ? 'disabled' : ''}>← Previous Step</button>
          <button class="btn btn-primary" id="w-next" ${wizardStep === 9 ? 'disabled' : ''}>Next Step →</button>
          <button class="btn btn-secondary" data-quiz="${esc(q.id)}" data-tab="preview">Preview ${esc(q.id)}</button>
        </div>
      </div>
    `;
  }

  // ---------------- VIEW: VARIABLES & FLOW ----------------
  function renderVariables() {
    titleEl.textContent = 'Variable Explorer & Storyline Flow';
    const flows = {
      normal: ['Quiz Opens (READY)', 'Learner Selects / Places', 'Clicks Submit → Cards Lock', 'Bridge Sets _Answers, _Correct, _Done', 'Storyline Opens Correct Layer', 'Feedback Closes → _Revealed = True', 'HTML Shows Review / Next Slide'],
      incorrect: ['Quiz Opens (READY)', 'Learner Submits Incorrectly', 'Bridge Sets _Correct = False, _Done = True', 'Storyline Opens Incorrect Layer', 'Feedback Closes → _Revealed = True', 'HTML Marks Incorrect & Correct Cards'],
      revisit: ['Learner Re-enters Slide', 'Slide Resumes Saved State (_Done = True)', 'HTML Reads _Answers & _Revealed', 'Cards Stay Locked (No Resubmit)', 'Review Badges Shown If _Revealed = True'],
      interrupted: ['Learner Selects Draft Items', 'Closes Browser Before Submit', '_Done Remains False', 'On Return, Quiz Restarts in READY State'],
      resume: ['Learner Relaunches in Oracle LMS', 'SCORM Restores Variables (incl. "false" strings)', 'parseBoolVar() Safely Evaluates State', 'Completed Quizzes Stay Locked; Unfinished Stay Ready']
    };
    return `
      <div class="panel">
        <h2>Interactive Storyline Flow Diagram</h2>
        <div class="tabs">
          <button class="tab-btn ${activeFlowScenario === 'normal' ? 'active' : ''}" data-flow="normal">Normal Completion</button>
          <button class="tab-btn ${activeFlowScenario === 'incorrect' ? 'active' : ''}" data-flow="incorrect">Incorrect Answer</button>
          <button class="tab-btn ${activeFlowScenario === 'revisit' ? 'active' : ''}" data-flow="revisit">Slide Revisit</button>
          <button class="tab-btn ${activeFlowScenario === 'interrupted' ? 'active' : ''}" data-flow="interrupted">Interrupted Submission</button>
          <button class="tab-btn ${activeFlowScenario === 'resume' ? 'active' : ''}" data-flow="resume">Resume After Relaunch</button>
        </div>
        <div class="flow-track">
          ${flows[activeFlowScenario].map((n, i) => `<div class="flow-node ${i === 3 ? 'highlight' : ''}">${esc(n)}</div>`).join('<span class="flow-arrow">→</span>')}
        </div>
      </div>

      <div class="panel">
        <h2>All Verified Storyline Variables (Q001–Q006_R3)</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Quiz</th><th>Submitted Flag</th><th>Correct Flag</th><th>Saved Selection</th><th>Reveal Flag</th></tr></thead>
            <tbody>
              ${DATA.quizzes.map((q) => `
                <tr>
                  <td><strong>${esc(q.id)}</strong> ${copyBtn(q.variables.map((v) => v.name).join(', '), 'Copy All')}</td>
                  <td><code>${esc(q.variables[0].name)}</code> ${copyBtn(q.variables[0].name)}</td>
                  <td><code>${esc(q.variables[1].name)}</code> ${copyBtn(q.variables[1].name)}</td>
                  <td><code>${esc(q.variables[2].name)}</code> ${copyBtn(q.variables[2].name)}</td>
                  <td><code>${esc(q.variables[3].name)}</code> ${copyBtn(q.variables[3].name)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ---------------- VIEW: ANIMATIONS ----------------
  function renderAnimations() {
    titleEl.textContent = 'Animation & Effects Library';
    return `
      <div class="panel">
        <h2>Centralized Motion Gallery (Prototype Ready — Pending Approval)</h2>
        <p style="color:var(--muted); margin-bottom:0;">Click <strong>Play Demo</strong> on any card to preview the motion behavior. Production quizzes are not modified with new animations until approved. <a href="../WebObjects/prototypes/motion/index.html" target="_blank">Open Full Motion Prototype Hub ↗</a></p>
      </div>
      <div class="grid-3">
        ${DATA.animations.map((a) => `
          <article class="quiz-card">
            <div class="quiz-card-top">
              <strong>${esc(a.name)}</strong>
              ${statusChip(a.status)}
            </div>
            <div class="demo-stage" id="demo-${esc(a.id)}">
              <div class="demo-box ${esc(a.demoClass)}">Card</div>
              ${a.id === 'swap' || a.id === 'entrance' ? `<div class="demo-box ${esc(a.demoClass)}" style="animation-delay:120ms;">Target</div>` : ''}
            </div>
            <div style="font-size:13px; color:var(--muted);">
              <div><strong>Used In:</strong> ${esc(a.usedIn)}</div>
              <div><strong>Trigger:</strong> ${esc(a.trigger)}</div>
              <div><strong>Duration:</strong> ${esc(a.duration)}</div>
              <div><strong>Storyline Dep:</strong> ${esc(a.storylineDep)}</div>
            </div>
            <button class="btn btn-secondary" data-play-demo="demo-${esc(a.id)}">▶ Play Demo</button>
          </article>
        `).join('')}
      </div>
    `;
  }

  // ---------------- VIEW: TESTING & STATUS ----------------
  function renderTesting() {
    titleEl.textContent = 'Testing & Integration Status Matrix';
    return `
      <div class="panel">
        <h2>Verification Matrix (Q001–Q006_R3)</h2>
        <p style="color:var(--muted);">Honest status across automated harness checks vs. live Storyline/LMS staging (blocked in workspace until imported into <code>.story</code>).</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Quiz</th><th>Source</th><th>Browser/Harness</th><th>Storyline</th><th>Review 360</th><th>Oracle LMS</th><th>Revisit (Mock)</th><th>Resume</th><th>Animation</th>
              </tr>
            </thead>
            <tbody>
              ${DATA.quizzes.map((q) => {
                const t = q.testingStatus;
                return `
                  <tr>
                    <td><strong>${esc(q.id)}</strong></td>
                    <td>${statusChip(t.sourceInspected)}</td>
                    <td>${statusChip(t.browserHarness)}</td>
                    <td>${statusChip(t.storyline)}</td>
                    <td>${statusChip(t.review360)}</td>
                    <td>${statusChip(t.oracleLms)}</td>
                    <td>${statusChip(t.revisit)}</td>
                    <td>${statusChip(t.resume)}</td>
                    <td>${statusChip(t.animationReadiness)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ---------------- VIEW: TROUBLESHOOTING ----------------
  function renderTroubleshooting() {
    titleEl.textContent = 'Non-Developer Troubleshooting Center';
    return `
      <div class="panel">
        <h2>Find a Symptom</h2>
        <input id="ts-search" type="search" placeholder="Type a symptom (e.g., blank, submit, feedback, LMS, drag)..." style="width:100%; padding:10px 14px; border-radius:10px; border:1px solid var(--border); font-family:inherit; font-size:14px;" />
      </div>
      <div class="grid-2" id="ts-list">
        ${DATA.troubleshooting.map((t) => `
          <article class="panel ts-item" data-search="${esc((t.symptom + ' ' + t.notice + ' ' + t.causes.join(' ')).toLowerCase())}">
            <h3>${esc(t.symptom)}</h3>
            <p><strong>What You Notice:</strong> ${esc(t.notice)}</p>
            <p><strong>Check First:</strong> ${esc(t.checkFirst)}</p>
            <p><strong>How to Resolve:</strong></p>
            <ul>${t.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
            <p style="font-size:13px; color:var(--muted);"><strong>When Developer Is Needed:</strong> ${esc(t.devNeeded)} ${t.issues.length ? `· Related: <code>${esc(t.issues.join(', '))}</code>` : ''}</p>
          </article>
        `).join('')}
      </div>
    `;
  }

  // ---------------- VIEW: FILES & DOCS ----------------
  function renderFiles() {
    titleEl.textContent = 'Files, Exports & Documentation Center';
    return `
      <div class="panel">
        <h2>Storyline-Ready Exports (WebObjects/dist/)</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Quiz ID</th><th>Import Folder</th><th>ZIP Package</th><th>Canvas Size</th></tr></thead>
            <tbody>
              ${DATA.quizzes.map((q) => `
                <tr>
                  <td><strong>${esc(q.id)}</strong> ${copyBtn(q.id)}</td>
                  <td><code>${esc(winDistPath(q))}</code> ${copyBtn(winDistPath(q), 'Copy Path')}</td>
                  <td><a href="${esc(q.zipFile)}" download>Download ${esc(q.id)}.zip</a></td>
                  <td>${esc(q.canvas.ratio)} ${copyBtn(`${q.canvas.width} x ${q.canvas.height}`, 'Copy Size')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="panel">
        <h2>Documentation Summaries</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Document</th><th>Audience</th><th>Summary</th><th>Open</th></tr></thead>
            <tbody>
              ${DATA.docs.map((d) => `
                <tr>
                  <td><strong>${esc(d.title)}</strong></td>
                  <td>${esc(d.audience)}</td>
                  <td>${esc(d.summary)}</td>
                  <td><a href="${esc(d.path)}" target="_blank">Open ↗</a></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ---------------- MAIN RENDER & EVENTS ----------------
  function render() {
    updateNavHighlight();
    if (activeRoute === 'storyview' && window.DICV_STORY_VIEW) {
      titleEl.textContent = 'Story View — All-in-One Storyline 360 Course Builder';
      appEl.innerHTML = window.DICV_STORY_VIEW.render();
    }
    else if (activeRoute === 'overview') appEl.innerHTML = renderOverview();
    else if (activeRoute === 'library') appEl.innerHTML = renderLibrary();
    else if (activeRoute === 'quiz') appEl.innerHTML = renderQuizDetail();
    else if (activeRoute === 'wizard') appEl.innerHTML = renderWizard();
    else if (activeRoute === 'variables') appEl.innerHTML = renderVariables();
    else if (activeRoute === 'animations') appEl.innerHTML = renderAnimations();
    else if (activeRoute === 'testing') appEl.innerHTML = renderTesting();
    else if (activeRoute === 'troubleshooting') appEl.innerHTML = renderTroubleshooting();
    else if (activeRoute === 'files') appEl.innerHTML = renderFiles();
    else appEl.innerHTML = renderOverview();

    bindDynamicEvents();
  }

  function appendMockLog(msg) {
    const log = document.getElementById('mock-event-log');
    if (!log) return;
    const line = document.createElement('div');
    line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    log.prepend(line);
  }

  function bindDynamicEvents() {
    if (activeRoute === 'storyview' && window.DICV_STORY_VIEW) {
      window.DICV_STORY_VIEW.bind(appEl, () => {
        window.location.hash = `storyview/${window.DICV_STORY_VIEW.getSelectedSlideId()}`;
        render();
      });
    }
    appEl.querySelectorAll('[data-go]').forEach((el) => {
      el.addEventListener('click', () => navigate(el.getAttribute('data-go')));
    });
    appEl.querySelectorAll('[data-quiz]').forEach((el) => {
      el.addEventListener('click', () => navigate('quiz', el.getAttribute('data-quiz'), el.getAttribute('data-tab') || 'overview'));
    });
    appEl.querySelectorAll('[data-go-wizard]').forEach((el) => {
      el.addEventListener('click', () => {
        wizardQuizId = el.getAttribute('data-go-wizard');
        wizardStep = 1;
        navigate('wizard');
      });
    });
    appEl.querySelectorAll('[data-lib-filter]').forEach((el) => {
      el.addEventListener('click', () => {
        libraryFilter = el.getAttribute('data-lib-filter');
        render();
      });
    });
    appEl.querySelectorAll('[data-detail-tab]').forEach((el) => {
      el.addEventListener('click', () => {
        activeDetailTab = el.getAttribute('data-detail-tab');
        render();
      });
    });
    const switcher = document.getElementById('quiz-switcher');
    if (switcher) {
      switcher.addEventListener('change', () => navigate('quiz', switcher.value, activeDetailTab));
    }

    // Isolated Preview Controls
    const btnFit = document.getElementById('btn-zoom-fit');
    const btn100 = document.getElementById('btn-zoom-100');
    if (btnFit) btnFit.addEventListener('click', () => { previewZoom = 'fit'; render(); });
    if (btn100) btn100.addEventListener('click', () => { previewZoom = '100'; render(); });

    const iframe = document.getElementById('quiz-preview-iframe');
    const btnReveal = document.getElementById('btn-sim-reveal');
    const btnReset = document.getElementById('btn-sim-reset');
    const btnReload = document.getElementById('btn-reload-preview');

    if (btnReveal && iframe) {
      btnReveal.addEventListener('click', () => {
        iframe.contentWindow.postMessage({ type: 'QUIZ_REVEAL_ANSWERS', payload: { quizId: activeQuizId } }, '*');
        iframe.contentWindow.postMessage({ type: 'Q004_REVEAL', quizId: 'Q004' }, '*');
        appendMockLog(`Sent isolated reveal signal to ${activeQuizId}`);
      });
    }
    if (btnReset && iframe) {
      btnReset.addEventListener('click', () => {
        iframe.contentWindow.postMessage({ type: 'QUIZ_RESET_ATTEMPT', payload: { quizId: activeQuizId } }, '*');
        iframe.contentWindow.postMessage({ type: 'Q004_RESET', quizId: 'Q004' }, '*');
        appendMockLog(`Sent isolated reset signal to ${activeQuizId}`);
      });
    }
    if (btnReload && iframe) {
      btnReload.addEventListener('click', () => {
        iframe.src = iframe.src;
        appendMockLog(`Reloaded ${activeQuizId} preview`);
      });
    }

    // Wizard Controls
    const wSel = document.getElementById('wizard-quiz-select');
    if (wSel) wSel.addEventListener('change', () => { wizardQuizId = wSel.value; render(); });
    appEl.querySelectorAll('[data-wstep]').forEach((el) => {
      el.addEventListener('click', () => { wizardStep = Number(el.getAttribute('data-wstep')); render(); });
    });
    const wPrev = document.getElementById('w-prev');
    const wNext = document.getElementById('w-next');
    if (wPrev) wPrev.addEventListener('click', () => { if (wizardStep > 1) { wizardStep--; render(); } });
    if (wNext) wNext.addEventListener('click', () => { if (wizardStep < 9) { wizardStep++; render(); } });

    // Flow Diagram
    appEl.querySelectorAll('[data-flow]').forEach((el) => {
      el.addEventListener('click', () => { activeFlowScenario = el.getAttribute('data-flow'); render(); });
    });

    // Animation Play Demo
    appEl.querySelectorAll('[data-play-demo]').forEach((el) => {
      el.addEventListener('click', () => {
        const stage = document.getElementById(el.getAttribute('data-play-demo'));
        if (!stage) return;
        stage.classList.remove('playing');
        void stage.offsetWidth;
        stage.classList.add('playing');
      });
    });

    // Copy Buttons (with clipboard + textarea fallback)
    appEl.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-copy') || '';
        let ok = false;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          try {
            await navigator.clipboard.writeText(text);
            ok = true;
          } catch (err) {}
        }
        if (!ok) {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try { ok = document.execCommand('copy'); } catch (err) {}
          document.body.removeChild(ta);
        }
        const orig = btn.textContent;
        btn.textContent = ok ? '✓ Copied' : 'Select manually';
        if (ok) btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = orig;
          btn.classList.remove('copied');
        }, 1200);
      });
    });

    // Troubleshooting Search
    const tsSearch = document.getElementById('ts-search');
    if (tsSearch) {
      tsSearch.addEventListener('input', () => {
        const term = tsSearch.value.trim().toLowerCase();
        document.querySelectorAll('.ts-item').forEach((item) => {
          const hay = item.getAttribute('data-search') || '';
          item.style.display = !term || hay.includes(term) ? '' : 'none';
        });
      });
    }
  }

  // Listen ONLY to preview iframe messages for the mock log (strictly isolated, zero LMS/parent writes)
  window.addEventListener('message', (e) => {
    const iframe = document.getElementById('quiz-preview-iframe');
    if (!iframe || e.source !== iframe.contentWindow || !e.data) return;
    if (e.data.type === 'QUIZ_SUBMIT_REQUEST' || e.data.type === 'Q004_SUBMIT') {
      appendMockLog(`Preview Submit captured (${activeQuizId}): ${JSON.stringify(e.data.payload || e.data)}`);
    } else if (e.data.type === 'QUIZ_DRAFT_CHANGE' || e.data.type === 'Q004_DRAFT') {
      appendMockLog(`Draft change (${activeQuizId})`);
    }
  });

  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => navigate(btn.getAttribute('data-route')));
  });

  const mobileBtn = document.getElementById('mobile-menu-btn');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => sidebarEl.classList.toggle('open'));
  }

  window.addEventListener('hashchange', syncFromHash);
  syncFromHash();
})();
