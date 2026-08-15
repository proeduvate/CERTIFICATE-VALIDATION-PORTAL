from pydantic import BaseModel


class DocumentBase(BaseModel):
    intern_id: int
    appointment_letter: str | None = None
    offer_letter: str | None = None
    transfer_certificate: str | None = None
    other_document: str | None = None


class DocumentCreate(DocumentBase):
    pass


class DocumentUpdate(BaseModel):
    """All-optional so a partial edit does not blank the other columns."""

    intern_id: int | None = None
    appointment_letter: str | None = None
    offer_letter: str | None = None
    transfer_certificate: str | None = None
    other_document: str | None = None


class DocumentResponse(DocumentBase):
    id: int

    model_config = {"from_attributes": True}
