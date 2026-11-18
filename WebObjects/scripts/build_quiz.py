"""
DICV Interactive — Standalone Quiz Packager
Packages a quiz into a completely self-contained Storyline Web Object folder.
Supports 100% offline self-containment with Base64 asset inlining for zero-dependency SCORM compatibility.
"""

import os
import shutil
import base64

def package_quiz(quiz_id, embed_base64=False):
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    
    # Custom source folder mapping for multi-slide sub-quizzes
    custom_sources = {
        'Q006_R1': os.path.join(project_root, 'quizzes', 'Q006_SafetyReviewStructure', 'R1_PolicyReview'),
        'Q006_R2': os.path.join(project_root, 'quizzes', 'Q006_SafetyReviewStructure', 'R2_PerformanceIssue'),
        'Q006_R3': os.path.join(project_root, 'quizzes', 'Q006_SafetyReviewStructure', 'R3_MachineGuarding')
    }
    quiz_src = custom_sources.get(quiz_id, os.path.join(project_root, 'quizzes', quiz_id))
    dist_dir = os.path.join(project_root, 'dist', quiz_id)
    fonts_src = os.path.join(project_root, 'references', 'fonts')
    bridge_src = os.path.join(project_root, 'shared', 'storyline', 'storyline-bridge.js')

    if not os.path.exists(quiz_src):
        print(f"Error: Quiz source {quiz_src} does not exist.")
        return False

    print(f"Packaging {quiz_id} to {dist_dir} (embed_base64={embed_base64})...")
    os.makedirs(dist_dir, exist_ok=True)

    # 1. Safe Asset Synchronization & Recursive Copy
    src_assets = os.path.join(quiz_src, 'assets')
    dist_assets = os.path.join(dist_dir, 'assets')
    if os.path.exists(src_assets):
        if os.path.exists(dist_assets):
            shutil.rmtree(dist_assets)
        shutil.copytree(src_assets, dist_assets)
        print("  Copied assets/ hierarchy")

    # 1b. Copy Q006 shared runtime files if applicable
    if quiz_id.startswith('Q006_'):
        shared_src = os.path.join(project_root, 'quizzes', 'Q006_SafetyReviewStructure', 'shared')
        for f in ['committee-quiz.css', 'committee-data.js', 'committee-quiz.js']:
            f_path = os.path.join(shared_src, f)
            if os.path.exists(f_path):
                shutil.copy(f_path, os.path.join(dist_dir, f))
                print(f"  Copied shared Q006 file {f}")

    # 2. Copy Fonts
    dist_fonts = os.path.join(dist_dir, 'fonts')
    os.makedirs(dist_fonts, exist_ok=True)
    required_fonts = {
        'DaimlerCS-Regular.ttf': ('400', 'normal'),
        'DaimlerCS-Italic.ttf': ('400', 'italic'),
        'DaimlerCS-Bold.ttf': ('700', 'normal'),
        'DaimlerCS-BoldItalic.ttf': ('700', 'italic')
    }
    font_b64 = {}
    for f, (weight, style) in required_fonts.items():
        fpath = os.path.join(fonts_src, f)
        if os.path.exists(fpath):
            shutil.copy(fpath, os.path.join(dist_fonts, f))
            if embed_base64:
                with open(fpath, 'rb') as fp:
                    font_b64[f] = base64.b64encode(fp.read()).decode('utf-8')
            print(f"  Bundled font {f}")

    # 3. Copy Storyline Bridge
    shutil.copy(bridge_src, os.path.join(dist_dir, 'storyline-bridge.js'))
    print("  Copied storyline-bridge.js")

    # 4. Copy and adapt index.html
    src_html = os.path.join(quiz_src, 'index.html')
    with open(src_html, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Generate fonts.css
    css_rules = []
    for f, (weight, style) in required_fonts.items():
        if embed_base64 and f in font_b64:
            b64_val = font_b64[f]
            css_rules.append(f"""@font-face {{
  font-family: 'Daimler CS';
  src: url('data:font/truetype;charset=utf-8;base64,{b64_val}') format('truetype'),
       url('fonts/{f}') format('truetype');
  font-weight: {weight};
  font-style: {style};
  font-display: swap;
}}""")
        else:
            css_rules.append(f"""@font-face {{
  font-family: 'Daimler CS';
  src: url('fonts/{f}') format('truetype');
  font-weight: {weight};
  font-style: {style};
  font-display: swap;
}}""")
    dist_fonts_css = "\n".join(css_rules) + "\n"
    with open(os.path.join(dist_dir, 'fonts.css'), 'w', encoding='utf-8') as f:
        f.write(dist_fonts_css)

    # Copy theme.css if it exists
    theme_src = os.path.join(project_root, 'shared', 'styles', 'theme.css')
    if os.path.exists(theme_src):
        shutil.copy(theme_src, os.path.join(dist_dir, 'theme.css'))

    # Adapt path references for standalone deployment
    html_content = html_content.replace('../../../shared/styles/fonts.css', 'fonts.css')
    html_content = html_content.replace('../../../shared/styles/theme.css', 'theme.css')
    html_content = html_content.replace('../../../shared/storyline/storyline-bridge.js', 'storyline-bridge.js')
    html_content = html_content.replace('../../shared/styles/fonts.css', 'fonts.css')
    html_content = html_content.replace('../../shared/styles/theme.css', 'theme.css')
    html_content = html_content.replace('../../shared/storyline/storyline-bridge.js', 'storyline-bridge.js')
    html_content = html_content.replace('../shared/committee-quiz.css', 'committee-quiz.css')
    html_content = html_content.replace('../shared/committee-data.js', 'committee-data.js')
    html_content = html_content.replace('../shared/committee-quiz.js', 'committee-quiz.js')

    # Optional Base64 inlining (only if explicitly enabled)
    if embed_base64 and os.path.exists(src_assets):
        for root, dirs, files in os.walk(src_assets):
            for img_file in files:
                if img_file.endswith(('.png', '.jpg', '.jpeg', '.svg')):
                    rel_path = os.path.relpath(os.path.join(root, img_file), quiz_src).replace('\\', '/')
                    img_path = os.path.join(root, img_file)
                    with open(img_path, 'rb') as f_img:
                        b64_data = base64.b64encode(f_img.read()).decode('utf-8')
                    data_uri = f"data:image/png;base64,{b64_data}"
                    html_content = html_content.replace(f'src="{rel_path}"', f'src="{data_uri}"')
                    html_content = html_content.replace(f"src='{rel_path}'", f"src='{data_uri}'")
                    print(f"  Embedded Base64 Data URI for {rel_path}")

    dist_html = os.path.join(dist_dir, 'index.html')
    with open(dist_html, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print("  Generated standalone dist/index.html")

    # Copy quiz.json manifest
    if os.path.exists(os.path.join(quiz_src, 'quiz.json')):
        shutil.copy(os.path.join(quiz_src, 'quiz.json'), os.path.join(dist_dir, 'quiz.json'))
        print("  Copied quiz.json manifest")

    # Copy README.md & PROMPT.md if present
    for doc in ['README.md', 'PROMPT.md']:
        doc_path = os.path.join(quiz_src, doc)
        if os.path.exists(doc_path):
            shutil.copy(doc_path, os.path.join(dist_dir, doc))
            print(f"  Copied {doc}")

    print(f"Package for {quiz_id} completed successfully!\n")
    return True

if __name__ == '__main__':
    package_quiz('Q001_AccidentPrediction', embed_base64=True)
    package_quiz('Q002_SafetyCommitments', embed_base64=False)
    package_quiz('Q003_EHSCommitments', embed_base64=False)
    package_quiz('Q004_EHSFocusAreas', embed_base64=False)
    package_quiz('Q005_SafetyCultureMaturity', embed_base64=False)
    package_quiz('Q006_R1', embed_base64=False)
    package_quiz('Q006_R2', embed_base64=False)
    package_quiz('Q006_R3', embed_base64=False)
