from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Runtime configuration, read from backend/.env.

    Every field previously had no default, so the app refused to start until a
    complete .env existed. Only DATABASE_URL and SECRET_KEY are genuinely
    deployment-specific; the rest now have workable defaults so a fresh clone
    boots.
    """

    # PostgreSQL via psycopg 3. Override in .env for other environments.
    # The schema is owned by Alembic — run `alembic upgrade head`, not
    # create_all.
    DATABASE_URL: str = (
        "postgresql+psycopg://postgres@localhost:5432/proeduvate_portal"
    )

    API_V1_STR: str = "/api/v1"

    SECRET_KEY: str = "dev-only-change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Password-reset links are short-lived and single-purpose.
    RESET_TOKEN_EXPIRE_MINUTES: int = 30

    # Origins allowed to call the API from a browser. Comma-separated.
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    # Where uploaded certificates and documents are written.
    UPLOAD_DIR: str = "uploads"

    # Second factor for marking an intern verified. Being signed in as an admin
    # is not enough: the verifier must also know this code, so only the subset
    # of admins holding it can sign off a record.
    VERIFICATION_CODE: str = "change-me-verification-code"

    # Emit SQL to the console. Noisy; off by default.
    SQL_ECHO: bool = False

    @property
    def cors_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.CORS_ORIGINS.split(",")
            if origin.strip()
        ]

    class Config:
        env_file = ".env"


settings = Settings()
