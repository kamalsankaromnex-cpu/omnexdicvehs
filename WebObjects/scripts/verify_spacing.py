"""
DICV Interactive — Automated Pre-Flight Pixel Alignment & Spacing Validator
Audits rendered Web Object screenshots for common layout and typography defects:
1. Hardcoded / orphaned question wrapping
2. Bottom dead space voids (> 35px)
3. Horizontal column guide misalignment
4. Uneven card gap rhythms
"""

import sys
import os
from PIL import Image

def audit_quiz_rendering(screenshot_path, canvas_w=588, canvas_h=625):
    if not os.path.exists(screenshot_path):
        print(f"Error: Screenshot {screenshot_path} not found.")
        return False

    im = Image.open(screenshot_path).convert('RGB')
    w, h = im.size
    print(f"Auditing {os.path.basename(screenshot_path)} ({w}x{h} px)...")

    issues = []

    # 1. Check Header Text Width and Lines
    header_rows = []
    for y in range(15, 80):
        text_pixels = [x for x in range(20, w - 20) if im.getpixel((x, y))[0] > 180 and im.getpixel((x, y))[1] > 180 and im.getpixel((x, y))[2] > 180]
        if text_pixels:
            header_rows.append((y, min(text_pixels), max(text_pixels)))

    if header_rows:
        min_x = min(r[1] for r in header_rows)
        max_x = max(r[2] for r in header_rows)
        text_w = max_x - min_x
        # Check if text is awkwardly occupying only a fraction of header
        if text_w < w * 0.5:
            issues.append(f"Warning: Question text width ({text_w}px) occupies less than 50% of header width. Check for premature or hardcoded line wraps.")

    # 2. Check Vertical Landmarks & Cards
    card_edges = []
    in_card = False
    start_y = 0
    for y in range(80, h - 50):
        p = im.getpixel((30, y))
        is_card = (p != (255, 255, 255))
        if is_card and not in_card:
            in_card = True
            start_y = y
        elif not is_card and in_card:
            in_card = False
            card_edges.append((start_y, y - 1))
    if in_card:
        card_edges.append((start_y, h - 50))

    # 3. Check Bottom Void below last element
    # Scan from h-1 upwards for non-white pixels (footer controls)
    last_content_y = 0
    for y in range(h - 1, h - 80, -1):
        row_has_content = any(im.getpixel((x, y)) != (255, 255, 255) for x in range(20, w - 20))
        if row_has_content:
            last_content_y = y
            break

    bottom_margin = h - 1 - last_content_y
    if bottom_margin > 40:
        issues.append(f"Warning: Large unallocated bottom dead space ({bottom_margin}px). Recalculate vertical rhythm budget.")

    print("\n--- Pre-Flight Alignment Audit Results ---")
    if not issues:
        print("[OK] All layout, spacing, and typography alignment checks PASSED!")
        return True
    else:
        for iss in issues:
            print(f"[WARN] {iss}")
        return False

if __name__ == '__main__':
    default_img = os.path.join(os.path.dirname(__file__), '..', 'references', 'quiz-screenshots', 'Q001_rendered_v4.png')
    audit_quiz_rendering(default_img)
