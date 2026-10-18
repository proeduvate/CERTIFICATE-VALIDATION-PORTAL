"""add extension fields to interns table

Revision ID: j8f12345670k
Revises: i7f12345679j
Create Date: 2026-10-11 21:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'j8f12345670k'
down_revision: Union[str, Sequence[str], None] = 'i7f12345679j'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        "ALTER TABLE interns ADD COLUMN IF NOT EXISTS is_extended BOOLEAN NOT NULL DEFAULT FALSE;"
    )
    op.execute(
        "ALTER TABLE interns ADD COLUMN IF NOT EXISTS original_end_date DATE;"
    )
    op.execute(
        "ALTER TABLE interns ADD COLUMN IF NOT EXISTS extension_reason VARCHAR(500);"
    )
    op.execute(
        "ALTER TABLE interns ADD COLUMN IF NOT EXISTS extension_date DATE;"
    )
    op.execute(
        "ALTER TABLE interns ADD COLUMN IF NOT EXISTS extension_duration VARCHAR(100);"
    )


def downgrade() -> None:
    op.execute("ALTER TABLE interns DROP COLUMN IF EXISTS is_extended;")
    op.execute("ALTER TABLE interns DROP COLUMN IF EXISTS original_end_date;")
    op.execute("ALTER TABLE interns DROP COLUMN IF EXISTS extension_reason;")
    op.execute("ALTER TABLE interns DROP COLUMN IF EXISTS extension_date;")
    op.execute("ALTER TABLE interns DROP COLUMN IF EXISTS extension_duration;")
