from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import require_admin
from app.db.session import get_db
from app.models.certificate import Certificate
from app.models.intern import Intern
from app.models.lor import LOR
from app.models.user import User
from app.schemas.verification import (
    VerificationResult,
    VerifyInternRequest,
)

router = APIRouter(tags=["Verification"])


def _document_url(path: str | None) -> str | None:
    """Uploaded paths are served from the static /uploads mount."""
    if not path:
        return None
    if path.startswith(("http://", "https://", "/")):
        return path
    return f"/{path.lstrip('/')}"


# ---------------------------------------------------------------------------
# Public lookup, keyed on the intern ID printed on the certificate.
# ---------------------------------------------------------------------------


@router.get(
    "/verify/{intern_id}",
    response_model=VerificationResult,
    summary="Verify an intern's credentials by intern ID (no auth)",
)
def verify_by_intern_id(intern_id: str, db: Session = Depends(get_db)):
    """
    Everything a third party legitimately needs to check a placement:
    who the intern is, what the internship was, the certificate issued for it,
    and the supporting documents.

    Deliberately withheld: email, date of birth, attendance figures and
    internal remarks. Those are not needed to confirm a credential and this
    endpoint is unauthenticated.
    """
    reference = intern_id.strip()

    intern = (
        db.query(Intern)
        .filter(Intern.intern_id.ilike(reference))
        .first()
    )

    if not intern:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No intern record matches that ID",
        )

    verification_status = intern.verification_status or "Pending"

    # Nothing is published until an administrator has signed the record off.
    # Returning the details beforehand would have the portal vouching for a
    # placement nobody has checked — the opposite of what it is for. The
    # existence of the reference is still acknowledged, because "we hold this
    # record but have not verified it" is a true and useful answer, and the ID
    # is printed on the document the visitor is already holding.
    if verification_status.lower() != "verified":
        return {
            "verified": False,
            "intern_id": intern.intern_id or reference,
            "status": verification_status,
        }

    # One certificate per intern; take the most recent if several exist.
    certificate = (
        db.query(Certificate)
        .filter(Certificate.intern_id == intern.id)
        .order_by(Certificate.id.desc())
        .first()
    )

    # A letter row supersedes the plain path on the intern record.
    lor_row = (
        db.query(LOR)
        .filter(LOR.intern_id == intern.id)
        .order_by(LOR.id.desc())
        .first()
    )
    lor_path = (lor_row.file_path if lor_row else None) or intern.lor

    documents = [
        {"key": "OL", "label": "Offer letter", "url": _document_url(intern.offer_letter)},
        {
            "key": "AL",
            "label": "Acknowledgement letter",
            "url": _document_url(intern.acknowledgement_letter),
        },
        {
            "key": "TC",
            "label": "Terms and conditions",
            "url": _document_url(intern.terms_conditions),
        },
        {
            "key": "LOR",
            "label": "Letter of recommendation",
            "url": _document_url(lor_path),
        },
    ]

    return {
        "verified": True,
        "intern_id": intern.intern_id or reference,
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

    Separate from the edit endpoint on purpose: verification is a sign-off, not
    another field. It needs a shared code on top of the admin session, so only
    the admins entrusted with that code can approve a record even though every
    admin can edit one.
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
