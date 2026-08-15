import os
import tempfile

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import FileResponse
from openpyxl import Workbook
from sqlalchemy.orm import Session

from app.core.security import get_current_user, require_admin
from app.db.session import get_db
from app.models.intern import Intern
from app.models.user import User
from app.schemas.intern import InternCreate, InternResponse, InternUpdate

router = APIRouter(prefix="/interns", tags=["Intern"])


def _get_or_404(db: Session, intern_id: int) -> Intern:
    intern = db.query(Intern).filter(Intern.id == intern_id).first()

    if not intern:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Intern not found",
        )

    return intern


def _recalculate_attendance(intern: Intern) -> None:
    """Keep the stored percentage consistent with the day counts."""
    working = intern.working_days or 0
    present = intern.present_days or 0

    intern.attendance_percentage = (
        round(present / working * 100, 1) if working > 0 else 0
    )


# ---------------------------------------------------------------------------
# Collection
#
# Literal paths (/search, /export, /pagination) must stay above /{id} or
# FastAPI matches them as an id and returns 422.
# ---------------------------------------------------------------------------


@router.get("/", response_model=list[InternResponse])
def get_all_interns(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Intern).order_by(Intern.id.desc()).all()


@router.post(
    "/",
    response_model=InternResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_intern(
    intern: InternCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    if db.query(Intern).filter(Intern.email == intern.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An intern with this email already exists",
        )

    if intern.intern_id and (
        db.query(Intern).filter(Intern.intern_id == intern.intern_id).first()
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An intern with this intern ID already exists",
        )

    new_intern = Intern(**intern.model_dump())
    _recalculate_attendance(new_intern)

    db.add(new_intern)
    db.commit()
    db.refresh(new_intern)

    return new_intern


@router.get("/search", response_model=list[InternResponse])
def search_intern(
    name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Intern).filter(Intern.name.ilike(f"%{name}%")).all()


@router.get("/search/email", response_model=InternResponse)
def search_by_email(
    email: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    intern = db.query(Intern).filter(Intern.email == email).first()

    # Used to return null with a 200, which reads as success.
    if not intern:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Intern not found",
        )

    return intern


@router.get("/department/{department}", response_model=list[InternResponse])
def get_department(
    department: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Intern).filter(Intern.department == department).all()


@router.get("/status/{status_value}", response_model=list[InternResponse])
def get_status(
    status_value: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Intern).filter(Intern.status == status_value).all()


@router.get("/mentor/{mentor}", response_model=list[InternResponse])
def get_mentor(
    mentor: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Intern).filter(Intern.mentor == mentor).all()


@router.get("/pagination")
def get_interns_paginated(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total = db.query(Intern).count()

    interns = (
        db.query(Intern)
        .order_by(Intern.id.desc())
        .offset((page - 1) * size)
        .limit(size)
        .all()
    )

    return {
        "page": page,
        "size": size,
        "total_records": total,
        "total_pages": (total + size - 1) // size,
        "data": [InternResponse.model_validate(i) for i in interns],
    }


@router.get("/export")
def export_interns(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    interns = db.query(Intern).order_by(Intern.id).all()

    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Interns"

    headers = [
        "ID", "Intern ID", "Name", "Email", "College", "Department",
        "Role", "Mentor", "Mode", "Status", "Start date", "End date",
        "Working days", "Present days", "Attendance %", "Verification",
    ]
    sheet.append(headers)

    for intern in interns:
        sheet.append([
            intern.id,
            intern.intern_id,
            intern.name,
            intern.email,
            intern.college,
            intern.department,
            intern.internship_role,
            intern.mentor,
            intern.mode,
            intern.status,
            intern.start_date,
            intern.end_date,
            intern.working_days,
            intern.present_days,
            intern.attendance_percentage,
            intern.verification_status,
        ])

    for column in range(1, len(headers) + 1):
        sheet.column_dimensions[
            sheet.cell(row=1, column=column).column_letter
        ].width = 20

    # Was written to the process working directory, so concurrent exports
    # clobbered each other and the file was never cleaned up.
    handle = tempfile.NamedTemporaryFile(suffix=".xlsx", delete=False)
    handle.close()
    workbook.save(handle.name)

    return FileResponse(
        handle.name,
        media_type=(
            "application/vnd.openxmlformats-officedocument"
            ".spreadsheetml.sheet"
        ),
        filename="interns.xlsx",
        background=None,
    )


# ---------------------------------------------------------------------------
# Single record
# ---------------------------------------------------------------------------


@router.get("/{intern_id}")
def get_intern_by_id(
    intern_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Grouped view backing the intern detail tabs."""
    intern = _get_or_404(db, intern_id)

    return {
        # The response omitted the primary key, so the client had no id to
        # link back to for edits or deletes.
        "id": intern.id,
        "identity_details": {
            "name": intern.name,
            "email": intern.email,
            "intern_id": intern.intern_id,
            "department": intern.department,
            "college": intern.college,
            "dob": intern.dob,
            "linkedin": intern.linkedin,
            "github": intern.github,
            "year": intern.year,
            "location": intern.location,
            "referral_person": intern.referral_person,
        },
        "internship_information": {
            "organization": intern.organization,
            "mentor": intern.mentor,
            "domain": intern.domain,
            "mode": intern.mode,
            "status": intern.status,
            "internship_role": intern.internship_role,
            "duration": intern.duration,
            "start_date": intern.start_date,
            "end_date": intern.end_date,
        },
        "work_task_summary": {
            "work_year": intern.work_year,
            "work_domain": intern.work_domain,
            "responsibilities": intern.responsibilities,
            "work_information": intern.work_information,
        },
        "attendance_summary": {
            "present_days": intern.present_days,
            "absent_days": intern.absent_days,
            "leave_days": intern.leave_days,
            "working_days": intern.working_days,
            "holidays": intern.holidays,
            "attendance_percentage": intern.attendance_percentage,
        },
        "verification": {
            "verification_status": intern.verification_status,
            "verified_by": intern.verified_by,
            "verification_date": intern.verification_date,
            "remarks": intern.remarks,
        },
    }


@router.put("/{intern_id}", response_model=InternResponse)
def update_intern(
    intern_id: int,
    intern_data: InternUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    intern = _get_or_404(db, intern_id)

    updates = intern_data.model_dump(exclude_unset=True)

    if "email" in updates:
        clash = (
            db.query(Intern)
            .filter(Intern.email == updates["email"], Intern.id != intern_id)
            .first()
        )
        if clash:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Another intern already uses this email",
            )

    for key, value in updates.items():
        setattr(intern, key, value)

    if {"present_days", "working_days"} & updates.keys():
        _recalculate_attendance(intern)

    db.commit()
    db.refresh(intern)

    return intern


@router.delete("/{intern_id}")
def delete_intern(
    intern_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    intern = _get_or_404(db, intern_id)

    db.delete(intern)
    db.commit()

    return {"message": "Intern deleted successfully"}
