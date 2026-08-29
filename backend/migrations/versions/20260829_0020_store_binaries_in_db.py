"""store binaries in db

Revision ID: a9e12345678b
Revises: 8d6511b88944
Create Date: 2026-08-29 15:36:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a9e12345678b'
down_revision: Union[str, Sequence[str], None] = '8d6511b88944'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add binary and metadata columns to certificates
    op.add_column('certificates', sa.Column('file_data', sa.LargeBinary(), nullable=True))
    op.add_column('certificates', sa.Column('file_mime_type', sa.String(length=100), nullable=True))
    op.add_column('certificates', sa.Column('file_name', sa.String(length=255), nullable=True))

    # Add binary and metadata columns to interns
    op.add_column('interns', sa.Column('offer_letter_data', sa.LargeBinary(), nullable=True))
    op.add_column('interns', sa.Column('offer_letter_mime', sa.String(length=100), nullable=True))
    op.add_column('interns', sa.Column('acknowledgement_letter_data', sa.LargeBinary(), nullable=True))
    op.add_column('interns', sa.Column('acknowledgement_letter_mime', sa.String(length=100), nullable=True))
    op.add_column('interns', sa.Column('terms_conditions_data', sa.LargeBinary(), nullable=True))
    op.add_column('interns', sa.Column('terms_conditions_mime', sa.String(length=100), nullable=True))
    op.add_column('interns', sa.Column('lor_data', sa.LargeBinary(), nullable=True))
    op.add_column('interns', sa.Column('lor_mime', sa.String(length=100), nullable=True))
    op.add_column('interns', sa.Column('completion_letter_data', sa.LargeBinary(), nullable=True))
    op.add_column('interns', sa.Column('completion_letter_mime', sa.String(length=100), nullable=True))
    op.add_column('interns', sa.Column('certificate_data', sa.LargeBinary(), nullable=True))
    op.add_column('interns', sa.Column('certificate_mime', sa.String(length=100), nullable=True))
    op.add_column('interns', sa.Column('resume_data', sa.LargeBinary(), nullable=True))
    op.add_column('interns', sa.Column('resume_mime', sa.String(length=100), nullable=True))


def downgrade() -> None:
    op.drop_column('certificates', 'file_name')
    op.drop_column('certificates', 'file_mime_type')
    op.drop_column('certificates', 'file_data')

    op.drop_column('interns', 'resume_mime')
    op.drop_column('interns', 'resume_data')
    op.drop_column('interns', 'certificate_mime')
    op.drop_column('interns', 'certificate_data')
    op.drop_column('interns', 'completion_letter_mime')
    op.drop_column('interns', 'completion_letter_data')
    op.drop_column('interns', 'lor_mime')
    op.drop_column('interns', 'lor_data')
    op.drop_column('interns', 'terms_conditions_mime')
    op.drop_column('interns', 'terms_conditions_data')
    op.drop_column('interns', 'acknowledgement_letter_mime')
    op.drop_column('interns', 'acknowledgement_letter_data')
    op.drop_column('interns', 'offer_letter_mime')
    op.drop_column('interns', 'offer_letter_data')
