import random
from datetime import datetime


def generate_certificate_number(db=None, year=None, sequence_id=None):
    """
    Format: PRO-INT-26-114
    PRO-INT is constant, 26 denotes 2-digit year, and 114 is the numeric auto-increment.
    """
    current_year = year or datetime.now().year
    short_year = str(current_year)[-2:]

    if sequence_id is not None:
        num = str(sequence_id)
    else:
        num = str(random.randint(100, 999))

    return f"PRO-INT-{short_year}-{num}"