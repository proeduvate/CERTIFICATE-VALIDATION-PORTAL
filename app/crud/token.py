from sqlalchemy.orm import Session

from app.models.token import Token


def create_token(db: Session, token: str, user_id: int) -> Token:
    db_token = Token(token=token, user_id=user_id)
    db.add(db_token)
    db.commit()
    db.refresh(db_token)
    return db_token
