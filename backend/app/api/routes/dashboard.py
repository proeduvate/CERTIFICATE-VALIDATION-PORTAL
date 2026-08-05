from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.intern import Intern
from app.core.security import (
    get_current_user,
    require_admin,
)
from app.models.user import User

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):

    total_interns = db.query(Intern).count()

    active_interns = (
        db.query(Intern)
        .filter(Intern.status == "Active")
        .count()
    )

    inactive_interns = (
    db.query(Intern)
    .filter(Intern.status == "Inactive")
    .count()
    )

    completed_interns = (
        db.query(Intern)
        .filter(Intern.status == "Completed")
        .count()
    )

    pending_verification = (
        db.query(Intern)
        .filter(Intern.verification_status == "Pending")
        .count()
    )

    return {
    "total_interns": total_interns,
    "active_interns": active_interns,
    "inactive_interns": inactive_interns,
    "completed_interns": completed_interns,
    "pending_verification": pending_verification,
    "certificates_issued": 0,
    "monthly_intern_count": [],
    "attendance_distribution": {
        "present": 0,
        "absent": 0,
        "leave": 0,
    },
    "internship_mode_distribution": {
        "online": 0,
        "offline": 0,
        "hybrid": 0,
    },
    "recent_activities": [],
    "latest_verifications": [],
}
