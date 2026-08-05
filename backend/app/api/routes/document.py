from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
from app.models.document import Document
import os

from app.core.security import (
    get_current_user,
    require_admin,
)
from app.models.user import User
from app.db.session import get_db
from app.schemas.document import (
    DocumentCreate,
    DocumentUpdate,
    DocumentResponse,
)

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


@router.post("/", response_model=DocumentResponse)
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


@router.get("/", response_model=list[DocumentResponse])
def get_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Document).all()

@router.get("/intern/{intern_id}")
def get_intern_documents(
    intern_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document = (
        db.query(Document)
        .filter(Document.intern_id == intern_id)
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Documents not found",
        )

    return {
        "appointment_letter_url": document.appointment_letter,
        "offer_letter_url": document.offer_letter,
        "transfer_certificate_url": document.transfer_certificate,
        "others": (
            [document.other_document]
            if document.other_document
            else []
        ),
    }


@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document = (
        db.query(Document)
        .filter(Document.id == document_id)
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    return document


@router.put("/{document_id}", response_model=DocumentResponse)
def update_document(
    document_id: int,
    document_data: DocumentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    document = (
        db.query(Document)
        .filter(Document.id == document_id)
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    for key, value in document_data.model_dump().items():
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
    document = (
        db.query(Document)
        .filter(Document.id == document_id)
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    db.delete(document)
    db.commit()

    return {
        "message": "Document deleted successfully",
    }


@router.get("/{document_id}/download")
def download_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document = db.query(Document).filter(Document.id == document_id).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    return FileResponse(
        path=document.file_path,
        filename=os.path.basename(document.file_path),
)