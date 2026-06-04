from sqlalchemy.orm import Session

from app.crud.user import get_user_by_email
from app.models.user import User


def find_user_by_email(db: Session, email: str) -> User | None:
    return get_user_by_email(db, email)
