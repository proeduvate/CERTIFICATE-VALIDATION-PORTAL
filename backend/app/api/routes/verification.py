import urllib.parse
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import require_admin
from app.db.session import get_db
from app.models.certificate import Certificate
from app.models.intern import Intern
from app.models.user import User
from app.schemas.verification import (
    VerificationResult,
    VerifyInternRequest,
)

router = APIRouter(tags=["Verification"])


def _document_url(path: str | None) -> str | None:
    if not path:
        return None
    if path.startswith(("http://", "https://", "/")):
        return path
    return f"/{path.lstrip('/')}"


def _intern_doc_url(intern: Intern, kind: str) -> str | None:
    if getattr(intern, f"{kind}_data", None) is not None or getattr(intern, kind, None):
        val = getattr(intern, kind, None)
        if val and val.startswith("/"):
            return val
        return f"/api/v1/interns/{intern.id}/documents/{kind}/download"
    return None


# ---------------------------------------------------------------------------
# Public lookup, keyed on the intern ID printed on the certificate.
# ---------------------------------------------------------------------------


@router.get(
    "/verify/{intern_id:path}",
    response_model=VerificationResult,
    summary="Verify an intern's credentials by intern ID or certificate number (no auth)",
)
def verify_by_intern_id(intern_id: str, db: Session = Depends(get_db)):
    """
    Everything a third party legitimately needs to check a placement:
    who the intern is, what the internship was, the certificate issued for it,
    and the supporting documents.
    """
    raw_ref = intern_id.strip()
    unquoted = urllib.parse.unquote(raw_ref).strip()
    normalized = unquoted.replace("%2F", "/").replace("%2f", "/")

    # Multi-strategy lookup:
    # 1. Search Intern table by intern_id (raw, unquoted, normalized)
    intern = (
        db.query(Intern)
        .filter(
            or_(
                Intern.intern_id.ilike(raw_ref),
                Intern.intern_id.ilike(unquoted),
                Intern.intern_id.ilike(normalized),
            )
        )
        .first()
    )

    # 2. Search Certificate table by certificate_number (raw, unquoted, normalized)
    if not intern:
        cert = (
            db.query(Certificate)
            .filter(
                or_(
                    Certificate.certificate_number.ilike(raw_ref),
                    Certificate.certificate_number.ilike(unquoted),
                    Certificate.certificate_number.ilike(normalized),
                )
            )
            .first()
        )
        if cert and cert.intern:
            intern = cert.intern

    # 3. Search Intern by numeric ID if reference is digits
    if not intern and (raw_ref.isdigit() or unquoted.isdigit()):
        num_id = int(raw_ref) if raw_ref.isdigit() else int(unquoted)
        intern = db.query(Intern).filter(Intern.id == num_id).first()

    if not intern:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No intern record matches that ID",
        )

    verification_status = intern.verification_status or "Pending"

    # Nothing is published until an administrator has signed the record off.
    if verification_status.lower() != "verified":
        return {
            "verified": False,
            "intern_id": intern.intern_id or unquoted,
            "status": verification_status,
        }

    # One certificate per intern; take the most recent if several exist.
    certificate = (
        db.query(Certificate)
        .filter(Certificate.intern_id == intern.id)
        .order_by(Certificate.id.desc())
        .first()
    )

    documents = [
        {"key": "OL", "label": "Offer letter", "url": _intern_doc_url(intern, "offer_letter")},
        {
            "key": "AL",
            "label": "Acknowledgement letter",
            "url": _intern_doc_url(intern, "acknowledgement_letter"),
        },
        {
            "key": "TC",
            "label": "Terms and conditions",
            "url": _intern_doc_url(intern, "terms_conditions"),
        },
        {
            "key": "LOR",
            "label": "Letter of recommendation",
            "url": _intern_doc_url(intern, "lor"),
        },
    ]

    return {
        "verified": True,
        "intern_id": intern.intern_id or unquoted,
        "status": verification_status,
        "intern": {
            "name": intern.name,
            "intern_id": intern.intern_id,
            "department": intern.department,
            "college": intern.college,
            "year": intern.year,
            "location": intern.location,
        },
        "internship": {
            "internship_role": intern.internship_role,
            "domain": intern.domain,
            "mode": intern.mode,
            "organization": intern.organization,
            "mentor": intern.mentor,
            "start_date": intern.start_date,
            "end_date": intern.end_date,
            "duration": intern.duration,
            "status": intern.status,
        },
        "certificate": (
            {
                "certificate_number": certificate.certificate_number,
                "issue_date": certificate.issue_date,
                "url": _document_url(certificate.file_path),
            }
            if certificate
            else None
        ),
        "documents": documents,
        "verification": {
            "status": verification_status,
            "verified_by": intern.verified_by,
            "verification_date": intern.verification_date,
        },
    }


# ---------------------------------------------------------------------------
# Admin sign-off
# ---------------------------------------------------------------------------


@router.post("/interns/{intern_id}/verify", tags=["Intern"])
def verify_intern(
    intern_id: int,
    payload: VerifyInternRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """
    Mark a record verified.
    """
    intern = db.query(Intern).filter(Intern.id == intern_id).first()

    if not intern:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Intern not found",
        )

    if payload.code != settings.VERIFICATION_CODE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="That verification code is not valid",
        )

    intern.verification_status = payload.verification_status
    intern.verified_by = payload.verified_by.strip()
    intern.verification_date = payload.verification_date or date.today()

    if payload.remarks is not None:
        intern.remarks = payload.remarks

    db.commit()
    db.refresh(intern)

    return {
        "message": f"Record marked {intern.verification_status.lower()}",
        "verification_status": intern.verification_status,
        "verified_by": intern.verified_by,
        "verification_date": intern.verification_date,
    }
