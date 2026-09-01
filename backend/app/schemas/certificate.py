from datetime import date

from pydantic import BaseModel


class CertificateBase(BaseModel):
    intern_id: int
    issue_date: date
    file_path: str | None = None
    qr_code: str | None = None
    is_frozen: bool = False


class CertificateCreate(CertificateBase):
    certificate_number: str | None = None


class CertificateUpdate(BaseModel):
    intern_id: int | None = None
    issue_date: date | None = None
    file_path: str | None = None
    qr_code: str | None = None
    is_frozen: bool | None = None


class CertificateResponse(CertificateBase):
    id: int
    certificate_number: str

    model_config = {"from_attributes": True}


class CertificateListItem(CertificateResponse):
    intern_name: str | None = None
    intern_code: str | None = None
    verification_status: str | None = None
    internship_status: str | None = None


class PublicCertificateResponse(BaseModel):
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
    is_frozen: bool = False
