from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.intern import Intern
from app.schemas.intern import InternCreate, InternResponse, InternUpdate
from sqlalchemy import or_
from app.dependencies.role_checker import role_required
from fastapi.responses import FileResponse
from openpyxl import Workbook

router = APIRouter(prefix="/interns", tags=["Intern"])


@router.post("/", response_model=InternResponse)
def create_intern(intern: InternCreate, db: Session = Depends(get_db)):

    new_intern = Intern(
        name=intern.name,
        email=intern.email,
        department=intern.department,
        college=intern.college,
        intern_id=intern.intern_id,
        internship_role=intern.internship_role,
        referral_person=intern.referral_person,
        dob=intern.dob,
        linkedin=intern.linkedin,
        github=intern.github,
        year=intern.year,
        whatsapp_group=intern.whatsapp_group,
        location=intern.location,
        mode=intern.mode,
        domain=intern.domain,
        mentor=intern.mentor,
        organization=intern.organization,
        start_date=intern.start_date,
        end_date=intern.end_date,
        duration=intern.duration,
        status=intern.status,
        work_year=intern.work_year,
        work_domain=intern.work_domain,
        responsibilities=intern.responsibilities,
        work_information=intern.work_information,
        present_days=intern.present_days,
        absent_days=intern.absent_days,
        leave_days=intern.leave_days,
        working_days=intern.working_days,
        holidays=intern.holidays,
        attendance_percentage=intern.attendance_percentage,
        offer_letter=intern.offer_letter,
        completion_letter=intern.completion_letter,
        lor=intern.lor,
        certificate=intern.certificate,
        resume=intern.resume,
        verification_status=intern.verification_status,
        verified_by=intern.verified_by,
        verification_date=intern.verification_date,
        remarks=intern.remarks,
    )

    db.add(new_intern)
    db.commit()
    db.refresh(new_intern)

    return new_intern


@router.get("/", response_model=list[InternResponse])
def get_all_interns(db: Session = Depends(get_db)):
    interns = db.query(Intern).all()
    return interns


@router.get("/search")
def search_intern(name: str, db: Session = Depends(get_db)):
    interns = db.query(Intern).filter(Intern.name.ilike(f"%{name}%")).all()

    return interns


@router.get("/search/email")
def search_by_email(email: str, db: Session = Depends(get_db)):
    intern = db.query(Intern).filter(Intern.email == email).first()

    return intern


@router.get("/department/{department}")
def get_department(department: str, db: Session = Depends(get_db)):
    return db.query(Intern).filter(Intern.department == department).all()


@router.get("/status/{status}")
def get_status(status: str, db: Session = Depends(get_db)):
    return db.query(Intern).filter(Intern.status == status).all()


@router.get("/mentor/{mentor}")
def get_mentor(mentor: str, db: Session = Depends(get_db)):
    return db.query(Intern).filter(Intern.mentor == mentor).all()


@router.get("/pagination")
def get_interns(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1),
    db: Session = Depends(get_db),
):
    skip = (page - 1) * size

    interns = db.query(Intern).offset(skip).limit(size).all()

    total = db.query(Intern).count()

    return {
        "page": page,
        "size": size,
        "total_records": total,
        "total_pages": (total + size - 1) // size,
        "data": interns,
    }


@router.get("/export")
def export_interns(db: Session = Depends(get_db)):

    interns = db.query(Intern).all()

    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Interns"

    sheet.append(["ID", "Name", "Email", "Department", "College", "Status", "Mentor"])

    for intern in interns:
        sheet.append(
            [
                intern.id,
                intern.name,
                intern.email,
                intern.department,
                intern.college,
                intern.status,
                intern.mentor,
            ]
        )

    filename = "interns.xlsx"
    workbook.save(filename)

    return FileResponse(
        filename,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename="interns.xlsx",
    )


@router.get("/{id}", response_model=InternResponse)
def get_intern_by_id(id: int, db: Session = Depends(get_db)):
    intern = db.query(Intern).filter(Intern.id == id).first()

    if not intern:
        raise HTTPException(status_code=404, detail="Intern not found")

    return intern


@router.put("/{id}", response_model=InternResponse)
def update_intern(id: int, intern_data: InternUpdate, db: Session = Depends(get_db)):
    intern = db.query(Intern).filter(Intern.id == id).first()

    if not intern:
        raise HTTPException(status_code=404, detail="Intern not found")

    intern.name = intern_data.name
    intern.email = intern_data.email
    intern.department = intern_data.department
    intern.college = intern_data.college

    intern.intern_id = intern_data.intern_id
    intern.internship_role = intern_data.internship_role
    intern.referral_person = intern_data.referral_person
    intern.dob = intern_data.dob
    intern.linkedin = intern_data.linkedin
    intern.github = intern_data.github
    intern.year = intern_data.year
    intern.whatsapp_group = intern_data.whatsapp_group
    intern.location = intern_data.location
    intern.mode = intern_data.mode
    intern.domain = intern_data.domain
    intern.mentor = intern_data.mentor
    intern.organization = intern_data.organization
    intern.start_date = intern_data.start_date
    intern.end_date = intern_data.end_date
    intern.duration = intern_data.duration
    intern.status = intern_data.status
    intern.work_year = intern_data.work_year
    intern.work_domain = intern_data.work_domain
    intern.responsibilities = intern_data.responsibilities
    intern.work_information = intern_data.work_information
    intern.present_days = intern_data.present_days
    intern.absent_days = intern_data.absent_days
    intern.leave_days = intern_data.leave_days
    intern.working_days = intern_data.working_days
    intern.holidays = intern_data.holidays
    intern.attendance_percentage = intern_data.attendance_percentage
    intern.offer_letter = intern_data.offer_letter
    intern.completion_letter = intern_data.completion_letter
    intern.lor = intern_data.lor
    intern.certificate = intern_data.certificate
    intern.resume = intern_data.resume
    intern.verification_status = intern_data.verification_status
    intern.verified_by = intern_data.verified_by
    intern.verification_date = intern_data.verification_date
    intern.remarks = intern_data.remarks

    db.commit()
    db.refresh(intern)

    return intern


@router.delete("/{id}")
def delete_intern(id: int, db: Session = Depends(get_db)):
    intern = db.query(Intern).filter(Intern.id == id).first()

    if not intern:
        raise HTTPException(status_code=404, detail="Intern not found")

    db.delete(intern)
    db.commit()

    return {"message": "Intern deleted successfully"}
