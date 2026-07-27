from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.intern import Intern

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def dashboard_summary(db: Session = Depends(get_db)):

    total_interns = db.query(Intern).count()

    active_interns = db.query(Intern).filter(Intern.status == "Active").count()

    completed_interns = db.query(Intern).filter(Intern.status == "Completed").count()

    pending_verification = (
        db.query(Intern).filter(Intern.verification_status == "Pending").count()
    )

    return {
        "total_interns": total_interns,
        "active_interns": active_interns,
        "completed_interns": completed_interns,
        "pending_verification": pending_verification,
    }
