#!/usr/bin/env python3
"""Rebuild js/feed-*.js from feed/*.html (edit HTML, then run this)."""
import json
from pathlib import Path

root = Path(__file__).resolve().parent.parent
for name in ("amsterdam", "paris", "london"):
    html_path = root / "feed" / f"{name}.html"
    if not html_path.is_file():
        continue
    html = html_path.read_text(encoding="utf-8")
    out = root / "js" / f"feed-{name}.js"
    out.write_text("window.TRIP_FEED_HTML = " + json.dumps(html) + ";\n", encoding="utf-8")
    print(f"Wrote {out.relative_to(root)}")
