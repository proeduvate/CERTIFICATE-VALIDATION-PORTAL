from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass


from app.models.user import User  # noqa: F401, E402
from app.models.intern import Intern  # noqa: F401, E402
from app.models.certificate import Certificate  # noqa: F401, E402
from app.models.lor import LOR  # noqa: F401, E402
from app.models.document import Document  # noqa: F401, E402