from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user, require_admin
from app.db.session import get_db
from app.models.document import Document
from app.models.user import User
from app.schemas.document import (
    DocumentCreate,
    DocumentResponse,
    DocumentUpdate,
)

router = APIRouter(prefix="/documents", tags=["Documents"])


def _get_or_404(db: Session, document_id: int) -> Document:
    document = db.query(Document).filter(Document.id == document_id).first()

    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )

    return document


@router.get("/", response_model=list[DocumentResponse])
def get_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Document).order_by(Document.id.desc()).all()


@router.post(
    "/",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_document(
    document: DocumentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    new_document = Document(**document.model_dump())

    db.add(new_document)
    db.commit()
    db.refresh(new_document)

    return new_document


# Declared above /{document_id} so "intern" is never parsed as an id.
@router.get("/intern/{intern_id}")
def get_intern_documents(
    intern_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document = (
        db.query(Document).filter(Document.intern_id == intern_id).first()
    )

    # An intern with no paperwork yet is a normal state, not an error. This
    # used to 404, which the UI had to special-case as "no documents".
    if not document:
        return {
            "intern_id": intern_id,
            "appointment_letter_url": None,
            "offer_letter_url": None,
            "transfer_certificate_url": None,
            "others": [],
        }

    return {
        "intern_id": intern_id,
        "appointment_letter_url": document.appointment_letter,
        "offer_letter_url": document.offer_letter,
        "transfer_certificate_url": document.transfer_certificate,
        "others": [document.other_document] if document.other_document else [],
    }


@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return _get_or_404(db, document_id)


@router.put("/{document_id}", response_model=DocumentResponse)
def update_document(
    document_id: int,
    document_data: DocumentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    document = _get_or_404(db, document_id)

    for key, value in document_data.model_dump(exclude_unset=True).items():
        setattr(document, key, value)

    db.commit()
    db.refresh(document)

    return document


@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    document = _get_or_404(db, document_id)

    db.delete(document)
    db.commit()

    return {"message": "Document deleted successfully"}
