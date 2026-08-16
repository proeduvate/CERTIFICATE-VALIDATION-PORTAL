from datetime import date

from pydantic import BaseModel


class LorListItem(BaseModel):
    """
    One intern's letter of recommendation.

    Keyed on the intern rather than on a letter record: the letter is uploaded
    through the intern's document slots, so there is no separate entity to
    identify.
    """

    intern_id: int
    intern_name: str | None = None
    intern_code: str | None = None
    department: str | None = None
    college: str | None = None
    internship_role: str | None = None
    mentor: str | None = None
    end_date: date | None = None
    status: str | None = None
    verification_status: str | None = None
    file_path: str | None = None
