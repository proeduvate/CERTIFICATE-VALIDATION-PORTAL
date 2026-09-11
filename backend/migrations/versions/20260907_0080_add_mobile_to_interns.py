"""add mobile column to interns

Revision ID: g5f12345678h
Revises: f4f12345678g
Create Date: 2026-09-07 00:55:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'g5f12345678h'
down_revision: Union[str, Sequence[str], None] = 'f4f12345678g'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TABLE interns ADD COLUMN IF NOT EXISTS mobile VARCHAR(50);")


def downgrade() -> None:
    op.drop_column('interns', 'mobile')
