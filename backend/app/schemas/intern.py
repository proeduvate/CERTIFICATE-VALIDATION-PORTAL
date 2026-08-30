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
    intern_id: str | None = Field(default=None, max_length=100)
    internship_role: str | None = Field(default=None, max_length=100)
    referral_person: str | None = Field(default=None, max_length=100)
    dob: date | None = None
    linkedin: str | None = Field(default=None, max_length=255)
    github: str | None = Field(default=None, max_length=255)
    year: str | None = Field(default=None, max_length=100)
    whatsapp_group: str | None = Field(default=None, max_length=100)
    location: str | None = Field(default=None, max_length=100)

    # Internship
    mode: str | None = Field(default=None, max_length=100)
    domain: str | None = Field(default=None, max_length=100)
    mentor: str | None = Field(default=None, max_length=100)
    organization: str | None = Field(default="ProEduvate", max_length=100)
    start_date: date | None = None
    end_date: date | None = None
    duration: str | None = Field(default=None, max_length=100)
    status: str | None = Field(default="Active", max_length=100)

    # Work
    work_year: str | None = Field(default=None, max_length=100)
    work_domain: str | None = Field(default=None, max_length=100)
    responsibilities: str | None = Field(default=None, max_length=500)
    work_information: str | None = Field(default=None, max_length=1000)

    # Attendance
    present_days: int | None = Field(default=0, ge=0)
    absent_days: int | None = Field(default=0, ge=0)
    leave_days: int | None = Field(default=0, ge=0)
    working_days: int | None = Field(default=0, ge=0)
    holidays: int | None = Field(default=0, ge=0)
    attendance_percentage: float | None = Field(default=0, ge=0, le=100)

    # Documents. OL / AL / TC / LOR are the set public verification exposes.
    offer_letter: str | None = Field(default=None, max_length=255)
    acknowledgement_letter: str | None = Field(default=None, max_length=255)
    terms_conditions: str | None = Field(default=None, max_length=255)
    lor: str | None = Field(default=None, max_length=255)
    completion_letter: str | None = Field(default=None, max_length=255)
    certificate: str | None = Field(default=None, max_length=255)
    resume: str | None = Field(default=None, max_length=255)

    # Verification
    verification_status: str | None = Field(default="Pending", max_length=100)
    verified_by: str | None = Field(default=None, max_length=100)
    verification_date: date | None = None
    remarks: str | None = Field(default=None, max_length=500)


class InternCreate(InternBase):
    pass


class InternUpdate(BaseModel):
    """All-optional: only the fields sent are changed."""

    name: str | None = Field(default=None, min_length=1, max_length=100)
    email: EmailStr | None = None
    department: str | None = Field(default=None, max_length=100)
    college: str | None = Field(default=None, max_length=100)
    intern_id: str | None = Field(default=None, max_length=100)
    internship_role: str | None = Field(default=None, max_length=100)
    referral_person: str | None = Field(default=None, max_length=100)
    dob: date | None = None
    linkedin: str | None = Field(default=None, max_length=255)
    github: str | None = Field(default=None, max_length=255)
    year: str | None = Field(default=None, max_length=100)
    whatsapp_group: str | None = Field(default=None, max_length=100)
    location: str | None = Field(default=None, max_length=100)
    mode: str | None = Field(default=None, max_length=100)
    domain: str | None = Field(default=None, max_length=100)
    mentor: str | None = Field(default=None, max_length=100)
    organization: str | None = Field(default=None, max_length=100)
    start_date: date | None = None
    end_date: date | None = None
    duration: str | None = Field(default=None, max_length=100)
    status: str | None = Field(default=None, max_length=100)
    work_year: str | None = Field(default=None, max_length=100)
    work_domain: str | None = Field(default=None, max_length=100)
    responsibilities: str | None = Field(default=None, max_length=500)
    work_information: str | None = Field(default=None, max_length=1000)
    present_days: int | None = Field(default=None, ge=0)
    absent_days: int | None = Field(default=None, ge=0)
    leave_days: int | None = Field(default=None, ge=0)
    working_days: int | None = Field(default=None, ge=0)
    holidays: int | None = Field(default=None, ge=0)
    attendance_percentage: float | None = Field(default=None, ge=0, le=100)
    offer_letter: str | None = Field(default=None, max_length=255)
    acknowledgement_letter: str | None = Field(default=None, max_length=255)
    terms_conditions: str | None = Field(default=None, max_length=255)
    lor: str | None = Field(default=None, max_length=255)
    completion_letter: str | None = Field(default=None, max_length=255)
    certificate: str | None = Field(default=None, max_length=255)
    resume: str | None = Field(default=None, max_length=255)
    verification_status: str | None = Field(default=None, max_length=100)
    verified_by: str | None = Field(default=None, max_length=100)
    verification_date: date | None = None
    remarks: str | None = Field(default=None, max_length=500)


class InternResponse(InternBase):
    id: int

    model_config = {"from_attributes": True}
