from collections import Counter

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import require_admin
from app.db.session import get_db
from app.models.certificate import Certificate
from app.models.intern import Intern
from app.models.lor import LOR
from app.models.user import User

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """
    Programme totals.

    `certificates_issued`, `monthly_intern_count`, `attendance_distribution`,
    `internship_mode_distribution` and `latest_verifications` were previously
    hardcoded to 0 / empty, so anything rendering them showed nothing. They are
    computed from the data now.
    """
    interns = db.query(Intern).all()

    def count_status(value: str) -> int:
        return sum(1 for i in interns if (i.status or "") == value)

    # Interns joining per calendar month of the current programme data.
    monthly = Counter(
        intern.start_date.strftime("%Y-%m")
        for intern in interns
        if intern.start_date
    )

    modes = Counter(
        (intern.mode or "unspecified").strip().lower() for intern in interns
    )

    departments = Counter(
        intern.department.strip()
        for intern in interns
        if intern.department and intern.department.strip()
    )

    attendance = {
        "present": sum(intern.present_days or 0 for intern in interns),
        "absent": sum(intern.absent_days or 0 for intern in interns),
        "leave": sum(intern.leave_days or 0 for intern in interns),
    }

    tracked = [
        intern.attendance_percentage
        for intern in interns
        if intern.attendance_percentage is not None
        and (intern.working_days or 0) > 0
    ]

    latest_certificates = (
        db.query(Certificate).order_by(Certificate.id.desc()).limit(5).all()
    )

    return {
        "total_interns": len(interns),
        "active_interns": count_status("Active"),
        "inactive_interns": count_status("Inactive"),
        "completed_interns": count_status("Completed"),
        "pending_verification": sum(
            1 for i in interns if (i.verification_status or "") == "Pending"
        ),
        "certificates_issued": db.query(Certificate).count(),
        "lors_issued": db.query(LOR).count(),
        "average_attendance": (
            round(sum(tracked) / len(tracked), 1) if tracked else 0
        ),
        "monthly_intern_count": [
            {"month": month, "count": count}
            for month, count in sorted(monthly.items())
        ],
        "attendance_distribution": attendance,
        "internship_mode_distribution": dict(modes),
        "department_distribution": [
            {"department": name, "count": count}
            for name, count in departments.most_common()
        ],
        "latest_verifications": [
            {
                "certificate_number": certificate.certificate_number,
                "issue_date": certificate.issue_date,
                "intern_name": (
                    certificate.intern.name if certificate.intern else None
                ),
            }
            for certificate in latest_certificates
        ],
    }
