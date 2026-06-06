import io
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor, black


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

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "PDFTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=24,
        textColor=HexColor("#1A365D"),
        spaceAfter=15,
    )

    label_style = ParagraphStyle(
        "PDFLabel",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        textColor=HexColor("#4A5568"),
        spaceAfter=5,
    )

    body_style = ParagraphStyle(
        "PDFBody",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=11,
        textColor=HexColor("#2D3748"),
        spaceAfter=15,
    )

    story.append(Paragraph("VendorBridge - Request for Quotation", title_style))
    story.append(Spacer(1, 10))

    story.append(Paragraph("Title:", label_style))
    story.append(Paragraph(rfq_title, body_style))

    story.append(Paragraph("Description:", label_style))
    story.append(Paragraph(rfq_desc, body_style))

    story.append(Paragraph("Submission Deadline:", label_style))
    story.append(Paragraph(deadline_str, body_style))

    doc.build(story)
    buffer.seek(0)
    return buffer


def generate_invoice_pdf(invoice_number: str, po_number: str, amount: float, tax: float) -> io.BytesIO:
    """
    Generates a simple PDF invoice.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    story = []
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        "InvoiceTitle", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=24, textColor=HexColor("#2C5282"), spaceAfter=20
    )
    
    story.append(Paragraph("VendorBridge - Commercial Invoice", title_style))
    story.append(Spacer(1, 10))
    
    data = [
        ["Invoice Number:", invoice_number],
        ["Purchase Order:", po_number],
        ["Base Amount:", f"${amount - tax:.2f}"],
        ["Tax Amount:", f"${tax:.2f}"],
        ["Total Amount:", f"${amount:.2f}"]
    ]
    
    t = Table(data, colWidths=[150, 300])
    t.setStyle(TableStyle([
        ('TEXTCOLOR', (0, 0), (0, -1), HexColor("#4A5568")),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LINEBELOW', (0, -1), (-1, -1), 1.5, black),
        ('FONTSIZE', (0, -1), (-1, -1), 14),
    ]))
    
    story.append(t)
    doc.build(story)
    buffer.seek(0)
    return buffer
