from __future__ import annotations

from pathlib import Path
import re

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer


def md_to_paragraph_markup(block: str) -> str:
    # Minimal markdown -> ReportLab Paragraph markup.
    s = block
    s = s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

    # inline code
    s = re.sub(r"`([^`]+)`", r'<font face="Courier">\\1</font>', s)

    # bold
    s = re.sub(r"\*\*([^*]+)\*\*", r"<b>\\1</b>", s)

    # italic
    s = re.sub(r"\*([^*]+)\*", r"<i>\\1</i>", s)

    # preserve line breaks
    s = s.replace("\n", "<br/>")
    return s


def main() -> None:
    repo_root = Path("C:/Users/sanja/AutoApply-AI-")
    md_path = repo_root / "AUTOAPPLY_PRD.md"
    pdf_path = repo_root / "AUTOAPPLY_PRD.pdf"

    text = md_path.read_text(encoding="utf-8", errors="ignore")
    lines = text.splitlines()

    styles = getSampleStyleSheet()
    style_h1 = ParagraphStyle("H1", parent=styles["Heading1"], fontSize=14, leading=18, spaceAfter=8)
    style_h2 = ParagraphStyle("H2", parent=styles["Heading2"], fontSize=12, leading=15, spaceAfter=6)
    style_h3 = ParagraphStyle("H3", parent=styles["Heading3"], fontSize=11, leading=14, spaceAfter=5)
    style_normal = ParagraphStyle("NormalCustom", parent=styles["BodyText"], fontSize=9.6, leading=12.5)

    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36,
    )

    story: list[object] = []
    current_block_lines: list[str] = []

    def flush_block() -> None:
        nonlocal current_block_lines
        if not current_block_lines:
            return
        block = "\n".join(current_block_lines).strip()
        current_block_lines = []
        if not block:
            return
        story.append(Paragraph(md_to_paragraph_markup(block), style_normal))
        story.append(Spacer(1, 6))

    for line in lines:
        if line.strip() == "":
            flush_block()
            continue

        if line.startswith("# "):
            flush_block()
            story.append(Paragraph(md_to_paragraph_markup(line[2:].strip()), style_h1))
            story.append(Spacer(1, 6))
            continue
        if line.startswith("## "):
            flush_block()
            story.append(Paragraph(md_to_paragraph_markup(line[3:].strip()), style_h2))
            story.append(Spacer(1, 5))
            continue
        if line.startswith("### "):
            flush_block()
            story.append(Paragraph(md_to_paragraph_markup(line[4:].strip()), style_h3))
            story.append(Spacer(1, 4))
            continue

        current_block_lines.append(line)

    flush_block()
    doc.build(story)
    print(f"Wrote {pdf_path}")


if __name__ == "__main__":
    main()

