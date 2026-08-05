from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi import UploadFile, File
from fastapi.responses import FileResponse
import os

from app.db.session import get_db
from app.models.lor import LOR
from app.schemas.lor import LORCreate, LORResponse, LORUpdate
from app.core.security import (
    get_current_user,
    require_admin,
)
from app.models.user import User

router = APIRouter(
    prefix="/lors",
    tags=["LOR"],
)


@router.post("/", response_model=LORResponse)
def create_lor(
    lor: LORCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    new_lor = LOR(**lor.model_dump())

    db.add(new_lor)
    db.commit()
    db.refresh(new_lor)

    return new_lor


@router.get("/", response_model=list[LORResponse])
def get_all_lors(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(LOR).all()


@router.get("/{lor_id}")
def get_lor(
    lor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lor = db.query(LOR).filter(LOR.id == lor_id).first()

    if not lor:
        raise HTTPException(
            status_code=404,
            detail="LOR not found",
        )

    return {
    "lor_image_url": lor.file_path,
    "metadata": {
        "status": lor.status,
        "issued_by": lor.issued_by,
        "issue_date": lor.issue_date,
    },
    "download_url": f"/lors/{lor.id}/download",
}


@router.put("/{lor_id}", response_model=LORResponse)
def update_lor(
    lor_id: int,
    lor_data: LORUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    lor = db.query(LOR).filter(LOR.id == lor_id).first()

    if not lor:
        raise HTTPException(
            status_code=404,
            detail="LOR not found",
        )

    for key, value in lor_data.model_dump().items():
        setattr(lor, key, value)

    db.commit()
    db.refresh(lor)

    return {
    "lor_image_url": lor.file_path,
    "metadata": {
        "status": lor.status,
        "issued_by": lor.issued_by,
        "issue_date": lor.issue_date,
    },
    "download_url": f"/lors/{lor.id}/download",
}


@router.delete("/{lor_id}")
def delete_lor(
    lor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    lor = db.query(LOR).filter(LOR.id == lor_id).first()

    if not lor:
        raise HTTPException(
            status_code=404,
            detail="LOR not found",
        )

    db.delete(lor)
    db.commit()

    return {"message": "LOR deleted successfully"}

@router.post("/{lor_id}/upload")
def upload_lor(
    lor_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    lor = db.query(LOR).filter(LOR.id == lor_id).first()

    if not lor:
        raise HTTPException(
            status_code=404,
            detail="LOR not found",
        )

    upload_dir = "uploads/lors"
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    lor.file_path = file_path

    db.commit()

    return {
        "message": "LOR uploaded successfully",
        "file_path": file_path,
    }

@router.get("/{lor_id}/download")
def download_lor(
    lor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lor = db.query(LOR).filter(LOR.id == lor_id).first()

    if not lor:
        raise HTTPException(
            status_code=404,
            detail="LOR not found",
        )

    return FileResponse(
        path=lor.file_path,
        filename=os.path.basename(lor.file_path),
    )