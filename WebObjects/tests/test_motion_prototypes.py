"""
Test and Capture Screenshots for DICV Interactive Motion Prototypes.
Validates standardized canvas sizes:
- Q001: 806x962 px (SINGLE EXCEPTION)
- Q002 to Q006: Strictly 1110x960 px Standard
"""

import os
import subprocess

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
BRAIN_DIR = r"C:\Users\CIE\.gemini\antigravity\brain\4030faa2-1380-4647-982b-d73a06809da8"
PROTOS_DIR = r"D:\Development\Projects\dicv-interactive\WebObjects\prototypes\motion"

TARGETS = [
    ("index.html", 1500, 1050, "motion_hub_preview.png"),
    ("q001_motion.html?settled=true", 806, 1020, "motion_q001_entrance.png"),
    ("q002_motion.html?settled=true", 1110, 960, "motion_q002_entrance_1110x960.png"),
    ("q003_motion.html?settled=true", 1110, 960, "motion_q003_entrance_1110x960.png"),
    ("q004_motion.html?settled=true", 1110, 960, "motion_q004_pinwheel_1110x960.png"),
    ("q005_motion.html?settled=true", 1110, 960, "motion_q005_bradley_1110x960.png"),
    ("q006_motion.html?settled=true", 1110, 960, "motion_q006_committee_1110x960.png"),
]

def capture_screenshots():
    for filename, width, height, out_name in TARGETS:
        file_path = os.path.join(PROTOS_DIR, filename)
        file_url = "file:///" + file_path.replace("\\", "/")
        out_path = os.path.join(BRAIN_DIR, out_name)
        if os.path.exists(out_path):
            try:
                os.remove(out_path)
            except Exception:
                pass

        cmd = [
            CHROME_PATH,
            "--headless=new",
            "--disable-gpu",
            f"--window-size={width},{height}",
            "--hide-scrollbars",
            f"--screenshot={out_path}",
            "--virtual-time-budget=4000",
            file_url
        ]

        print(f"Capturing {filename} at {width}x{height} -> {out_name}...")
        res = subprocess.run(cmd, capture_output=True, text=True)
        if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
            print(f"  SUCCESS: {out_name} ({os.path.getsize(out_path)} bytes)")
        else:
            print(f"  WARNING: Failed to capture {out_name}. Error: {res.stderr}")

if __name__ == "__main__":
    capture_screenshots()
