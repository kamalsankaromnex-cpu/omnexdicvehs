"""
DICV Interactive — Automated Design System Compliance & Regression Test Suite
Verifies corporate colors, typography, assets, and Storyline variables across all quizzes.
"""

import os
import re
import sys

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
QUIZZES_DIR = os.path.join(PROJECT_ROOT, 'quizzes')

# Mandatory Corporate Color Palette
APPROVED_HEX = {
    '#00677F': 'Petrol',
    '#004355': 'Dark Petrol',
    '#00566A': 'Petrol +20K',
    '#007A93': 'Petrol 80%',
    '#5097AB': 'Petrol 60%',
    '#79AEBF': 'Petrol 40%',
    '#A6CAD8': 'Petrol 20%',
    '#FFFF40': 'Daimler Yellow',
    '#000000': 'Black',
    '#FFFFFF': 'White',
    '#E6E6E6': 'Light Grey',
    '#444444': 'Dark Grey',
    # Semantic Status Only
    '#008248': 'Correct Green',
    '#28A745': 'Correct Border Green',
    '#E8F7ED': 'Correct Green BG',
    '#E67E22': 'Missed Amber Border',
    '#D97706': 'Missed Amber Badge',
    '#FFF8E7': 'Missed Amber BG',
    '#D92323': 'Incorrect Red',
    '#E03131': 'Incorrect Red Border',
    '#FDF0F0': 'Incorrect Red BG',
}

BANNED_HEX = [
    '#FFD100', # Golden yellow
    '#F0C020', # Gold border
    '#E5B800', # Gold dark
    '#11161B', # Heavy black border
]

def audit_quiz(quiz_id):
    quiz_path = os.path.join(QUIZZES_DIR, quiz_id)
    html_file = os.path.join(quiz_path, 'index.html')
    
    if not os.path.exists(html_file):
        print(f"[{quiz_id}] FAILED: index.html not found.")
        return False
        
    with open(html_file, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Also aggregate linked local CSS files
    css_content = ""
    css_matches = re.findall(r'<link\s+rel="stylesheet"\s+href="([^"]+)"', html_content)
    for css_rel in css_matches:
        css_full = os.path.normpath(os.path.join(quiz_path, css_rel))
        if os.path.exists(css_full):
            with open(css_full, 'r', encoding='utf-8') as cf:
                css_content += "\n" + cf.read()

    content = html_content + "\n" + css_content

    errors = []
    
    # 1. Check for Banned Hex Codes
    for banned in BANNED_HEX:
        if banned.lower() in content.lower():
            errors.append(f"Found banned non-corporate color: {banned}")

    # 2. Check for Font Family compliance (must use Daimler CS)
    if 'Daimler CS' not in content:
        errors.append("Missing Daimler CS font declaration.")

    # 3. Check for unapproved italics on question title
    if re.search(r'\.question-title[^{]*\{[^}]*font-style:\s*italic', content, re.IGNORECASE):
        errors.append("Question title must NOT use font-style: italic.")

    # 4. Check for local asset links
    if 'http://' in content or 'https://' in content:
        # Check if they are external scripts or images
        if '<img' in content and 'src="http' in content:
            errors.append("Contains external http image src.")
        if '<script' in content and 'src="http' in content:
            errors.append("Contains external http script src.")

    # 5. Check Storyline Bridge inclusion
    if 'storyline-bridge.js' not in content:
        errors.append("Missing storyline-bridge.js integration.")

    if errors:
        print(f"[{quiz_id}] FAILED with {len(errors)} error(s):")
        for e in errors:
            print(f"  - {e}")
        return False
    else:
        print(f"[{quiz_id}] PASSED Design System & Architecture compliance.")
        return True

if __name__ == '__main__':
    quizzes = [
        'Q001_AccidentPrediction',
        'Q002_SafetyCommitments',
        'Q003_EHSCommitments',
        'Q004_EHSFocusAreas',
        'Q005_SafetyCultureMaturity',
        os.path.join('Q006_SafetyReviewStructure', 'R1_PolicyReview'),
        os.path.join('Q006_SafetyReviewStructure', 'R2_PerformanceIssue'),
        os.path.join('Q006_SafetyReviewStructure', 'R3_MachineGuarding')
    ]
    all_passed = True
    for q in quizzes:
        if not audit_quiz(q):
            all_passed = False
            
    if all_passed:
        print("\nAll quizzes PASSED regression audit!")
        sys.exit(0)
    else:
        print("\nAudit encountered failures. Address errors above.")
        sys.exit(1)
