from pydantic import BaseModel


class DocumentBase(BaseModel):
    intern_id: int
    appointment_letter: str | None = None
    offer_letter: str | None = None
    transfer_certificate: str | None = None
    other_document: str | None = None


class DocumentCreate(DocumentBase):
    pass


class DocumentUpdate(DocumentBase):
    pass


class DocumentResponse(DocumentBase):
    id: int

    class Config:
        from_attributes = True