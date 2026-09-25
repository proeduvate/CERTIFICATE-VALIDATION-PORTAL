import random
from datetime import datetime


def generate_certificate_number(db=None, year=None, sequence_id=None, cert_type="completion"):
    """
    Format: PRO-INT-26-114 (Completion) or PRO-PAR-26-114 (Participation)
    26 denotes 2-digit year, and numeric auto-increment.
    """
    current_year = year or datetime.now().year
    short_year = str(current_year)[-2:]

    prefix = "PRO-PAR" if str(cert_type).lower() == "participation" else "PRO-INT"

    if sequence_id is not None:
        num = str(sequence_id)
    else:
        num = str(random.randint(100, 999))

    return f"{prefix}-{short_year}-{num}"