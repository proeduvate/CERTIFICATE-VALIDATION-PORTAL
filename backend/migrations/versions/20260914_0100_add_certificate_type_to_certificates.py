"""add certificate_type to certificates table

Revision ID: i7f12345679j
Revises: h6f12345678i
Create Date: 2026-09-14 14:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'i7f12345679j'
down_revision: Union[str, Sequence[str], None] = 'h6f12345678i'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        "ALTER TABLE certificates ADD COLUMN IF NOT EXISTS certificate_type VARCHAR(50) NOT NULL DEFAULT 'completion';"
    )


def downgrade() -> None:
    op.execute("ALTER TABLE certificates DROP COLUMN IF EXISTS certificate_type;")
