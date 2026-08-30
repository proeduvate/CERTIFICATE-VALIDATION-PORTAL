"""add is_frozen to certificates

Revision ID: e3f12345678f
Revises: d2f12345678e
Create Date: 2026-08-31 02:48:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'e3f12345678f'
down_revision: Union[str, Sequence[str], None] = 'd2f12345678e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TABLE certificates ADD COLUMN IF NOT EXISTS is_frozen BOOLEAN DEFAULT FALSE;")


def downgrade() -> None:
    op.drop_column('certificates', 'is_frozen')
