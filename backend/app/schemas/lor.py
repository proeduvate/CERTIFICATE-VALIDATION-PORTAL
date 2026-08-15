from datetime import date

from pydantic import BaseModel


class LORBase(BaseModel):
    intern_id: int
    issue_date: date | None = None
    issued_by: str | None = None
    status: str | None = "Issued"
    file_path: str | None = None


class LORCreate(LORBase):
    pass


class LORUpdate(BaseModel):
    """All-optional so a partial edit does not blank the other columns."""

    intern_id: int | None = None
    issue_date: date | None = None
    issued_by: str | None = None
    status: str | None = None
    file_path: str | None = None


class LORResponse(LORBase):
    id: int

    model_config = {"from_attributes": True}
