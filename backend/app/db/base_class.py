from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """
    Declarative base.

    Lives apart from `app.db.base` on purpose. That module imports every model
    so Alembic can see the full metadata, and the models import the base — so
    holding both in one file is a cycle. It only worked before because
    something always imported `app.db.init_db` first; removing that import made
    the cycle fatal.
    """
