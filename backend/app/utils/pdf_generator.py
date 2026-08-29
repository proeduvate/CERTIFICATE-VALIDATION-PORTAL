import io
from reportlab.pdfgen import canvas


def generate_certificate_pdf(intern_name: str, certificate_number: str, filename=None) -> bytes:
    buffer = io.BytesIO() if filename is None else filename
    c = canvas.Canvas(buffer)

    c.setFont("Helvetica-Bold", 24)
    c.drawString(120, 780, "Certificate of Completion")

    c.setFont("Helvetica", 16)
    c.drawString(100, 720, "This certificate is awarded to")

    c.setFont("Helvetica-Bold", 20)
    c.drawString(100, 690, intern_name)

    c.setFont("Helvetica", 14)
    c.drawString(100, 650, f"Certificate Number: {certificate_number}")

    c.save()

    if filename is None:
        return buffer.getvalue()
    return b""