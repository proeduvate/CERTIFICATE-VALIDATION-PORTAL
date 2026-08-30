import io
import math
import os
import qrcode
from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

def format_certificate_id(cert_number: str = None, issue_date: str = None, intern_id: str = None) -> str:
    """Format certificate number as PRO-INT-YY-NUM."""
    if cert_number and cert_number.startswith("PRO-INT-"):
        return cert_number

    short_year = "26"
    if issue_date:
        parts = issue_date.replace(",", "").split()
        for p in parts:
            if len(p) == 4 and p.isdigit():
                short_year = p[-2:]
                break

    num = "114"
    if cert_number:
        digits = "".join([c for c in cert_number if c.isdigit()])
        if digits:
            num = digits
    elif intern_id:
        num = str(intern_id)

    return f"PRO-INT-{short_year}-{num}"


def truncate_details_name(name: str) -> str:
    """Ensure intern name fits inside details box without overflow."""
    if not name:
        return "A S RAGAVI"
    clean = str(name).upper().strip()
    if len(clean) <= 20:
        return clean
    parts = clean.split()
    if len(parts) > 1:
        abbr = f"{parts[0]} {' '.join([p[0] + '.' for p in parts[1:]])}"
        if len(abbr) <= 20:
            return abbr
    return f"{clean[:19]}."


def generate_certificate_image(
    intern_name: str = "A S RAGAVI",
    certificate_number: str = "PRO-INT-26-114",
    domain: str = "FullStack Development",
    start_date: str = "March 14, 2025",
    end_date: str = "June 14, 2026",
    duration: str = "3 MONTHS",
    mode: str = "ONLINE",
    intern_id_code: str = "PRO/INT/MAR26/FSD/016",
    issue_date: str = "24 AUGUST 2026",
    verification_url: str = None,
) -> bytes:
    """
    Renders a high-resolution composite 2000x1414 PNG image of the official certificate.
    """
    formatted_cert_id = format_certificate_id(certificate_number, issue_date, intern_id_code)

    # 1. Load Background Template (2000 x 1414)
    bg_paths = [
        "frontend/public/certificate-template-bg.png",
        "../frontend/public/certificate-template-bg.png",
        "public/certificate-template-bg.png",
        "certificate-template-bg.png",
    ]
    bg = None
    for p in bg_paths:
        try:
            bg = Image.open(p).convert("RGBA")
            break
        except Exception:
            continue

    if bg is None:
        bg = Image.new("RGBA", (2000, 1414), (255, 255, 255, 255))

    w, h = bg.size # 2000 x 1414

    overlay = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(overlay)

    # Load Montserrat-Bold TTF
    montserrat_path = "app/assets/fonts/Montserrat-Bold.ttf"
    if not os.path.exists(montserrat_path):
        montserrat_path = "../backend/app/assets/fonts/Montserrat-Bold.ttf"

    try:
        font_name_56 = ImageFont.truetype(montserrat_path, 56)
        font_bold_20 = ImageFont.truetype(montserrat_path, 20)
        font_stamp_14 = ImageFont.truetype(montserrat_path, 14)
        font_stamp_16 = ImageFont.truetype(montserrat_path, 16)
    except Exception:
        font_name_56 = ImageFont.load_default()
        font_bold_20 = ImageFont.load_default()
        font_stamp_14 = ImageFont.load_default()
        font_stamp_16 = ImageFont.load_default()

    try:
        font_reg_24 = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24, index=0)
        font_bold_19 = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 19, index=1)
    except Exception:
        font_reg_24 = font_bold_20
        font_bold_19 = font_bold_20

    # 2. Top-Left Dynamic Seal (Center X = 300, Y = 475, Radius = 100)
    sx, sy, r = 300, 475, 100
    purple_color = (124, 58, 237, 255)

    # Concentric Circles
    draw.ellipse([sx - r, sy - r, sx + r, sy + r], outline=purple_color, width=4)
    draw.ellipse([sx - (r - 9), sy - (r - 9), sx + (r - 9), sy + (r - 9)], outline=purple_color, width=2)
    draw.ellipse([sx - (r - 48), sy - (r - 48), sx + (r - 48), sy + (r - 48)], outline=purple_color, width=2)
    draw.ellipse([sx - (r - 55), sy - (r - 55), sx + (r - 55), sy + (r - 55)], outline=purple_color, width=3)

    # Center Box PROEDUVATE
    draw.rectangle([sx - 68, sy - 20, sx + 68, sy + 20], fill=(255, 255, 255, 255), outline=purple_color, width=3)
    p_box = draw.textbbox((0, 0), "PROEDUVATE", font=font_stamp_16)
    draw.text((sx - (p_box[2] - p_box[0]) / 2, sy - (p_box[3] - p_box[1]) / 2 - 2), "PROEDUVATE", fill=purple_color, font=font_stamp_16)

    # Mid-channel arc text (Radius = 71)
    arc_r = 71.0

    # Top Arc
    top_str = (intern_name or "A S RAGAVI").upper()
    num_top = len(top_str)
    start_angle, end_angle = 150.0, 30.0
    angle_range = start_angle - end_angle

    for i, char in enumerate(top_str):
        ang = start_angle - (i / (num_top - 1)) * angle_range if num_top > 1 else 90.0
        rad = math.radians(ang)
        char_x = sx + arc_r * math.cos(rad)
        char_y = sy - arc_r * math.sin(rad)
        
        txt_img = Image.new("RGBA", (40, 40), (255, 255, 255, 0))
        t_draw = ImageDraw.Draw(txt_img)
        t_box = t_draw.textbbox((0, 0), char, font=font_stamp_14)
        t_draw.text((20 - (t_box[2]-t_box[0])/2, 20 - (t_box[3]-t_box[1])/2), char, fill=purple_color, font=font_stamp_14)
        rotated_txt = txt_img.rotate(90 - ang, resample=Image.BICUBIC, expand=True)
        
        rx, ry = rotated_txt.size
        overlay.paste(rotated_txt, (int(char_x - rx / 2), int(char_y - ry / 2)), rotated_txt)

    # Bottom Arc
    bot_str = (intern_id_code or formatted_cert_id).upper()
    num_bot = len(bot_str)
    b_start, b_end = 210.0, 330.0
    b_range = b_end - b_start

    for i, char in enumerate(bot_str):
        ang = b_start + (i / (num_bot - 1)) * b_range if num_bot > 1 else 270.0
        rad = math.radians(ang)
        char_x = sx + arc_r * math.cos(rad)
        char_y = sy - arc_r * math.sin(rad)

        txt_img = Image.new("RGBA", (40, 40), (255, 255, 255, 0))
        t_draw = ImageDraw.Draw(txt_img)
        t_box = t_draw.textbbox((0, 0), char, font=font_stamp_14)
        t_draw.text((20 - (t_box[2]-t_box[0])/2, 20 - (t_box[3]-t_box[1])/2), char, fill=purple_color, font=font_stamp_14)
        rotated_txt = txt_img.rotate(-90 - ang, resample=Image.BICUBIC, expand=True)

        rx, ry = rotated_txt.size
        overlay.paste(rotated_txt, (int(char_x - rx / 2), int(char_y - ry / 2)), rotated_txt)

    # 3. Recipient Name (Prominent Large Montserrat-Bold 56px, Electric Blue)
    name_str = (intern_name or "A S RAGAVI").upper()
    curr_font = font_name_56
    if len(name_str) > 24:
        try:
            curr_font = ImageFont.truetype(montserrat_path, 46)
        except Exception:
            curr_font = font_name_56

    bbox_name = draw.textbbox((0, 0), name_str, font=curr_font)
    name_w = bbox_name[2] - bbox_name[0]
    draw.text((1000 - name_w / 2, 518), name_str, fill=(0, 112, 243, 255), font=curr_font)

    # 4. Main Body Paragraph
    domain_title = domain or "FullStack Development"
    s_date = start_date or "March 14, 2025"
    e_date = end_date or "June 14, 2026"

    line1 = f"was associated with ProEduvate as a {domain_title} Intern from {s_date}, to {e_date}."
    b1 = draw.textbbox((0, 0), line1, font=font_reg_24)
    draw.text((1000 - (b1[2] - b1[0]) / 2, 642), line1, fill=(30, 41, 59, 255), font=font_reg_24)

    line2 = f"During this period, practical exposure to {domain_title} concepts was gained, exhibiting a genuine interest in learning and a professional attitude in"
    b2 = draw.textbbox((0, 0), line2, font=font_reg_24)
    draw.text((1000 - (b2[2] - b2[0]) / 2, 682), line2, fill=(30, 41, 59, 255), font=font_reg_24)

    line3 = "all activities assigned during the internship."
    b3 = draw.textbbox((0, 0), line3, font=font_reg_24)
    draw.text((1000 - (b3[2] - b3[0]) / 2, 722), line3, fill=(30, 41, 59, 255), font=font_reg_24)

    line4 = "Demonstrated enthusiastic participation in the tasks and projects assigned during internship tenure."
    b4 = draw.textbbox((0, 0), line4, font=font_reg_24)
    draw.text((1000 - (b4[2] - b4[0]) / 2, 762), line4, fill=(30, 41, 59, 255), font=font_reg_24)

    # 5. Details Box (Tight, compact spacing matching sample)
    dur_str = str(duration or "3 MONTHS").upper()
    if "MONTH" not in dur_str:
        dur_str = f"{dur_str} MONTHS"
    mode_str = str(mode or "ONLINE").upper()
    truncated_name = truncate_details_name(intern_name)

    items = [
        ("INTERN NAME", ": " + truncated_name),
        ("INTERNSHIP DOMAIN", ": " + domain_title.upper()),
        ("DURATION OF PARTICIPATION", ": " + dur_str),
        ("MODE", ": " + mode_str),
        ("CERTIFICATE ID", ": " + formatted_cert_id),
    ]

    y_cur = 980
    for lbl, val in items:
        draw.text((215, y_cur), lbl, fill=(51, 65, 85, 255), font=font_bold_20)
        draw.text((425, y_cur), val, fill=(15, 23, 42, 255), font=font_bold_20)
        y_cur += 45

    # 6. Dynamic QR Code (X = 1640, Y = 995, Width = 210)
    target_qr_url = (
        verification_url
        or f"https://www.proeduvate.in/verify/{intern_id_code or formatted_cert_id}"
    )

    qr = qrcode.QRCode(version=1, box_size=5, border=1)
    qr.add_data(target_qr_url)
    qr.make(fit=True)
    qr_pil = qr.make_image(fill_color="black", back_color="white").convert("RGBA")
    qr_pil = qr_pil.resize((210, 210), Image.BICUBIC)
    overlay.paste(qr_pil, (1640, 995), qr_pil)

    # SCAN & VERIFY
    qr_lbl = "SCAN & VERIFY"
    bq = draw.textbbox((0, 0), qr_lbl, font=font_bold_19)
    draw.text((1745 - (bq[2] - bq[0]) / 2, 1220), qr_lbl, fill=(17, 24, 39, 255), font=font_bold_19)

    # 7. Date of Issue Footer Line (Exact horizontal baseline match at Y = 1309px, X_right = 1810)
    issue_str = str(issue_date or "24 AUGUST 2026").upper()
    if not issue_str.startswith("DATE OF ISSUE"):
        issue_str = f"DATE OF ISSUE: {issue_str}"

    bi = draw.textbbox((0, 0), issue_str, font=font_bold_19)
    draw.text((1810 - (bi[2] - bi[0]), 1309), issue_str, fill=(17, 24, 39, 255), font=font_bold_19)

    # Combine overlay and return PNG bytes
    combined = Image.alpha_composite(bg, overlay).convert("RGB")

    img_buf = io.BytesIO()
    combined.save(img_buf, format="PNG")
    img_bytes = img_buf.getvalue()
    img_buf.close()

    return img_bytes


def generate_certificate_pdf(
    intern_name: str = "A S RAGAVI",
    certificate_number: str = "PRO-INT-26-114",
    domain: str = "FullStack Development",
    start_date: str = "March 14, 2025",
    end_date: str = "June 14, 2026",
    duration: str = "3 MONTHS",
    mode: str = "ONLINE",
    intern_id_code: str = "PRO/INT/MAR26/FSD/016",
    issue_date: str = "24 AUGUST 2026",
    verification_url: str = None,
) -> bytes:
    """
    Generates a 1-page A4 landscape PDF from the high-resolution composite certificate image.
    """
    img_bytes = generate_certificate_image(
        intern_name=intern_name,
        certificate_number=certificate_number,
        domain=domain,
        start_date=start_date,
        end_date=end_date,
        duration=duration,
        mode=mode,
        intern_id_code=intern_id_code,
        issue_date=issue_date,
        verification_url=verification_url,
    )

    img_buf = io.BytesIO(img_bytes)

    pdf_buf = io.BytesIO()
    pdf_canvas = canvas.Canvas(pdf_buf, pagesize=landscape(A4))
    pdf_w, pdf_h = landscape(A4)

    pdf_canvas.drawImage(ImageReader(img_buf), 0, 0, width=pdf_w, height=pdf_h)
    pdf_canvas.save()

    pdf_bytes = pdf_buf.getvalue()
    pdf_buf.close()
    img_buf.close()

    return pdf_bytes