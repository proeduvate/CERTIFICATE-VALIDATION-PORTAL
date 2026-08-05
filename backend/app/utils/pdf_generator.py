from reportlab.pdfgen import canvas


def generate_certificate_pdf(intern_name, certificate_number, filename):
    c = canvas.Canvas(filename)

    c.setFont("Helvetica-Bold", 24)
    c.drawString(120, 780, "Certificate of Completion")

    c.setFont("Helvetica", 16)
    c.drawString(100, 720, f"This certificate is awarded to")

    c.setFont("Helvetica-Bold", 20)
    c.drawString(100, 690, intern_name)

    c.setFont("Helvetica", 14)
    c.drawString(100, 650, f"Certificate Number: {certificate_number}")

    c.save()