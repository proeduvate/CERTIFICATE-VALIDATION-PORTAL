from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.intern import Intern
from app.models.user import User
from app.schemas.lor import LorListItem

router = APIRouter(prefix="/lors", tags=["LOR"])


@router.get("/", response_model=list[LorListItem])
def list_lors(
    q: str = Query("", max_length=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Letters of recommendation, one row per intern that has one.

    Read-only, and derived from `interns.lor` — the letter is uploaded through
    the intern's own document slots, so the intern record is the single source
    of truth for it.

    There used to be a separate `lors` table with its own create/edit/delete
    endpoints. Two writable homes for the same document meant they could
    disagree, and public verification preferred the table, so a stale row there
    silently masked the letter actually uploaded against the intern. Those
    endpoints are gone; the table is left in place (dropping it needs a
    migration and would discard rows) but nothing reads or writes it.
    """
    query = db.query(Intern).filter(
        Intern.lor.isnot(None),
        Intern.lor != "",
    )

    term = q.strip()
    if term:
        pattern = f"%{term}%"
        query = query.filter(
            Intern.name.ilike(pattern)
            | Intern.intern_id.ilike(pattern)
            | Intern.department.ilike(pattern),
        )

    interns = query.order_by(Intern.name.asc()).all()

    return [
        LorListItem(
            intern_id=intern.id,
            intern_name=intern.name,
            intern_code=intern.intern_id,
            department=intern.department,
            college=intern.college,
            internship_role=intern.internship_role,
            mentor=intern.mentor,
            end_date=intern.end_date,
            status=intern.status,
            verification_status=intern.verification_status or "Pending",
            file_path=intern.lor,
        )
        for intern in interns
    ]
