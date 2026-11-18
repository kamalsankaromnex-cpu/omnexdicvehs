"""
Generate DICV Interactive Motion Prototypes for Q001–Q006.
Standardized Canvas Geometry:
- Q001: 806x962 px (SINGLE EXCEPTION - Portrait Card Format)
- Q002 to Q006: Strictly 1110x960 px Standard Corporate Suite Canvas
Places all prototypes in WebObjects/prototypes/motion/.
Does NOT modify any production quiz code.
"""

import os
import re

PROTOTYPE_DIR = r"D:\Development\Projects\dicv-interactive\WebObjects\prototypes\motion"
QUIZZES_DIR = r"D:\Development\Projects\dicv-interactive\WebObjects\quizzes"

TOOLBAR_CSS = """
/* Floating Motion Toolbar for Review & Testing */
.motion-dev-toolbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 46px;
  background: #004355;
  color: #FFFFFF;
  font-family: 'Daimler CS', Arial, sans-serif;
  font-size: 13px;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 2.5px solid #FFFF40;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  user-select: none;
}
.motion-dev-toolbar .toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.motion-dev-toolbar .toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.motion-btn {
  background: #00677F;
  color: #FFFFFF;
  border: 1.5px solid #FFFF40;
  border-radius: 14px;
  padding: 4px 12px;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 180ms ease;
  outline: none;
}
.motion-btn:hover {
  background: #00566A;
  transform: translateY(-1px);
}
.motion-btn-secondary {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #FFFFFF;
}
.motion-btn-reveal {
  background: #008248;
  border-color: #FFFF40;
}
.motion-toolbar-spacer {
  height: 52px;
}
"""

def generate_q001():
    src_path = os.path.join(QUIZZES_DIR, "Q001_AccidentPrediction", "index.html")
    with open(src_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Asset paths
    html = html.replace('src="assets/', 'src="../../quizzes/Q001_AccidentPrediction/assets/')
    html = html.replace('href="fonts.css"', 'href="../../quizzes/Q001_AccidentPrediction/fonts.css"')
    html = html.replace('href="../../shared/styles/fonts.css"', 'href="../../shared/styles/fonts.css"')

    # Inject motion CSS & Toolbar CSS (Single Exception: 806x962 px)
    head_inject = f"""
  <link rel="stylesheet" href="css/motion-design-system.css">
  <style>
  {TOOLBAR_CSS}
  :root {{
    --canvas-width: 806px;
    --canvas-height: 962px;
  }}
  </style>
"""
    html = html.replace('</head>', head_inject + '</head>')

    # Add motion classes to elements
    html = html.replace('class="quiz-header"', 'class="quiz-header motion-animate-in motion-seq-header"')
    html = html.replace('class="instruction-row"', 'class="instruction-row motion-animate-in motion-seq-instruction"')
    html = re.sub(r'class="answer-card"\s+data-option-id="A"', 'class="answer-card motion-animate-in motion-seq-card-1 motion-card-tactile" data-option-id="A"', html)
    html = re.sub(r'class="answer-card"\s+data-option-id="B"', 'class="answer-card motion-animate-in motion-seq-card-2 motion-card-tactile" data-option-id="B"', html)
    html = re.sub(r'class="answer-card"\s+data-option-id="C"', 'class="answer-card motion-animate-in motion-seq-card-3 motion-card-tactile" data-option-id="C"', html)
    html = re.sub(r'class="answer-card"\s+data-option-id="D"', 'class="answer-card motion-animate-in motion-seq-card-4 motion-card-tactile" data-option-id="D"', html)
    html = html.replace('class="submit-container"', 'class="submit-container motion-animate-in motion-seq-submit"')

    toolbar = """
  <div class="motion-dev-toolbar">
    <div class="toolbar-left">
      <strong style="color: #FFFF40;">Q001 Motion Prototype</strong>
      <span style="background: rgba(255,255,64,0.2); color: #FFFF40; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 700;">EXCEPTION: 806×962 px</span>
      <span style="opacity: 0.7;">| Accident Prediction</span>
    </div>
    <div class="toolbar-right">
      <button class="motion-btn" id="btn-replay">↺ Replay Entrance</button>
      <button class="motion-btn motion-btn-secondary" id="btn-speed">Speed: 1.0x</button>
      <button class="motion-btn motion-btn-reveal" id="btn-reveal">★ Reveal (Post-Feedback)</button>
      <button class="motion-btn motion-btn-secondary" id="btn-reduced">Reduced Motion: OFF</button>
      <a href="index.html" class="motion-btn motion-btn-secondary" style="text-decoration: none; padding: 4px 8px;">☰ Hub</a>
    </div>
  </div>
  <div class="motion-toolbar-spacer"></div>
"""
    html = html.replace('<body>', '<body>\n' + toolbar)

    motion_js = """
  <script src="js/motion-controller.js"></script>
  <script>
    (function() {
      var mc = new DICVMotionController({
        quizId: 'Q001',
        container: document.getElementById('quiz-canvas')
      });
      mc.playEntrance();

      var isSlow = false;
      document.getElementById('btn-speed').addEventListener('click', function() {
        isSlow = !isSlow;
        this.textContent = isSlow ? 'Speed: 0.5x' : 'Speed: 1.0x';
        document.documentElement.style.setProperty('--motion-dur-medium', isSlow ? '900ms' : '450ms');
        document.documentElement.style.setProperty('--motion-dur-slow', isSlow ? '1100ms' : '550ms');
        document.documentElement.style.setProperty('--motion-dur-normal', isSlow ? '700ms' : '350ms');
      });

      document.getElementById('btn-replay').addEventListener('click', function() {
        var canvas = document.getElementById('quiz-canvas');
        canvas.classList.remove('motion-instant-ready');
        var anims = canvas.querySelectorAll('.motion-animate-in');
        anims.forEach(function(el) {
          el.style.animation = 'none';
          void el.offsetWidth;
          el.style.animation = '';
        });
        mc.playEntrance();
      });

      document.getElementById('btn-reduced').addEventListener('click', function() {
        var isReduced = document.body.classList.toggle('prefers-reduced-motion-simulated');
        this.textContent = isReduced ? 'Reduced Motion: ON' : 'Reduced Motion: OFF';
        if (isReduced) {
          document.getElementById('quiz-canvas').classList.add('motion-instant-ready');
        } else {
          document.getElementById('quiz-canvas').classList.remove('motion-instant-ready');
        }
      });

      document.getElementById('btn-reveal').addEventListener('click', function() {
        var cards = [
          { status: 'CORRECT', element: document.querySelector('[data-option-id="A"]') },
          { status: 'CORRECT', element: document.querySelector('[data-option-id="B"]') },
          { status: 'CORRECT', element: document.querySelector('[data-option-id="C"]') },
          { status: 'CORRECT', element: document.querySelector('[data-option-id="D"]') }
        ];
        mc.sequenceAnswerReveal(cards);
      });
    })();
  </script>
"""
    html = html.replace('</body>', motion_js + '</body>')

    out_path = os.path.join(PROTOTYPE_DIR, "q001_motion.html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(html)
    print("Generated q001_motion.html (806x962)")


def generate_q002():
    src_path = os.path.join(QUIZZES_DIR, "Q002_SafetyCommitments", "index.html")
    with open(src_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Asset paths
    html = html.replace('src="assets/', 'src="../../quizzes/Q002_SafetyCommitments/assets/')
    html = html.replace('href="fonts.css"', 'href="../../quizzes/Q002_SafetyCommitments/fonts.css"')
    html = html.replace('href="../../shared/styles/fonts.css"', 'href="../../shared/styles/fonts.css"')

    # Standardize to 1110x960 px
    head_inject = f"""
  <link rel="stylesheet" href="css/motion-design-system.css">
  <style>
  {TOOLBAR_CSS}
  :root {{
    --canvas-width: 1110px !important;
    --canvas-height: 960px !important;
  }}
  .quiz-viewport {{
    width: 1110px !important;
    height: 960px !important;
  }}
  </style>
"""
    html = html.replace('</head>', head_inject + '</head>')

    # Add motion classes
    html = html.replace('class="question-tab-container"', 'class="question-tab-container motion-animate-in motion-seq-header"')
    html = html.replace('class="instruction-row"', 'class="instruction-row motion-animate-in motion-seq-instruction"')
    
    html = re.sub(r'class="card"\s+data-card-id="1"', 'class="card motion-animate-in motion-seq-card-1 motion-card-tactile" data-card-id="1"', html)
    html = re.sub(r'class="card"\s+data-card-id="2"', 'class="card motion-animate-in motion-seq-card-2 motion-card-tactile" data-card-id="2"', html)
    html = re.sub(r'class="card"\s+data-card-id="3"', 'class="card motion-animate-in motion-seq-card-3 motion-card-tactile" data-card-id="3"', html)
    html = re.sub(r'class="card"\s+data-card-id="4"', 'class="card motion-animate-in motion-seq-card-4 motion-card-tactile" data-card-id="4"', html)
    html = re.sub(r'class="card"\s+data-card-id="5"', 'class="card motion-animate-in motion-seq-card-5 motion-card-tactile" data-card-id="5"', html)
    html = html.replace('class="submit-row"', 'class="submit-row motion-animate-in motion-seq-submit"')

    toolbar = """
  <div class="motion-dev-toolbar">
    <div class="toolbar-left">
      <strong style="color: #FFFF40;">Q002 Motion Prototype</strong>
      <span style="background: rgba(255,255,64,0.2); color: #FFFF40; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 700;">1110×960 px</span>
      <span style="opacity: 0.7;">| 5 Safety Commitments (3+2 Reading Order Entrance)</span>
    </div>
    <div class="toolbar-right">
      <button class="motion-btn" id="btn-replay">↺ Replay Entrance</button>
      <button class="motion-btn motion-btn-secondary" id="btn-speed">Speed: 1.0x</button>
      <button class="motion-btn motion-btn-reveal" id="btn-reveal">★ Reveal (Post-Feedback)</button>
      <button class="motion-btn motion-btn-secondary" id="btn-reduced">Reduced Motion: OFF</button>
      <a href="index.html" class="motion-btn motion-btn-secondary" style="text-decoration: none; padding: 4px 8px;">☰ Hub</a>
    </div>
  </div>
  <div class="motion-toolbar-spacer"></div>
"""
    html = html.replace('<body>', '<body>\n' + toolbar)

    motion_js = """
  <script src="js/motion-controller.js"></script>
  <script>
    (function() {
      var mc = new DICVMotionController({
        quizId: 'Q002',
        container: document.getElementById('quiz-viewport')
      });
      mc.playEntrance();

      var isSlow = false;
      document.getElementById('btn-speed').addEventListener('click', function() {
        isSlow = !isSlow;
        this.textContent = isSlow ? 'Speed: 0.5x' : 'Speed: 1.0x';
        document.documentElement.style.setProperty('--motion-dur-medium', isSlow ? '900ms' : '450ms');
        document.documentElement.style.setProperty('--motion-dur-slow', isSlow ? '1100ms' : '550ms');
        document.documentElement.style.setProperty('--motion-dur-normal', isSlow ? '700ms' : '350ms');
      });

      document.getElementById('btn-replay').addEventListener('click', function() {
        var canvas = document.getElementById('quiz-viewport');
        canvas.classList.remove('motion-instant-ready');
        var anims = canvas.querySelectorAll('.motion-animate-in');
        anims.forEach(function(el) {
          el.style.animation = 'none';
          void el.offsetWidth;
          el.style.animation = '';
        });
        mc.playEntrance();
      });

      document.getElementById('btn-reduced').addEventListener('click', function() {
        var isReduced = document.body.classList.toggle('prefers-reduced-motion-simulated');
        this.textContent = isReduced ? 'Reduced Motion: ON' : 'Reduced Motion: OFF';
        if (isReduced) {
          document.getElementById('quiz-viewport').classList.add('motion-instant-ready');
        } else {
          document.getElementById('quiz-viewport').classList.remove('motion-instant-ready');
        }
      });

      document.getElementById('btn-reveal').addEventListener('click', function() {
        var cards = [
          { status: 'CORRECT', element: document.querySelector('[data-card-id="1"]') },
          { status: 'CORRECT', element: document.querySelector('[data-card-id="2"]') },
          { status: 'CORRECT', element: document.querySelector('[data-card-id="3"]') },
          { status: 'CORRECT', element: document.querySelector('[data-card-id="4"]') },
          { status: 'CORRECT', element: document.querySelector('[data-card-id="5"]') }
        ];
        mc.sequenceAnswerReveal(cards);
      });
    })();
  </script>
"""
    html = html.replace('</body>', motion_js + '</body>')

    out_path = os.path.join(PROTOTYPE_DIR, "q002_motion.html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(html)
    print("Generated q002_motion.html (1110x960)")


def generate_q003():
    src_path = os.path.join(QUIZZES_DIR, "Q003_EHSCommitments", "index.html")
    with open(src_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Asset paths
    html = html.replace('href="fonts.css"', 'href="../../quizzes/Q003_EHSCommitments/fonts.css"')
    html = html.replace('href="../../shared/styles/fonts.css"', 'href="../../shared/styles/fonts.css"')

    # Standardize to 1110x960 px
    head_inject = f"""
  <link rel="stylesheet" href="css/motion-design-system.css">
  <style>
  {TOOLBAR_CSS}
  :root {{
    --canvas-width: 1110px !important;
    --canvas-height: 960px !important;
  }}
  .quiz-viewport {{
    width: 1110px !important;
    height: 960px !important;
  }}
  </style>
"""
    html = html.replace('</head>', head_inject + '</head>')

    # Add motion classes
    html = html.replace('class="instruction-row"', 'class="instruction-row motion-animate-in motion-seq-header"')
    html = re.sub(r'class="card"\s+data-index="0"', 'class="card motion-animate-in motion-seq-card-1 motion-card-tactile" data-index="0"', html)
    html = re.sub(r'class="card"\s+data-index="1"', 'class="card motion-animate-in motion-seq-card-2 motion-card-tactile" data-index="1"', html)
    html = re.sub(r'class="card"\s+data-index="2"', 'class="card motion-animate-in motion-seq-card-3 motion-card-tactile" data-index="2"', html)
    html = re.sub(r'class="card"\s+data-index="3"', 'class="card motion-animate-in motion-seq-card-4 motion-card-tactile" data-index="3"', html)
    html = re.sub(r'class="card"\s+data-index="4"', 'class="card motion-animate-in motion-seq-card-5 motion-card-tactile" data-index="4"', html)
    html = html.replace('class="footer-bar"', 'class="footer-bar motion-animate-in motion-seq-submit"')

    toolbar = """
  <div class="motion-dev-toolbar">
    <div class="toolbar-left">
      <strong style="color: #FFFF40;">Q003 Motion Prototype</strong>
      <span style="background: rgba(255,255,64,0.2); color: #FFFF40; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 700;">1110×960 px</span>
      <span style="opacity: 0.7;">| EHS Commitments (Max-4 Limit & Staggered Reveal)</span>
    </div>
    <div class="toolbar-right">
      <button class="motion-btn" id="btn-replay">↺ Replay Entrance</button>
      <button class="motion-btn motion-btn-secondary" id="btn-speed">Speed: 1.0x</button>
      <button class="motion-btn motion-btn-reveal" id="btn-reveal">★ Reveal (Post-Feedback)</button>
      <button class="motion-btn motion-btn-secondary" id="btn-reduced">Reduced Motion: OFF</button>
      <a href="index.html" class="motion-btn motion-btn-secondary" style="text-decoration: none; padding: 4px 8px;">☰ Hub</a>
    </div>
  </div>
  <div class="motion-toolbar-spacer"></div>
"""
    html = html.replace('<body>', '<body>\n' + toolbar)

    motion_js = """
  <script src="js/motion-controller.js"></script>
  <script>
    (function() {
      var mc = new DICVMotionController({
        quizId: 'Q003',
        container: document.getElementById('quiz-viewport')
      });
      mc.playEntrance();

      var isSlow = false;
      document.getElementById('btn-speed').addEventListener('click', function() {
        isSlow = !isSlow;
        this.textContent = isSlow ? 'Speed: 0.5x' : 'Speed: 1.0x';
        document.documentElement.style.setProperty('--motion-dur-medium', isSlow ? '900ms' : '450ms');
        document.documentElement.style.setProperty('--motion-dur-slow', isSlow ? '1100ms' : '550ms');
        document.documentElement.style.setProperty('--motion-dur-normal', isSlow ? '700ms' : '350ms');
      });

      document.getElementById('btn-replay').addEventListener('click', function() {
        var canvas = document.getElementById('quiz-viewport');
        canvas.classList.remove('motion-instant-ready');
        var anims = canvas.querySelectorAll('.motion-animate-in');
        anims.forEach(function(el) {
          el.style.animation = 'none';
          void el.offsetWidth;
          el.style.animation = '';
        });
        mc.playEntrance();
      });

      document.getElementById('btn-reduced').addEventListener('click', function() {
        var isReduced = document.body.classList.toggle('prefers-reduced-motion-simulated');
        this.textContent = isReduced ? 'Reduced Motion: ON' : 'Reduced Motion: OFF';
        if (isReduced) {
          document.getElementById('quiz-viewport').classList.add('motion-instant-ready');
        } else {
          document.getElementById('quiz-viewport').classList.remove('motion-instant-ready');
        }
      });

      document.getElementById('btn-reveal').addEventListener('click', function() {
        var cards = [
          { status: 'CORRECT', element: document.querySelector('[data-index="0"]') },
          { status: 'CORRECT', element: document.querySelector('[data-index="1"]') },
          { status: 'CORRECT', element: document.querySelector('[data-index="2"]') },
          { status: 'INCORRECT', element: document.querySelector('[data-index="3"]') },
          { status: 'CORRECT', element: document.querySelector('[data-index="4"]') }
        ];
        mc.sequenceAnswerReveal(cards);
      });
    })();
  </script>
"""
    html = html.replace('</body>', motion_js + '</body>')

    out_path = os.path.join(PROTOTYPE_DIR, "q003_motion.html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(html)
    print("Generated q003_motion.html (1110x960)")


def generate_q004():
    src_path = os.path.join(QUIZZES_DIR, "Q004_EHSFocusAreas", "index.html")
    with open(src_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Asset paths
    html = html.replace('href="fonts.css"', 'href="../../quizzes/Q004_EHSFocusAreas/fonts.css"')
    html = html.replace('href="../../shared/styles/fonts.css"', 'href="../../shared/styles/fonts.css"')
    html = html.replace('src="../../shared/storyline/storyline-bridge.js"', 'src="../../shared/storyline/storyline-bridge.js"')

    # Standardize to 1110x960 px with auto-scaled stage
    head_inject = f"""
  <link rel="stylesheet" href="css/motion-design-system.css">
  <style>
  {TOOLBAR_CSS}
  body {{
    width: 1110px !important;
    height: 960px !important;
    max-width: 1110px !important;
    max-height: 960px !important;
    margin: 0 auto !important;
    position: relative !important;
    overflow: hidden !important;
  }}
  #stage {{
    position: absolute !important;
    top: 52% !important;
    left: 50% !important;
    transform-origin: center center !important;
  }}
  </style>
"""
    html = html.replace('</head>', head_inject + '</head>')

    # Add motion classes
    html = html.replace('class="header"', 'class="header motion-animate-in motion-seq-header"')
    html = html.replace('class="instruction"', 'class="instruction motion-animate-in motion-seq-instruction"')
    html = html.replace('class="diagram-container"', 'class="diagram-container motion-animate-in motion-seq-diagram"')
    html = html.replace('class="actions"', 'class="actions motion-animate-in motion-seq-submit"')

    toolbar = """
  <div class="motion-dev-toolbar">
    <div class="toolbar-left">
      <strong style="color: #FFFF40;">Q004 Motion Prototype</strong>
      <span style="background: rgba(255,255,64,0.2); color: #FFFF40; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 700;">1110×960 px</span>
      <span style="opacity: 0.7;">| Pinwheel DND (Auto-Scaled Stage, Invalid Return, Snap & FLIP Swap)</span>
    </div>
    <div class="toolbar-right">
      <button class="motion-btn" id="btn-replay">↺ Replay Entrance</button>
      <button class="motion-btn motion-btn-secondary" id="btn-speed">Speed: 1.0x</button>
      <button class="motion-btn motion-btn-reveal" id="btn-reveal">★ Reveal (Post-Feedback)</button>
      <button class="motion-btn motion-btn-secondary" id="btn-reduced">Reduced Motion: OFF</button>
      <a href="index.html" class="motion-btn motion-btn-secondary" style="text-decoration: none; padding: 4px 8px;">☰ Hub</a>
    </div>
  </div>
  <div class="motion-toolbar-spacer"></div>
"""
    html = html.replace('<body>', '<body>\n' + toolbar)

    # Enhance scale function to calibrate strictly for 1110x960
    html = html.replace(
        "const x = Math.min(w / 1536, h / 1024);",
        "const x = Math.min(1110 / 1536, (960 - 52) / 1024);"
    )

    motion_js = """
  <script src="js/motion-controller.js"></script>
  <script>
    (function() {
      var mc = new DICVMotionController({
        quizId: 'Q004',
        container: document.querySelector('.shell')
      });
      mc.playEntrance();

      var isSlow = false;
      document.getElementById('btn-speed').addEventListener('click', function() {
        isSlow = !isSlow;
        this.textContent = isSlow ? 'Speed: 0.5x' : 'Speed: 1.0x';
        document.documentElement.style.setProperty('--motion-dur-medium', isSlow ? '900ms' : '450ms');
        document.documentElement.style.setProperty('--motion-dur-slow', isSlow ? '1100ms' : '550ms');
        document.documentElement.style.setProperty('--motion-dur-normal', isSlow ? '700ms' : '350ms');
      });

      document.getElementById('btn-replay').addEventListener('click', function() {
        var canvas = document.querySelector('.shell');
        canvas.classList.remove('motion-instant-ready');
        var anims = canvas.querySelectorAll('.motion-animate-in');
        anims.forEach(function(el) {
          el.style.animation = 'none';
          void el.offsetWidth;
          el.style.animation = '';
        });
        mc.playEntrance();
      });

      document.getElementById('btn-reduced').addEventListener('click', function() {
        var isReduced = document.body.classList.toggle('prefers-reduced-motion-simulated');
        this.textContent = isReduced ? 'Reduced Motion: ON' : 'Reduced Motion: OFF';
        if (isReduced) {
          document.querySelector('.shell').classList.add('motion-instant-ready');
        } else {
          document.querySelector('.shell').classList.remove('motion-instant-ready');
        }
      });

      document.getElementById('btn-reveal').addEventListener('click', function() {
        var cardElements = [
          { status: 'CORRECT', element: document.querySelector('.card[data-id="A"]') },
          { status: 'CORRECT', element: document.querySelector('.card[data-id="B"]') },
          { status: 'INCORRECT', element: document.querySelector('.card[data-id="C"]') },
          { status: 'CORRECT', element: document.querySelector('.card[data-id="D"]') }
        ];
        mc.sequenceAnswerReveal(cardElements);
      });
    })();
  </script>
"""
    html = html.replace('</body>', motion_js + '</body>')

    out_path = os.path.join(PROTOTYPE_DIR, "q004_motion.html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(html)
    print("Generated q004_motion.html (1110x960)")


def generate_q005():
    src_path = os.path.join(QUIZZES_DIR, "Q005_SafetyCultureMaturity", "index.html")
    with open(src_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Asset paths
    html = html.replace('href="fonts.css"', 'href="../../shared/styles/fonts.css"')
    html = html.replace('href="../../shared/styles/fonts.css"', 'href="../../shared/styles/fonts.css"')
    html = html.replace('src="assets/icons/', 'src="../../quizzes/Q005_SafetyCultureMaturity/assets/icons/')

    # Standardize to 1110x960 px with generous vertical graph padding
    head_inject = f"""
  <link rel="stylesheet" href="css/motion-design-system.css">
  <style>
  {TOOLBAR_CSS}
  :root {{
    --canvas-width: 1110px !important;
    --canvas-height: 960px !important;
  }}
  .quiz-viewport {{
    width: 1110px !important;
    height: 960px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
  }}
  .quiz-board {{
    height: calc(960px - 58px) !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    padding: 18px 24px 16px 24px !important;
  }}
  .graph-container {{
    position: relative !important;
    width: 100% !important;
    height: 480px !important;
    margin: auto 0 !important;
  }}
  .graph-svg {{
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
  }}
  </style>
"""
    html = html.replace('</head>', head_inject + '</head>')

    # Add motion classes
    html = html.replace('class="graph-container"', 'class="graph-container motion-animate-in motion-seq-diagram"')
    html = html.replace('class="lower-dock-bar"', 'class="lower-dock-bar motion-animate-in motion-seq-card-2"')
    html = html.replace('class="btn-submit"', 'class="btn-submit motion-animate-in motion-seq-submit"')

    toolbar = """
  <div class="motion-dev-toolbar">
    <div class="toolbar-left">
      <strong style="color: #FFFF40;">Q005 Motion Prototype</strong>
      <span style="background: rgba(255,255,64,0.2); color: #FFFF40; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 700;">1110×960 px</span>
      <span style="opacity: 0.7;">| Bradley Curve (Expanded Vertical Canvas, Path Draw, Stage Snaps, FLIP Swap)</span>
    </div>
    <div class="toolbar-right">
      <button class="motion-btn" id="btn-replay">↺ Replay Entrance</button>
      <button class="motion-btn motion-btn-secondary" id="btn-speed">Speed: 1.0x</button>
      <button class="motion-btn motion-btn-reveal" id="btn-reveal">★ Reveal (Post-Feedback)</button>
      <button class="motion-btn motion-btn-secondary" id="btn-reduced">Reduced Motion: OFF</button>
      <a href="index.html" class="motion-btn motion-btn-secondary" style="text-decoration: none; padding: 4px 8px;">☰ Hub</a>
    </div>
  </div>
  <div class="motion-toolbar-spacer"></div>
"""
    html = html.replace('<body>', '<body>\n' + toolbar)

    motion_js = """
  <script src="js/motion-controller.js"></script>
  <script>
    (function() {
      var mc = new DICVMotionController({
        quizId: 'Q005',
        container: document.getElementById('quiz-viewport')
      });
      mc.playEntrance();

      var isSlow = false;
      document.getElementById('btn-speed').addEventListener('click', function() {
        isSlow = !isSlow;
        this.textContent = isSlow ? 'Speed: 0.5x' : 'Speed: 1.0x';
        document.documentElement.style.setProperty('--motion-dur-medium', isSlow ? '900ms' : '450ms');
        document.documentElement.style.setProperty('--motion-dur-slow', isSlow ? '1100ms' : '550ms');
        document.documentElement.style.setProperty('--motion-dur-normal', isSlow ? '700ms' : '350ms');
      });

      document.getElementById('btn-replay').addEventListener('click', function() {
        var canvas = document.getElementById('quiz-viewport');
        canvas.classList.remove('motion-instant-ready');
        var anims = canvas.querySelectorAll('.motion-animate-in');
        anims.forEach(function(el) {
          el.style.animation = 'none';
          void el.offsetWidth;
          el.style.animation = '';
        });
        mc.playEntrance();
      });

      document.getElementById('btn-reduced').addEventListener('click', function() {
        var isReduced = document.body.classList.toggle('prefers-reduced-motion-simulated');
        this.textContent = isReduced ? 'Reduced Motion: ON' : 'Reduced Motion: OFF';
        if (isReduced) {
          document.getElementById('quiz-viewport').classList.add('motion-instant-ready');
        } else {
          document.getElementById('quiz-viewport').classList.remove('motion-instant-ready');
        }
      });

      document.getElementById('btn-reveal').addEventListener('click', function() {
        var cards = [
          { status: 'CORRECT', element: document.querySelector('.stage-card[data-stage-id="reactive"]') },
          { status: 'CORRECT', element: document.querySelector('.stage-card[data-stage-id="dependent"]') },
          { status: 'CORRECT', element: document.querySelector('.stage-card[data-stage-id="independent"]') },
          { status: 'CORRECT', element: document.querySelector('.stage-card[data-stage-id="interdependent"]') }
        ];
        mc.sequenceAnswerReveal(cards);
      });
    })();
  </script>
"""
    html = html.replace('</body>', motion_js + '</body>')

    out_path = os.path.join(PROTOTYPE_DIR, "q005_motion.html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(html)
    print("Generated q005_motion.html (1110x960)")


def generate_q006():
    src_path = os.path.join(QUIZZES_DIR, "Q006_SafetyReviewStructure", "R1_PolicyReview", "index.html")
    with open(src_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Asset paths
    html = html.replace('src="assets/', 'src="../../quizzes/Q006_SafetyReviewStructure/R1_PolicyReview/assets/')
    html = html.replace('src="../shared/assets/', 'src="../../quizzes/Q006_SafetyReviewStructure/shared/assets/')
    html = html.replace('href="../shared/committee-quiz.css"', 'href="../../quizzes/Q006_SafetyReviewStructure/shared/committee-quiz.css"')
    html = html.replace('src="../shared/committee-data.js"', 'src="../../quizzes/Q006_SafetyReviewStructure/shared/committee-data.js"')
    html = html.replace('src="../shared/committee-quiz.js"', 'src="../../quizzes/Q006_SafetyReviewStructure/shared/committee-quiz.js"')
    html = html.replace('src="../../../shared/storyline/storyline-bridge.js"', 'src="../../shared/storyline/storyline-bridge.js"')

    # Standardize to 1110x960 px centering the 764x536 board
    head_inject = f"""
  <link rel="stylesheet" href="css/motion-design-system.css">
  <style>
  {TOOLBAR_CSS}
  :root {{
    --canvas-width: 1110px !important;
    --canvas-height: 960px !important;
  }}
  .quiz-viewport {{
    width: 1110px !important;
    height: 960px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }}
  .quiz-board {{
    width: 820px !important;
    height: 580px !important;
    box-shadow: 0 16px 44px rgba(0, 67, 85, 0.18) !important;
  }}
  </style>
"""
    html = html.replace('</head>', head_inject + '</head>')

    # Add motion classes
    html = html.replace('class="header-row"', 'class="header-row motion-animate-in motion-seq-header"')
    html = html.replace('class="scenario-row"', 'class="scenario-row motion-animate-in motion-seq-diagram"')
    html = html.replace('class="question-strip"', 'class="question-strip motion-animate-in motion-seq-instruction"')
    html = html.replace('class="options-grid"', 'class="options-grid motion-animate-in motion-seq-card-1"')
    html = html.replace('class="footer-row"', 'class="footer-row motion-animate-in motion-seq-submit"')

    toolbar = """
  <div class="motion-dev-toolbar">
    <div class="toolbar-left">
      <strong style="color: #FFFF40;">Q006 Motion Prototype</strong>
      <span style="background: rgba(255,255,64,0.2); color: #FFFF40; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 700;">1110×960 px</span>
      <span style="opacity: 0.7;">| Safety Review Structure (Round 1: Apex Committee)</span>
    </div>
    <div class="toolbar-right">
      <button class="motion-btn" id="btn-replay">↺ Replay Entrance</button>
      <button class="motion-btn motion-btn-secondary" id="btn-speed">Speed: 1.0x</button>
      <button class="motion-btn motion-btn-reveal" id="btn-reveal">★ Reveal (Post-Feedback)</button>
      <button class="motion-btn motion-btn-secondary" id="btn-reduced">Reduced Motion: OFF</button>
      <a href="index.html" class="motion-btn motion-btn-secondary" style="text-decoration: none; padding: 4px 8px;">☰ Hub</a>
    </div>
  </div>
  <div class="motion-toolbar-spacer"></div>
"""
    html = html.replace('<body>', '<body>\n' + toolbar)

    motion_js = """
  <script src="js/motion-controller.js"></script>
  <script>
    (function() {
      var mc = new DICVMotionController({
        quizId: 'Q006_R1',
        container: document.querySelector('.quiz-board')
      });
      mc.playEntrance();

      // Resolve relative path to R1 issue image in prototype sandbox
      var img = document.getElementById('scenario-image');
      if (img) img.src = '../../quizzes/Q006_SafetyReviewStructure/R1_PolicyReview/assets/issue-image/r1-policy-review.png';

      var isSlow = false;
      document.getElementById('btn-speed').addEventListener('click', function() {
        isSlow = !isSlow;
        this.textContent = isSlow ? 'Speed: 0.5x' : 'Speed: 1.0x';
        document.documentElement.style.setProperty('--motion-dur-medium', isSlow ? '900ms' : '450ms');
        document.documentElement.style.setProperty('--motion-dur-slow', isSlow ? '1100ms' : '550ms');
        document.documentElement.style.setProperty('--motion-dur-normal', isSlow ? '700ms' : '350ms');
      });

      document.getElementById('btn-replay').addEventListener('click', function() {
        var canvas = document.querySelector('.quiz-board');
        canvas.classList.remove('motion-instant-ready');
        var anims = canvas.querySelectorAll('.motion-animate-in');
        anims.forEach(function(el) {
          el.style.animation = 'none';
          void el.offsetWidth;
          el.style.animation = '';
        });
        mc.playEntrance();
      });

      document.getElementById('btn-reduced').addEventListener('click', function() {
        var isReduced = document.body.classList.toggle('prefers-reduced-motion-simulated');
        this.textContent = isReduced ? 'Reduced Motion: ON' : 'Reduced Motion: OFF';
        if (isReduced) {
          document.querySelector('.quiz-board').classList.add('motion-instant-ready');
        } else {
          document.querySelector('.quiz-board').classList.remove('motion-instant-ready');
        }
      });

      document.getElementById('btn-reveal').addEventListener('click', function() {
        var cards = [
          { status: 'CORRECT', element: document.querySelector('.option-card[data-option-id="apex"]') },
          { status: 'INCORRECT', element: document.querySelector('.option-card[data-option-id="sub"]') },
          { status: 'INCORRECT', element: document.querySelector('.option-card[data-option-id="adhoc"]') }
        ];
        mc.sequenceAnswerReveal(cards);
      });
    })();
  </script>
"""
    html = html.replace('</body>', motion_js + '</body>')

    out_path = os.path.join(PROTOTYPE_DIR, "q006_motion.html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(html)
    print("Generated q006_motion.html (1110x960)")


def generate_hub():
    hub_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DICV Interactive — Cinematic Animation & Motion System Hub</title>
  <link rel="stylesheet" href="../../shared/styles/fonts.css">
  <link rel="stylesheet" href="css/motion-design-system.css">
  <style>
    :root {
      --q-petrol-dark: #004355;
      --q-petrol: #00677F;
      --q-petrol-hover: #00566A;
      --q-yellow: #FFFF40;
      --q-white: #FFFFFF;
      --q-dark-grey: #444444;
      --q-light-grey: #E6E6E6;
      --font-family: 'Daimler CS', Arial, sans-serif;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: var(--font-family);
      background: #F4F7F9;
      color: #000000;
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }
    header {
      background: var(--q-petrol-dark);
      color: #FFFFFF;
      padding: 14px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 3px solid var(--q-yellow);
      box-shadow: 0 4px 20px rgba(0, 67, 85, 0.25);
    }
    .header-title h1 {
      font-size: 20px;
      margin: 0 0 4px 0;
      font-weight: 700;
      letter-spacing: -0.2px;
    }
    .header-title p {
      margin: 0;
      font-size: 13px;
      opacity: 0.85;
    }
    .quiz-tabs {
      display: flex;
      gap: 8px;
    }
    .tab-btn {
      background: var(--q-petrol);
      color: #FFFFFF;
      border: 1.5px solid transparent;
      border-radius: 20px;
      padding: 6px 14px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 180ms ease;
    }
    .tab-btn:hover {
      background: var(--q-petrol-hover);
      border-color: rgba(255, 255, 64, 0.5);
    }
    .tab-btn.active {
      background: #003644;
      border-color: var(--q-yellow);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    .tab-badge {
      display: inline-block;
      font-size: 10px;
      padding: 1px 5px;
      border-radius: 4px;
      margin-left: 4px;
      background: rgba(255, 255, 255, 0.2);
    }
    .tab-badge-exception {
      background: #FFFF40;
      color: #004355;
      font-weight: 700;
    }
    .workspace {
      display: flex;
      flex: 1;
      height: calc(100vh - 72px);
    }
    .preview-pane {
      flex: 1;
      background: #EBEFF2;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      position: relative;
    }
    iframe {
      border: none;
      box-shadow: 0 12px 40px rgba(0, 67, 85, 0.18);
      background: transparent;
      border-radius: 8px;
      max-width: 100%;
      max-height: 100%;
      transition: all 250ms ease;
    }
    .telemetry-sidebar {
      width: 360px;
      background: #FFFFFF;
      border-left: 1.5px solid #D5E1E6;
      display: flex;
      flex-direction: column;
      box-shadow: -4px 0 20px rgba(0, 67, 85, 0.05);
    }
    .sidebar-header {
      padding: 14px 18px;
      border-bottom: 1.5px solid #E6ECEF;
      background: #F9FBFC;
    }
    .sidebar-header h2 {
      font-size: 15px;
      margin: 0 0 4px 0;
      color: var(--q-petrol-dark);
    }
    .sidebar-content {
      flex: 1;
      padding: 18px;
      overflow-y: auto;
      font-size: 13px;
      line-height: 1.5;
    }
    .spec-card {
      background: #F4F8FA;
      border: 1px solid #D5E3E8;
      border-left: 3px solid var(--q-petrol);
      padding: 10px 14px;
      border-radius: 6px;
      margin-bottom: 12px;
    }
    .spec-card h3 {
      font-size: 13px;
      margin: 0 0 4px 0;
      color: var(--q-petrol-dark);
    }
    .canvas-spec-pill {
      display: inline-block;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      margin-bottom: 6px;
    }
    .pill-standard {
      background: #E8F7ED;
      color: #008248;
      border: 1px solid #28A745;
    }
    .pill-exception {
      background: #FFF8E7;
      color: #D97706;
      border: 1px solid #E67E22;
    }
    .event-log {
      background: #111820;
      color: #A6CAD8;
      font-family: Consolas, monospace;
      font-size: 11px;
      padding: 10px;
      border-radius: 6px;
      height: 140px;
      overflow-y: auto;
      margin-top: 10px;
    }
    .event-log .ev-item {
      margin-bottom: 4px;
    }
    .event-log .ev-yellow { color: #FFFF40; }
    .event-log .ev-green { color: #52D68A; }
  </style>
</head>
<body>

  <header>
    <div class="header-title">
      <h1>DICV Interactive — Cinematic Animation & Motion System</h1>
      <p>Modern Minimal (50%) + Game Interaction (30%) + Comic Storytelling (20%)</p>
    </div>
    <div class="quiz-tabs" id="tab-group">
      <button class="tab-btn active" data-src="q001_motion.html" data-width="806px" data-height="1020px" data-quiz="Q001">Q001 <span class="tab-badge tab-badge-exception">806×962 (Exc.)</span></button>
      <button class="tab-btn" data-src="q002_motion.html" data-width="1110px" data-height="960px" data-quiz="Q002">Q002 <span class="tab-badge">1110×960</span></button>
      <button class="tab-btn" data-src="q003_motion.html" data-width="1110px" data-height="960px" data-quiz="Q003">Q003 <span class="tab-badge">1110×960</span></button>
      <button class="tab-btn" data-src="q004_motion.html" data-width="1110px" data-height="960px" data-quiz="Q004">Q004 <span class="tab-badge">1110×960</span></button>
      <button class="tab-btn" data-src="q005_motion.html" data-width="1110px" data-height="960px" data-quiz="Q005">Q005 <span class="tab-badge">1110×960</span></button>
      <button class="tab-btn" data-src="q006_motion.html" data-width="1110px" data-height="960px" data-quiz="Q006">Q006 <span class="tab-badge">1110×960</span></button>
    </div>
  </header>

  <div class="workspace">
    <div class="preview-pane">
      <iframe id="motion-frame" src="q001_motion.html" style="width: 806px; height: 1020px;"></iframe>
    </div>

    <aside class="telemetry-sidebar">
      <div class="sidebar-header">
        <h2 id="sidebar-title">Q001: Accident Prediction</h2>
        <span style="font-size: 12px; color: #64717B;">Sequential Motion Specification</span>
      </div>
      <div class="sidebar-content">
        <div class="spec-card">
          <div id="spec-pill" class="canvas-spec-pill pill-exception">SINGLE EXCEPTION: 806 × 962 px</div>
          <h3>Entrance Sequence</h3>
          <div id="spec-sequence">1. Question Title (450ms)<br>2. Instruction Subtitle (400ms)<br>3. Cards A–D staggered (350ms each)<br>4. Stadium Submit (300ms)</div>
        </div>

        <div class="spec-card">
          <h3>Interaction & Physics</h3>
          <div id="spec-physics">Tactile lift on hover (-4px), springless checkbox pop (220ms), Daimler stadium Submit illumination on full selection.</div>
        </div>

        <div class="spec-card">
          <h3>Storyline Synchronization</h3>
          <div id="spec-storyline">Character attentive on entrance, feedback layer triggers on submit, answer reveal sequenced after feedback completes.</div>
        </div>

        <div style="font-weight: 600; margin-top: 14px; margin-bottom: 4px; color: var(--q-petrol-dark);">
          Bridge Motion Telemetry Log:
        </div>
        <div class="event-log" id="event-log">
          <div class="ev-item"><span class="ev-yellow">[INIT]</span> DICVMotionController mounted.</div>
          <div class="ev-item"><span class="ev-green">[READY]</span> Canvas rendered at native dimensions.</div>
        </div>
      </div>
    </aside>
  </div>

  <script>
    const SPECS = {
      Q001: {
        title: 'Q001: Accident Prediction',
        pillClass: 'pill-exception',
        pillText: 'SINGLE EXCEPTION: 806 × 962 px',
        sequence: '1. Question Title (450ms, fade & slide up)<br>2. Subtitle Instruction (400ms)<br>3. Photograph Cards A–D staggered (350ms each, 180ms delay)<br>4. Daimler Stadium Submit (300ms)',
        physics: 'Tactile card hover elevation (-4px), Daimler yellow checkbox pop (220ms), all 4 required selection logic maintained.',
        storyline: 'Storyline character remains in Storyline. Bridge emits QUIZ_ENTRANCE_START and QUIZ_ENTRANCE_COMPLETE.'
      },
      Q002: {
        title: 'Q002: 5 Safety Commitments',
        pillClass: 'pill-standard',
        pillText: 'STANDARDIZED: 1110 × 960 px',
        sequence: '1. Mounted Header Tab (450ms, fade & rise)<br>2. Instruction Subtitle (400ms)<br>3. 5 Icon Cards in 3+2 reading order (350ms each, 180ms stagger)<br>4. Submit Pill (300ms)',
        physics: 'Gentle card elevation, yellow border pop, all 5 required selection logic maintained.',
        storyline: 'Meister/Torq reaction in Storyline upon selection and post-feedback 5-item reveal.'
      },
      Q003: {
        title: 'Q003: EHS Commitments',
        pillClass: 'pill-standard',
        pillText: 'STANDARDIZED: 1110 × 960 px',
        sequence: '1. Instruction Header (450ms)<br>2. 5 Commitment Cards (350ms each, 180ms stagger)<br>3. Daimler Stadium Submit Pill (300ms)',
        physics: 'Smooth select/deselect, 5th unselected card disables smoothly upon 4th selection (Max-4 limit preserved).',
        storyline: 'Correct items (0, 1, 2, 4) pulse green, distractor 3 reveals red settle.'
      },
      Q004: {
        title: 'Q004: EHS Focus Areas',
        pillClass: 'pill-standard',
        pillText: 'STANDARDIZED: 1110 × 960 px',
        sequence: '1. Header (450ms)<br>2. Pinwheel Diagram (550ms scale & fade)<br>3. 3 Drop Targets (400ms)<br>4. 4 Focus Area Cards (350ms each)<br>5. Submit Pill (300ms)',
        physics: 'Stage auto-scaled proportionally to fit 1110×960. Drag pickup lift (scale 1.025, deep shadow), invalid drop eased return (350ms), valid snap pulse (320ms), FLIP atomic card swap.',
        storyline: 'Bridge emits QUIZ_DROP_SUCCESS on valid placement. Character adopts confident pose.'
      },
      Q005: {
        title: 'Q005: Safety Culture Maturity',
        pillClass: 'pill-standard',
        pillText: 'STANDARDIZED: 1110 × 960 px',
        sequence: '1. Question Header (450ms)<br>2. Bradley Curve Path-Draw (900ms stroke-dashoffset)<br>3. 4 Stage Checkpoints (400ms)<br>4. Expanded Lower Dock Tray & Cards (350ms)<br>5. Submit Pill (300ms)',
        physics: 'Expanded 960px vertical canvas resolves vertical graph tightness. Stage card pickup lift, snap to curve targets, FLIP swap, zero implied numerical rates.',
        storyline: 'Post-feedback sequential reveal follows Reactive → Dependent → Independent → Interdependent sequence.'
      },
      Q006: {
        title: 'Q006: Safety Review Structure',
        pillClass: 'pill-standard',
        pillText: 'STANDARDIZED: 1110 × 960 px',
        sequence: '1. Safety Issue Counter (450ms)<br>2. Progress Indicator (400ms)<br>3. Issue Illustration fades from left (550ms)<br>4. Scenario Text (400ms)<br>5. 3 Committee Cards staggered (350ms each)<br>6. Submit (300ms)',
        physics: 'Centered 820×580 board inside 1110×960 transparent canvas with ambient depth. Hover card lift, yellow border glow, single-choice selection pulse.',
        storyline: 'Round 1 Apex Committee highlighted post-feedback. Identical rules across R1, R2, R3.'
      }
    };

    const tabs = document.querySelectorAll('.tab-btn');
    const iframe = document.getElementById('motion-frame');
    const log = document.getElementById('event-log');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const src = tab.getAttribute('data-src');
        const w = tab.getAttribute('data-width');
        const h = tab.getAttribute('data-height');
        const q = tab.getAttribute('data-quiz');

        iframe.src = src;
        iframe.style.width = w;
        iframe.style.height = h;

        document.getElementById('sidebar-title').textContent = SPECS[q].title;
        const pill = document.getElementById('spec-pill');
        pill.className = `canvas-spec-pill ${SPECS[q].pillClass}`;
        pill.textContent = SPECS[q].pillText;

        document.getElementById('spec-sequence').innerHTML = SPECS[q].sequence;
        document.getElementById('spec-physics').innerHTML = SPECS[q].physics;
        document.getElementById('spec-storyline').innerHTML = SPECS[q].storyline;

        addLog(`Switched preview to ${q} (${w} × ${h})`);
      });
    });

    window.addEventListener('dicv-motion:QUIZ_ENTRANCE_START', e => addLog(`[ENTRANCE_START] ${e.detail.quizId}`));
    window.addEventListener('dicv-motion:QUIZ_ENTRANCE_COMPLETE', e => addLog(`[ENTRANCE_COMPLETE] ${e.detail.quizId} (instant=${e.detail.data.instant})`));
    window.addEventListener('dicv-motion:QUIZ_DROP_SUCCESS', e => addLog(`[DROP_SUCCESS] Target: ${e.detail.data.targetId}`));
    window.addEventListener('dicv-motion:QUIZ_REVEAL_ANSWERS', e => addLog(`[REVEAL_ANSWERS] ${e.detail.quizId}`));

    function addLog(msg) {
      const item = document.createElement('div');
      item.className = 'ev-item';
      item.innerHTML = `<span class="ev-yellow">[${new Date().toLocaleTimeString()}]</span> ${msg}`;
      log.prepend(item);
    }
  </script>
</body>
</html>
"""
    out_path = os.path.join(PROTOTYPE_DIR, "index.html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(hub_html)
    print("Generated Hub: index.html (Updated to 1110x960 for Q2-Q6)")

if __name__ == "__main__":
    generate_q001()
    generate_q002()
    generate_q003()
    generate_q004()
    generate_q005()
    generate_q006()
    generate_hub()
    print("ALL MOTION PROTOTYPES UPDATED SUCCESSFULLY: Q001 = 806x962 (Exception), Q002-Q006 = 1110x960 Standard!")
