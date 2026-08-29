import json
from typing import Optional, Union

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

    # Origins allowed to call the API from a browser.
    # Supports comma-separated strings, space-separated strings, or JSON arrays.
    # E.g. "http://localhost:5173,https://yourdomain.com"
    CORS_ORIGINS: Union[str, list[str]] = (
        "http://localhost:5173,http://127.0.0.1:5173"
    )
    CORS_ORIGIN_REGEX: Optional[str] = None

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
        raw = self.CORS_ORIGINS
        if isinstance(raw, str):
            raw_str = raw.strip()
            if raw_str.startswith("[") and raw_str.endswith("]"):
                try:
                    parsed = json.loads(raw_str)
                    if isinstance(parsed, list):
                        raw = parsed
                except Exception:
                    pass

        if isinstance(raw, str):
            raw_items = [
                item.strip()
                for item in raw.replace(" ", ",").split(",")
                if item.strip()
            ]
        elif isinstance(raw, list):
            raw_items = [str(item).strip() for item in raw if str(item).strip()]
        else:
            raw_items = []

        cleaned = []
        for item in raw_items:
            if item == "*":
                cleaned.append("*")
            else:
                cleaned.append(item.rstrip("/"))
        return cleaned

    @property
    def upload_dir(self) -> str:
        import os
        import tempfile

        target = self.UPLOAD_DIR
        try:
            os.makedirs(target, exist_ok=True)
            return target
        except OSError:
            tmp_target = os.path.join(tempfile.gettempdir(), self.UPLOAD_DIR)
            try:
                os.makedirs(tmp_target, exist_ok=True)
            except OSError:
                pass
            return tmp_target


    class Config:
        env_file = ".env"


settings = Settings()
