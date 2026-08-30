"""increase intern column lengths

Revision ID: c1f12345678d
Revises: b0f12345678c
Create Date: 2026-08-30 17:35:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'c1f12345678d'
down_revision: Union[str, Sequence[str], None] = 'b0f12345678c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table('interns') as batch_op:
        batch_op.alter_column('intern_id', type_=sa.String(length=100), existing_type=sa.String(length=20))
        batch_op.alter_column('year', type_=sa.String(length=100), existing_type=sa.String(length=20))
        batch_op.alter_column('work_year', type_=sa.String(length=100), existing_type=sa.String(length=20))
        batch_op.alter_column('whatsapp_group', type_=sa.String(length=100), existing_type=sa.String(length=50))
        batch_op.alter_column('mode', type_=sa.String(length=100), existing_type=sa.String(length=50))
        batch_op.alter_column('status', type_=sa.String(length=100), existing_type=sa.String(length=50))
        batch_op.alter_column('duration', type_=sa.String(length=100), existing_type=sa.String(length=50))
        batch_op.alter_column('verification_status', type_=sa.String(length=100), existing_type=sa.String(length=50))


def downgrade() -> None:
    with op.batch_alter_table('interns') as batch_op:
        batch_op.alter_column('intern_id', type_=sa.String(length=20), existing_type=sa.String(length=100))
        batch_op.alter_column('year', type_=sa.String(length=20), existing_type=sa.String(length=100))
        batch_op.alter_column('work_year', type_=sa.String(length=20), existing_type=sa.String(length=100))
        batch_op.alter_column('whatsapp_group', type_=sa.String(length=50), existing_type=sa.String(length=100))
        batch_op.alter_column('mode', type_=sa.String(length=50), existing_type=sa.String(length=100))
        batch_op.alter_column('status', type_=sa.String(length=50), existing_type=sa.String(length=100))
        batch_op.alter_column('duration', type_=sa.String(length=50), existing_type=sa.String(length=100))
        batch_op.alter_column('verification_status', type_=sa.String(length=50), existing_type=sa.String(length=100))
