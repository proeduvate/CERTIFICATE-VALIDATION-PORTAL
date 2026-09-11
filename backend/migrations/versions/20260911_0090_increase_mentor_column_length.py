"""increase mentor column length in interns table for multi-select support

Revision ID: h6f12345678i
Revises: g5f12345678h
Create Date: 2026-09-11 22:10:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'h6f12345678i'
down_revision: Union[str, Sequence[str], None] = 'g5f12345678h'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TABLE interns ALTER COLUMN mentor TYPE VARCHAR(500);")


def downgrade() -> None:
    op.execute("ALTER TABLE interns ALTER COLUMN mentor TYPE VARCHAR(100);")
