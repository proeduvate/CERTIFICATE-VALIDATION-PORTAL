"""
Alembic environment.

Takes the database URL from the application's own settings rather than
alembic.ini, so migrations and the running app can never point at different
databases. Importing `app.db.base` registers every model on `Base.metadata`,
which is what autogenerate compares against.
"""

import os
import sys
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

# Make the `app` package importable when alembic runs from backend/.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings  # noqa: E402
from app.db.base import Base  # noqa: E402,F401  (imports every model)

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# The single source of truth for where we connect.
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Emit SQL to stdout without connecting."""
    context.configure(
        url=settings.DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            # Without these, autogenerate misses column type and default
            # changes and silently produces empty migrations.
            compare_type=True,
            compare_server_default=True,
            # SQLite cannot ALTER most columns; batch mode rewrites the table
            # instead. Harmless on Postgres, essential if anyone runs the
            # migrations against the old SQLite file.
            render_as_batch=settings.DATABASE_URL.startswith("sqlite"),
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
