#!/usr/bin/env python3
"""Bundle _src/page.html, CSS, JS and WebP photos into a single index.html."""

from base64 import b64encode
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "_src"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def mb(value: int) -> str:
    return f"{value / 1024 / 1024:.2f} MB"


css_files = sorted((SRC / "css").glob("*.css"))
js_files = sorted((SRC / "js").glob("*.js"))

styles = "\n\n".join(
    f"/* ===== {path.name} ===== */\n{read(path)}" for path in css_files
)
scripts = "\n\n".join(
    f"/* ===== {path.name} ===== */\n{read(path)}" for path in js_files
)

html = read(SRC / "page.html")
assert html.count("__STYLES__") == 1, "expected one __STYLES__ token"
assert html.count("__SCRIPTS__") == 1, "expected one __SCRIPTS__ token"
html = html.replace("__STYLES__", styles).replace("__SCRIPTS__", scripts)

embedded = 0
raw_bytes = 0
unused = []

for image in sorted((ROOT / "assets_webp").glob("*.webp")):
    token = f"__IMG:{image.stem}__"
    if token not in html:
        unused.append(image.stem)
        continue
    raw_bytes += image.stat().st_size
    data_uri = "data:image/webp;base64," + b64encode(image.read_bytes()).decode("ascii")
    embedded += html.count(token)
    html = html.replace(token, data_uri)

assert "__STYLES__" not in html
assert "__SCRIPTS__" not in html
assert "__IMG:" not in html, "unresolved image token in build"

output = ROOT / "index.html"
output.write_text(html, encoding="utf-8")

size = output.stat().st_size
print(f"Built {output.name} — {mb(size)}")
print(f"CSS: {len(css_files)} files · JS: {len(js_files)} files")
print(f"Embedded {embedded} image references from {len(list((ROOT / 'assets_webp').glob('*.webp')))} WebP files ({mb(raw_bytes)} raw)")
if unused:
    print("Unused images: " + ", ".join(unused))
