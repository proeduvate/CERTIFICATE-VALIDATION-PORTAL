from datetime import date
from pydantic import BaseModel


class CertificateBase(BaseModel):
    intern_id: int
    certificate_number: str
    issue_date: date
    file_path: str | None = None
    qr_code: str | None = None


class CertificateCreate(CertificateBase):
    pass


class CertificateUpdate(CertificateBase):
    pass


class CertificateResponse(CertificateBase):
    id: int

    class Config:
        from_attributes = True