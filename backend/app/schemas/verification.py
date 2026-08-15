from datetime import date

from pydantic import BaseModel, Field


class PublicIntern(BaseModel):
    """Identity fields safe to show an anonymous verifier."""

    name: str | None = None
    intern_id: str | None = None
    department: str | None = None
    college: str | None = None
    year: str | None = None
    location: str | None = None


class PublicInternship(BaseModel):
    internship_role: str | None = None
    domain: str | None = None
    mode: str | None = None
    organization: str | None = None
    mentor: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    duration: str | None = None
    status: str | None = None


class PublicCertificate(BaseModel):
    certificate_number: str
    issue_date: date | None = None
    url: str | None = None


class PublicDocument(BaseModel):
    key: str
    label: str
    url: str | None = None


class PublicVerification(BaseModel):
    status: str
    verified_by: str | None = None
    verification_date: date | None = None


class VerificationResult(BaseModel):
    intern: PublicIntern
    internship: PublicInternship
    certificate: PublicCertificate | None = None
    documents: list[PublicDocument]
    verification: PublicVerification


class VerifyInternRequest(BaseModel):
    """
    Sign-off payload.

    The code is a shared secret checked against VERIFICATION_CODE, so holding
    an admin session alone does not let someone mark a record verified.
    """

    code: str = Field(min_length=1)
    verified_by: str = Field(min_length=1, max_length=100)
    verification_status: str = "Verified"
    verification_date: date | None = None
    remarks: str | None = Field(default=None, max_length=500)
