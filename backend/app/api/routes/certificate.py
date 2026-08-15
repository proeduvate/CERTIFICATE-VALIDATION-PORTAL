import os
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import get_current_user, require_admin
from app.db.session import get_db
from app.models.certificate import Certificate
from app.models.user import User
from app.schemas.certificate import (
    CertificateCreate,
    CertificateResponse,
    CertificateUpdate,
    PublicCertificateResponse,
)
from app.utils.certificate_generator import generate_certificate_number
from app.utils.pdf_generator import generate_certificate_pdf

router = APIRouter(prefix="/certificates", tags=["Certificates"])

ALLOWED_UPLOAD_TYPES = {
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/webp",
}
MAX_UPLOAD_BYTES = 10 * 1024 * 1024


def _get_or_404(db: Session, certificate_id: int) -> Certificate:
    certificate = (
        db.query(Certificate).filter(Certificate.id == certificate_id).first()
    )

    if not certificate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found",
        )

    return certificate


# ---------------------------------------------------------------------------
# Public verification
#
# This is the portal's entire purpose, yet lookup used to sit behind
# `get_current_user`, so an anonymous visitor pasting a reference got a 401.
# Declared before /{certificate_id} so "verify" is never parsed as an id.
# ---------------------------------------------------------------------------


@router.get(
    "/verify/{certificate_number}",
    response_model=PublicCertificateResponse,
    summary="Verify a certificate by its printed reference (no auth)",
)
def verify_certificate(certificate_number: str, db: Session = Depends(get_db)):
    certificate = (
        db.query(Certificate)
        .filter(Certificate.certificate_number == certificate_number.strip())
        .first()
    )

    if not certificate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No certificate matches that reference",
        )

    intern = certificate.intern

    return PublicCertificateResponse(
        certificate_number=certificate.certificate_number,
        issue_date=certificate.issue_date,
        intern_name=intern.name if intern else None,
        internship_role=intern.internship_role if intern else None,
        organization=intern.organization if intern else None,
        department=intern.department if intern else None,
        college=intern.college if intern else None,
        start_date=intern.start_date if intern else None,
        end_date=intern.end_date if intern else None,
        duration=intern.duration if intern else None,
        file_path=certificate.file_path,
    )


# ---------------------------------------------------------------------------
# Authenticated management
# ---------------------------------------------------------------------------


@router.get("/", response_model=list[CertificateResponse])
def get_certificates(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Certificate).order_by(Certificate.id.desc()).all()


@router.post(
    "/",
    response_model=CertificateResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_certificate(
    certificate: CertificateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    data = certificate.model_dump()
    data.pop("certificate_number", None)

    new_certificate = Certificate(**data)

    # Retry on the (unlikely) chance the random reference already exists.
    for _ in range(5):
        candidate = generate_certificate_number()
        clash = (
            db.query(Certificate)
            .filter(Certificate.certificate_number == candidate)
            .first()
        )
        if not clash:
            new_certificate.certificate_number = candidate
            break
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not allocate a certificate number, please retry",
        )

    db.add(new_certificate)
    db.commit()
    db.refresh(new_certificate)

    return new_certificate


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
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found",
        )

    return certificate


@router.get("/{certificate_id}", response_model=CertificateResponse)
def get_certificate_by_id(
    certificate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return _get_or_404(db, certificate_id)


@router.put("/{certificate_id}", response_model=CertificateResponse)
def update_certificate(
    certificate_id: int,
    certificate_data: CertificateUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    certificate = _get_or_404(db, certificate_id)

    # exclude_unset so omitting a field leaves it alone instead of nulling it.
    for key, value in certificate_data.model_dump(exclude_unset=True).items():
        setattr(certificate, key, value)

    db.commit()
    db.refresh(certificate)

    return certificate


@router.delete("/{certificate_id}")
def delete_certificate(
    certificate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    certificate = _get_or_404(db, certificate_id)

    db.delete(certificate)
    db.commit()

    return {"message": "Certificate deleted successfully"}


@router.post("/{certificate_id}/upload")
def upload_certificate(
    certificate_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    certificate = _get_or_404(db, certificate_id)

    if file.content_type not in ALLOWED_UPLOAD_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Upload a PDF or an image (PNG, JPEG or WebP)",
        )

    contents = file.file.read()

    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File must be 10 MB or smaller",
        )

    upload_dir = os.path.join(settings.UPLOAD_DIR, "certificates")
    os.makedirs(upload_dir, exist_ok=True)

    # Never trust the client filename: it can contain path separators, and two
    # uploads sharing a name would overwrite each other.
    suffix = os.path.splitext(file.filename or "")[1][:10]
    stored_name = f"{certificate.certificate_number}-{uuid.uuid4().hex[:8]}{suffix}"
    file_path = os.path.join(upload_dir, stored_name)

    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    certificate.file_path = file_path.replace(os.sep, "/")
    db.commit()

    return {
        "message": "Certificate uploaded successfully",
        "file_path": certificate.file_path,
    }


@router.get("/{certificate_id}/download")
def download_certificate(
    certificate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    certificate = _get_or_404(db, certificate_id)

    # Prefer the uploaded document; fall back to a generated PDF.
    if certificate.file_path and os.path.exists(certificate.file_path):
        return FileResponse(
            path=certificate.file_path,
            filename=os.path.basename(certificate.file_path),
        )

    generated_dir = os.path.join(settings.UPLOAD_DIR, "generated")
    os.makedirs(generated_dir, exist_ok=True)

    filename = f"{certificate.certificate_number}.pdf"
    path = os.path.join(generated_dir, filename)

    generate_certificate_pdf(
        intern_name=(
            certificate.intern.name if certificate.intern else "Certificate holder"
        ),
        certificate_number=certificate.certificate_number,
        filename=path,
    )

    return FileResponse(
        path=path,
        media_type="application/pdf",
        filename=filename,
    )
