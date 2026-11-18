"""Package the standalone CourseMap Storyline Web Object into WebObjects/dist/CourseMap/."""

from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / "coursemap"
FONTS_SRC = ROOT / "references" / "fonts"
FONTS_CSS_SRC = ROOT / "shared" / "styles" / "fonts.css"
DIST_DIR = ROOT / "dist" / "CourseMap"

CORE_FILES = [
    "index.html",
    "coursemap.css",
    "coursemap.js",
    "coursemap-data.js",
    "coursemap-bridge.js",
    "coursemap-storyline-host.js",
    "README_STORYLINE_SETUP.md",
]


def build_coursemap() -> Path:
    if DIST_DIR.exists():
        shutil.rmtree(DIST_DIR)
    DIST_DIR.mkdir(parents=True, exist_ok=True)

    for name in CORE_FILES:
        src = SRC_DIR / name
        if not src.exists():
            raise FileNotFoundError(f"Missing required CourseMap source file: {src}")
        dst = DIST_DIR / name
        if name == "coursemap.css":
            css = src.read_text(encoding="utf-8")
            css = css.replace("../shared/styles/fonts.css", "fonts.css")
            dst.write_text(css, encoding="utf-8")
        else:
            shutil.copy2(src, dst)

    fonts_dst = DIST_DIR / "fonts"
    fonts_dst.mkdir(parents=True, exist_ok=True)
    for ttf in FONTS_SRC.glob("DaimlerCS-*.ttf"):
        shutil.copy2(ttf, fonts_dst / ttf.name)

    svg_src = SRC_DIR / "SVG"
    if svg_src.exists():
        shutil.copytree(svg_src, DIST_DIR / "SVG", dirs_exist_ok=True)

    shutil.copytree(SRC_DIR / "assets", DIST_DIR / "assets", dirs_exist_ok=True)

    fonts_css = FONTS_CSS_SRC.read_text(encoding="utf-8")
    fonts_css = fonts_css.replace("../../references/fonts/", "fonts/")
    (DIST_DIR / "fonts.css").write_text(fonts_css, encoding="utf-8")

    return DIST_DIR


if __name__ == "__main__":
    out = build_coursemap()
    print(f"Built standalone CourseMap Web Object at: {out}")
