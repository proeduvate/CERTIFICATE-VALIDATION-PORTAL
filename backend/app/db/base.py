"""
Model registry for Alembic.

Importing this module registers every table on `Base.metadata`, which is what
`migrations/env.py` compares the database against. A model that is not imported
here is invisible to autogenerate and will be silently dropped from migrations.

Application code should import `Base` from `app.db.base_class` instead.
"""

from app.db.base_class import Base  # noqa: F401

from app.models.user import User  # noqa: F401
from app.models.intern import Intern  # noqa: F401
from app.models.certificate import Certificate  # noqa: F401
from app.models.lor import LOR  # noqa: F401
from app.models.document import Document  # noqa: F401
