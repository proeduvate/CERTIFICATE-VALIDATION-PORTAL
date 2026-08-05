from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
from fastapi import UploadFile, File
import os

from app.db.session import get_db
from app.models.certificate import Certificate
from app.schemas.certificate import (
    CertificateCreate,
    CertificateUpdate,
    CertificateResponse,
)
from app.utils.certificate_generator import generate_certificate_number
from app.utils.pdf_generator import generate_certificate_pdf
from app.core.security import (
    get_current_user,
    require_admin,
)
from app.models.user import User

router = APIRouter(
    prefix="/certificates",
    tags=["Certificates"],
)


@router.post("/", response_model=CertificateResponse)
def create_certificate(
    certificate: CertificateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    new_certificate = Certificate(**certificate.model_dump())

    # Generate a unique certificate number
    new_certificate.certificate_number = generate_certificate_number()

    db.add(new_certificate)
    db.commit()
    db.refresh(new_certificate)

    return new_certificate

@router.post("/{certificate_id}/upload")
def upload_certificate(
    certificate_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    certificate = (
        db.query(Certificate)
        .filter(Certificate.id == certificate_id)
        .first()
    )

    if not certificate:
        raise HTTPException(
            status_code=404,
            detail="Certificate not found",
        )

    upload_dir = "uploads/certificates"
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    certificate.file_path = file_path

    db.commit()

    return {
        "message": "Certificate uploaded successfully",
        "file_path": file_path,
    }

@router.get("/number/{certificate_number}", response_model=CertificateResponse)
def get_certificate_by_number(
    certificate_number: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    certificate = (
        db.query(Certificate)
        .filter(Certificate.certificate_number == certificate_number)
        .first()
    )

    if not certificate:
        raise HTTPException(
            status_code=404,
            detail="Certificate not found",
        )

    return certificate

@router.get("/", response_model=list[CertificateResponse])
def get_certificates(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    certificates = db.query(Certificate).all()
    return certificates

@router.get("/{certificate_id}") 
def get_certificate_by_id(
    certificate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    certificate = (
        db.query(Certificate)
        .filter(Certificate.id == certificate_id)
        .first()
    )

    if not certificate:
        raise HTTPException(
            status_code=404,
            detail="Certificate not found",
        )

    return {
    "certificate_image_url": certificate.file_path,
    "verification_metadata": {
        "status": "Verified",
        "verified_by": "Admin",
        "verification_date": certificate.issue_date,
        "reference_id": certificate.certificate_number,
    },
    "certificate_details": {
        "certificate_id": certificate.certificate_number,
        "intern_name": certificate.intern.name,
        "internship_role": (
            certificate.intern.internship_role
            if certificate.intern
            else None
        ),
        "issue_date": certificate.issue_date,
        "status": "Issued",
    },
    "download_certificate_url": (
        f"/certificates/{certificate.id}/download"
    ),
    "qr_code_url": (
        f"/certificates/{certificate.id}/qrcode"
    ),
}


@router.put("/{certificate_id}", response_model=CertificateResponse)
def update_certificate(
    certificate_id: int,
    certificate_data: CertificateUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    certificate = (
        db.query(Certificate)
        .filter(Certificate.id == certificate_id)
        .first()
    )

    if not certificate:
        raise HTTPException(
            status_code=404,
            detail="Certificate not found",
        )

    for key, value in certificate_data.model_dump().items():
        setattr(certificate, key, value)

    db.commit()
    db.refresh(certificate)

    return certificate


@router.delete("/{certificate_id}")
def delete_certificate(
    certificate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    certificate = (
        db.query(Certificate)
        .filter(Certificate.id == certificate_id)
        .first()
    )

    if not certificate:
        raise HTTPException(
            status_code=404,
            detail="Certificate not found",
        )

    db.delete(certificate)
    db.commit()

    return {"message": "Certificate deleted successfully"}

@router.get("/verify/{certificate_number}")
def verify_certificate(
    certificate_number: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    certificate = (
        db.query(Certificate)
        .filter(Certificate.certificate_number == certificate_number)
        .first()
    )

    if not certificate:
        raise HTTPException(
            status_code=404,
            detail="Certificate not found",
        )

    return {
        "valid": True,
        "certificate": certificate,
    }

@router.get("/{certificate_id}/download")
def download_certificate(
    certificate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    certificate = (
        db.query(Certificate)
        .filter(Certificate.id == certificate_id)
        .first()
    )

    if not certificate:
        raise HTTPException(
            status_code=404,
            detail="Certificate not found",
        )

    filename = f"{certificate.certificate_number}.pdf"

    generate_certificate_pdf(
        intern_name=certificate.intern.name,
        certificate_number=certificate.certificate_number,
        filename=filename,
    )

    return FileResponse(
        path=filename,
        media_type="application/pdf",
        filename=filename,
    )