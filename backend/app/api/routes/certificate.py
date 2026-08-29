import os

from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import get_current_user, require_admin
from app.db.session import get_db
from app.models.certificate import Certificate
from app.models.user import User
from app.schemas.certificate import (
    CertificateCreate,
    CertificateListItem,
    CertificateResponse,
    CertificateUpdate,
    PublicCertificateResponse,
)
from app.utils.certificate_generator import generate_certificate_number
from app.utils.pdf_generator import generate_certificate_pdf
from app.utils.uploads import delete_upload, save_upload

router = APIRouter(prefix="/certificates", tags=["Certificates"])

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

    # The same rule as /verify/{intern_id}: nothing is published until an
    # administrator has signed the record off. Without this, an unverified
    # intern's details were still reachable through the certificate number,
    # which is a second door onto the data the other route now withholds.
    verified = (
        intern is not None
        and (intern.verification_status or "").lower() == "verified"
    )

    if not verified:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No verified certificate matches that reference",
        )

    return PublicCertificateResponse(
        certificate_number=certificate.certificate_number,
        issue_date=certificate.issue_date,
        intern_name=intern.name,
        internship_role=intern.internship_role,
        organization=intern.organization,
        department=intern.department,
        college=intern.college,
        start_date=intern.start_date,
        end_date=intern.end_date,
        duration=intern.duration,
        file_path=certificate.file_path,
    )


# ---------------------------------------------------------------------------
# Authenticated management
# ---------------------------------------------------------------------------


@router.get("/", response_model=list[CertificateListItem])
def get_certificates(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    certificates = db.query(Certificate).order_by(Certificate.id.desc()).all()

    # Join through the relationship so the table can show who each certificate
    # belongs to rather than a bare intern_id.
    return [
        CertificateListItem(
            id=certificate.id,
            intern_id=certificate.intern_id,
            certificate_number=certificate.certificate_number,
            issue_date=certificate.issue_date,
            file_path=certificate.file_path,
            qr_code=certificate.qr_code,
            intern_name=certificate.intern.name if certificate.intern else None,
            intern_code=(
                certificate.intern.intern_id if certificate.intern else None
            ),
        )
        for certificate in certificates
    ]


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

    contents, content_type, name = save_upload(
        file,
        folder="certificates",
        stem=certificate.certificate_number,
    )

    certificate.file_data = contents
    certificate.file_mime_type = content_type
    certificate.file_name = name
    certificate.file_path = f"/api/v1/certificates/{certificate.id}/download"
    db.commit()

    return {
        "message": "Certificate uploaded successfully",
        "file_path": certificate.file_path,
        "url": certificate.file_path,
    }


@router.get("/{certificate_id}/download")
def download_certificate(
    certificate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    certificate = _get_or_404(db, certificate_id)

    # Prefer stored binary data; fall back to an in-memory generated PDF.
    if certificate.file_data:
        filename = certificate.file_name or f"{certificate.certificate_number}.pdf"
        mime_type = certificate.file_mime_type or "application/pdf"
        return Response(
            content=bytes(certificate.file_data),
            media_type=mime_type,
            headers={"Content-Disposition": f'inline; filename="{filename}"'},
        )

    pdf_bytes = generate_certificate_pdf(
        intern_name=(
            certificate.intern.name if certificate.intern else "Certificate holder"
        ),
        certificate_number=certificate.certificate_number,
    )

    certificate.file_data = pdf_bytes
    certificate.file_mime_type = "application/pdf"
    certificate.file_name = f"{certificate.certificate_number}.pdf"
    certificate.file_path = f"/api/v1/certificates/{certificate.id}/download"
    db.commit()

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'inline; filename="{certificate.certificate_number}.pdf"'},
    )

