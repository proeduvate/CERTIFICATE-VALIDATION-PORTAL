from datetime import date

from pydantic import BaseModel


class CertificateBase(BaseModel):
    intern_id: int
    issue_date: date
    file_path: str | None = None
    qr_code: str | None = None


class CertificateCreate(CertificateBase):
    # The server assigns the reference via generate_certificate_number(), so
    # anything sent here is ignored. Optional to avoid demanding a value the
    # caller cannot control.
    certificate_number: str | None = None


class CertificateUpdate(BaseModel):
    intern_id: int | None = None
    issue_date: date | None = None
    file_path: str | None = None
    qr_code: str | None = None


class CertificateResponse(CertificateBase):
    id: int
    certificate_number: str

    model_config = {"from_attributes": True}


class CertificateListItem(CertificateResponse):
    """
    List row.

    Carries the intern's name and printed ID so the certificates table can
    identify who a certificate belongs to. Without these the list showed only
    a numeric foreign key.
    """

    intern_name: str | None = None
    intern_code: str | None = None


class PublicCertificateResponse(BaseModel):
    """
    What an anonymous verifier is allowed to see.

    Deliberately narrow: it confirms the certificate was issued and describes
    the internship it covers, without exposing the intern's contact details,
    attendance record or documents.
    """

    certificate_number: str
    issue_date: date | None = None
    intern_name: str | None = None
    internship_role: str | None = None
    organization: str | None = None
    department: str | None = None
    college: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    duration: str | None = None
    file_path: str | None = None
