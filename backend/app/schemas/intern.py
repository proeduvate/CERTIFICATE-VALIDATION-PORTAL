from datetime import date

from pydantic import BaseModel, EmailStr, Field


class InternBase(BaseModel):
    """
    Every field except the four identity ones is optional.

    `InternCreate` and `InternUpdate` previously required all 38 columns, so
    creating an intern without (say) a GitHub URL or a holiday count returned
    422, and a partial edit was impossible.
    """

    # Required: a record is meaningless without these.
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    department: str = Field(min_length=1, max_length=100)
    college: str = Field(min_length=1, max_length=100)

    # Identity
    intern_id: str | None = None
    internship_role: str | None = None
    referral_person: str | None = None
    dob: date | None = None
    linkedin: str | None = None
    github: str | None = None
    year: str | None = None
    whatsapp_group: str | None = None
    location: str | None = None

    # Internship
    mode: str | None = None
    domain: str | None = None
    mentor: str | None = None
    organization: str | None = "ProEduvate"
    start_date: date | None = None
    end_date: date | None = None
    duration: str | None = None
    status: str | None = "Active"

    # Work
    work_year: str | None = None
    work_domain: str | None = None
    responsibilities: str | None = None
    work_information: str | None = None

    # Attendance
    present_days: int | None = Field(default=0, ge=0)
    absent_days: int | None = Field(default=0, ge=0)
    leave_days: int | None = Field(default=0, ge=0)
    working_days: int | None = Field(default=0, ge=0)
    holidays: int | None = Field(default=0, ge=0)
    attendance_percentage: float | None = Field(default=0, ge=0, le=100)

    # Documents. OL / AL / TC / LOR are the set public verification exposes.
    offer_letter: str | None = None
    acknowledgement_letter: str | None = None
    terms_conditions: str | None = None
    lor: str | None = None
    completion_letter: str | None = None
    certificate: str | None = None
    resume: str | None = None

    # Verification
    verification_status: str | None = "Pending"
    verified_by: str | None = None
    verification_date: date | None = None
    remarks: str | None = None


class InternCreate(InternBase):
    pass


class InternUpdate(BaseModel):
    """All-optional: only the fields sent are changed."""

    name: str | None = Field(default=None, min_length=1, max_length=100)
    email: EmailStr | None = None
    department: str | None = None
    college: str | None = None
    intern_id: str | None = None
    internship_role: str | None = None
    referral_person: str | None = None
    dob: date | None = None
    linkedin: str | None = None
    github: str | None = None
    year: str | None = None
    whatsapp_group: str | None = None
    location: str | None = None
    mode: str | None = None
    domain: str | None = None
    mentor: str | None = None
    organization: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    duration: str | None = None
    status: str | None = None
    work_year: str | None = None
    work_domain: str | None = None
    responsibilities: str | None = None
    work_information: str | None = None
    present_days: int | None = Field(default=None, ge=0)
    absent_days: int | None = Field(default=None, ge=0)
    leave_days: int | None = Field(default=None, ge=0)
    working_days: int | None = Field(default=None, ge=0)
    holidays: int | None = Field(default=None, ge=0)
    attendance_percentage: float | None = Field(default=None, ge=0, le=100)
    offer_letter: str | None = None
    acknowledgement_letter: str | None = None
    terms_conditions: str | None = None
    lor: str | None = None
    completion_letter: str | None = None
    certificate: str | None = None
    resume: str | None = None
    verification_status: str | None = None
    verified_by: str | None = None
    verification_date: date | None = None
    remarks: str | None = None


class InternResponse(InternBase):
    id: int

    model_config = {"from_attributes": True}
