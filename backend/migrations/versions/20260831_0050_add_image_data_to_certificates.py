"""add image_data to certificates

Revision ID: d2f12345678e
Revises: c1f12345678d
Create Date: 2026-08-31 02:40:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'd2f12345678e'
down_revision: Union[str, Sequence[str], None] = 'c1f12345678d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TABLE certificates ADD COLUMN IF NOT EXISTS image_data BYTEA;")


def downgrade() -> None:
    op.drop_column('certificates', 'image_data')
