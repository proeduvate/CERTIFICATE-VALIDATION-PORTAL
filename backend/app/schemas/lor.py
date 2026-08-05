from datetime import date
from pydantic import BaseModel


class LORBase(BaseModel):
    intern_id: int
    issue_date: date
    issued_by: str
    status: str
    file_path: str | None = None


class LORCreate(LORBase):
    pass


class LORUpdate(LORBase):
    pass


class LORResponse(LORBase):
    id: int

    class Config:
        from_attributes = True