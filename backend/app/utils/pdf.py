import io
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor


def generate_rfq_pdf(rfq_title: str, rfq_desc: str, deadline_str: str) -> io.BytesIO:
    """
    Generates a beautifully formatted PDF document for an RFQ.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40,
    )
    story = []

    # Modern Premium Style Palette
    styles = getSampleStyleSheet()

    # Custom Heading Style
    title_style = ParagraphStyle(
        "PDFTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=24,
        textColor=HexColor("#1A365D"),  # Deep Navy Blue
        spaceAfter=15,
    )

    # Custom Label Style
    label_style = ParagraphStyle(
        "PDFLabel",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        textColor=HexColor("#4A5568"),  # Slate Grey
        spaceAfter=5,
    )

    # Custom Body Style
    body_style = ParagraphStyle(
        "PDFBody",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=11,
        textColor=HexColor("#2D3748"),
        spaceAfter=15,
    )

    # Add content to story
    story.append(Paragraph("VendorBridge - Request for Quotation", title_style))
    story.append(Spacer(1, 10))

    story.append(Paragraph("Title:", label_style))
    story.append(Paragraph(rfq_title, body_style))

    story.append(Paragraph("Description:", label_style))
    story.append(Paragraph(rfq_desc, body_style))

    story.append(Paragraph("Submission Deadline:", label_style))
    story.append(Paragraph(deadline_str, body_style))

    # Build the document
    doc.build(story)
    buffer.seek(0)
    return buffer
