import random
from datetime import datetime


def generate_certificate_number():
    year = datetime.now().year
    random_no = random.randint(1000, 9999)
    return f"CERT-{year}-{random_no}"