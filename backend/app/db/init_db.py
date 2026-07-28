from app.db.session import engine
from app.db.base import Base

from app.models.user import User  # noqa: F401
from app.models.intern import Intern  # noqa: F401


def create_tables():
    Base.metadata.create_all(bind=engine)
