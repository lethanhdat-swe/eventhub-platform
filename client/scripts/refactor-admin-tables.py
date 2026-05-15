import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "src/pages/(admin)"
EMPTY_PAT = re.compile(
    r"\n\s+\{(\w+)\.length === 0 \? \(\n\s*<TableRow className=\"hover:bg-transparent\">"
    r"[\s\S]*?</TableRow>\n\s*\) : \(\n\s*",
    re.MULTILINE,
)

for path in ROOT.rglob("*Table.jsx"):
    text = path.read_text(encoding="utf-8")
    if "gap-0 overflow-hidden py-0" not in text:
        continue

    text = text.replace(
        "import { Card } from '@/components/ui/card';",
        "import AdminTableWrapper from '@/pages/(admin)/components/table/AdminTableWrapper';",
    )
    text = text.replace(
        '<Card className="gap-0 overflow-hidden py-0">',
        "<AdminTableWrapper>",
    )
    text = text.replace("</Card>", "</AdminTableWrapper>")

    text, count = EMPTY_PAT.subn("\n          ", text)
  # Remove extra closing paren from old ternary after .map block ends
    text = text.replace("            ))\n          )}", "            ))\n        )}")

    path.write_text(text, encoding="utf-8")
    print(f"Updated {path.relative_to(ROOT.parents[1])} (empty blocks: {count})")
