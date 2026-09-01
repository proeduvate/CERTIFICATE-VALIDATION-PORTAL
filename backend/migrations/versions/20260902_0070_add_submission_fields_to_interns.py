"""add submission fields to interns

Revision ID: f4f12345678g
Revises: e3f12345678f
Create Date: 2026-09-02 00:10:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'f4f12345678g'
down_revision: Union[str, Sequence[str], None] = 'e3f12345678f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TABLE interns ADD COLUMN IF NOT EXISTS intern_photo VARCHAR(255);")
    op.execute("ALTER TABLE interns ADD COLUMN IF NOT EXISTS intern_photo_data BYTEA;")
    op.execute("ALTER TABLE interns ADD COLUMN IF NOT EXISTS intern_photo_mime VARCHAR(100);")
    op.execute("ALTER TABLE interns ADD COLUMN IF NOT EXISTS internship_document VARCHAR(255);")
    op.execute("ALTER TABLE interns ADD COLUMN IF NOT EXISTS internship_document_data BYTEA;")
    op.execute("ALTER TABLE interns ADD COLUMN IF NOT EXISTS internship_document_mime VARCHAR(100);")
    op.execute("ALTER TABLE interns ADD COLUMN IF NOT EXISTS mentor_feedback VARCHAR(1000);")
    op.execute("ALTER TABLE interns ADD COLUMN IF NOT EXISTS training_feedback VARCHAR(1000);")
    op.execute("ALTER TABLE interns ADD COLUMN IF NOT EXISTS experience_feedback VARCHAR(1000);")
    op.execute("ALTER TABLE interns ADD COLUMN IF NOT EXISTS rating INTEGER;")
    op.execute("ALTER TABLE interns ADD COLUMN IF NOT EXISTS submission_status VARCHAR(100) DEFAULT 'Pending to receive';")


def downgrade() -> None:
    op.drop_column('interns', 'submission_status')
    op.drop_column('interns', 'rating')
    op.drop_column('interns', 'experience_feedback')
    op.drop_column('interns', 'training_feedback')
    op.drop_column('interns', 'mentor_feedback')
    op.drop_column('interns', 'internship_document_mime')
    op.drop_column('interns', 'internship_document_data')
    op.drop_column('interns', 'internship_document')
    op.drop_column('interns', 'intern_photo_mime')
    op.drop_column('interns', 'intern_photo_data')
    op.drop_column('interns', 'intern_photo')
