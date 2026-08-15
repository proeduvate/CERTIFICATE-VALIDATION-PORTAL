from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user, require_admin
from app.db.session import get_db
from app.models.lor import LOR
from app.models.user import User
from app.schemas.lor import LORCreate, LORResponse, LORUpdate

router = APIRouter(prefix="/lors", tags=["LOR"])


def _get_or_404(db: Session, lor_id: int) -> LOR:
    lor = db.query(LOR).filter(LOR.id == lor_id).first()

    if not lor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Letter of recommendation not found",
        )

    return lor


@router.get("/", response_model=list[LORResponse])
def get_all_lors(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(LOR).order_by(LOR.id.desc()).all()


@router.post("/", response_model=LORResponse, status_code=status.HTTP_201_CREATED)
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


@router.get("/{lor_id}", response_model=LORResponse)
def get_lor(
    lor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Returned an ad-hoc {lor_image_url, metadata, download_url} shape that did
    # not match LORResponse used by the list endpoint. One shape now.
    return _get_or_404(db, lor_id)


@router.put("/{lor_id}", response_model=LORResponse)
def update_lor(
    lor_id: int,
    lor_data: LORUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    lor = _get_or_404(db, lor_id)

    for key, value in lor_data.model_dump(exclude_unset=True).items():
        setattr(lor, key, value)

    db.commit()
    db.refresh(lor)

    return lor


@router.delete("/{lor_id}")
def delete_lor(
    lor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    lor = _get_or_404(db, lor_id)

    db.delete(lor)
    db.commit()

    return {"message": "Letter of recommendation deleted successfully"}
