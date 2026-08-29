"""cascade delete interns

Revision ID: b0f12345678c
Revises: a9e12345678b
Create Date: 2026-08-29 21:15:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b0f12345678c'
down_revision: Union[str, Sequence[str], None] = 'a9e12345678b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Update foreign keys on certificates, documents, and lors to ON DELETE CASCADE
    with op.batch_alter_table('certificates') as batch_op:
        batch_op.drop_constraint('certificates_intern_id_fkey', type_='foreignkey')
        batch_op.create_foreign_key(
            'certificates_intern_id_fkey',
            'interns',
            ['intern_id'],
            ['id'],
            ondelete='CASCADE',
        )

    with op.batch_alter_table('documents') as batch_op:
        batch_op.drop_constraint('documents_intern_id_fkey', type_='foreignkey')
        batch_op.create_foreign_key(
            'documents_intern_id_fkey',
            'interns',
            ['intern_id'],
            ['id'],
            ondelete='CASCADE',
        )

    with op.batch_alter_table('lors') as batch_op:
        batch_op.drop_constraint('lors_intern_id_fkey', type_='foreignkey')
        batch_op.create_foreign_key(
            'lors_intern_id_fkey',
            'interns',
            ['intern_id'],
            ['id'],
            ondelete='CASCADE',
        )


def downgrade() -> None:
    with op.batch_alter_table('lors') as batch_op:
        batch_op.drop_constraint('lors_intern_id_fkey', type_='foreignkey')
        batch_op.create_foreign_key(
            'lors_intern_id_fkey',
            'interns',
            ['intern_id'],
            ['id'],
        )

    with op.batch_alter_table('documents') as batch_op:
        batch_op.drop_constraint('documents_intern_id_fkey', type_='foreignkey')
        batch_op.create_foreign_key(
            'documents_intern_id_fkey',
            'interns',
            ['intern_id'],
            ['id'],
        )

    with op.batch_alter_table('certificates') as batch_op:
        batch_op.drop_constraint('certificates_intern_id_fkey', type_='foreignkey')
        batch_op.create_foreign_key(
            'certificates_intern_id_fkey',
            'interns',
            ['intern_id'],
            ['id'],
        )
