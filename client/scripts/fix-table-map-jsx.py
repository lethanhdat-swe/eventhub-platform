import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "src/pages/(admin)"

for path in ROOT.rglob("*Table.jsx"):
    text = path.read_text(encoding="utf-8")
    if "AdminTableWrapper" not in text:
        continue

    text = re.sub(
        r"(<TableBody>\s*)([a-zA-Z]+)\.map\(",
        r"\1{\2.map(",
        text,
        count=1,
    )
    text = re.sub(
        r"\n\s+\)\)\n\s+\)\}",
        "\n          ))}",
        text,
        count=1,
    )

    path.write_text(text, encoding="utf-8")
    print("Fixed", path.name)
