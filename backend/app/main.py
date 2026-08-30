import os
import sys

# Ensure backend directory is in sys.path for Vercel serverless deployment
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import logging

from fastapi import APIRouter, FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.exc import DataError, IntegrityError, SQLAlchemyError

logger = logging.getLogger(__name__)

from app.core.config import settings
from app.api.routes.auth import router as auth_router
from app.api.routes.intern import router as intern_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.certificate import router as certificate_router
from app.api.routes.document import router as document_router
from app.api.routes.lor import router as lor_router
from app.api.routes.verification import router as verification_router


app = FastAPI(
    title="ProEduvate Certificate Validation API",
    version="1.0.0",
    description=(
        "Backend for the intern management and certificate validation portal."
    ),
)


@app.exception_handler(DataError)
async def data_error_handler(request: Request, exc: DataError):
    logger.error("Database DataError: %s", exc)
    orig_msg = str(exc.orig) if hasattr(exc, "orig") and exc.orig else str(exc)
    orig_msg_lower = orig_msg.lower()

    if "value too long" in orig_msg_lower or "stringdata_right_truncation" in orig_msg_lower or "stringdatarighttruncation" in orig_msg_lower:
        detail = "Data entry too long: One of the fields exceeds the maximum character length permitted by the database. Please shorten your input (such as Intern ID or Name) and try again."
    elif "invalid input syntax" in orig_msg_lower or "out of range" in orig_msg_lower:
        detail = "Invalid input format: One of the values (such as a date or number) is not in a valid format or is out of range."
    else:
        detail = "Database error: The submitted data contains invalid or overly long values."

    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": detail},
    )


@app.exception_handler(IntegrityError)
async def integrity_error_handler(request: Request, exc: IntegrityError):
    logger.error("Database IntegrityError: %s", exc)
    orig_msg = str(exc.orig) if hasattr(exc, "orig") and exc.orig else str(exc)
    orig_msg_lower = orig_msg.lower()

    if "foreign key constraint" in orig_msg_lower or "foreignkeyviolation" in orig_msg_lower:
        detail = "Cannot perform operation: This record is referenced by or relies on other records (e.g. certificates or documents)."
    elif "unique constraint" in orig_msg_lower or "already exists" in orig_msg_lower or "uniqueviolation" in orig_msg_lower:
        if "email" in orig_msg_lower:
            detail = "An intern with this email address already exists."
        elif "intern_id" in orig_msg_lower:
            detail = "An intern with this Intern ID already exists."
        elif "certificate_number" in orig_msg_lower:
            detail = "A certificate with this number already exists."
        else:
            detail = "A record with this unique information (such as email or intern ID) already exists."
    else:
        detail = "Database constraint violation. Please verify that required unique information is not duplicated."

    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": detail},
    )


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_error_handler(request: Request, exc: SQLAlchemyError):
    logger.error("Database SQLAlchemyError: %s", exc)
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": "Database operation failed. Please check your inputs and try again."},
    )

# The browser blocks every cross-origin request without this. The API and the
# Vite dev server run on different ports, so without CORS the frontend could
# reach nothing — even though curl worked fine.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=settings.CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)




api_v1_router = APIRouter(prefix=settings.API_V1_STR)
api_v1_router.include_router(auth_router)
api_v1_router.include_router(intern_router)
api_v1_router.include_router(dashboard_router)
api_v1_router.include_router(certificate_router)
api_v1_router.include_router(lor_router)
api_v1_router.include_router(document_router)
api_v1_router.include_router(verification_router)

app.include_router(api_v1_router)


@app.get("/", tags=["Health"])
@app.get(f"{settings.API_V1_STR}", tags=["Health"])
def home():
    return {
        "message": "ProEduvate Certificate Validation API",
        "status": "ok",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
@app.get(f"{settings.API_V1_STR}/health", tags=["Health"])
def health():
    return {"status": "ok"}


@app.on_event("startup")
def ensure_db_schema():
    try:
        from sqlalchemy import text
        from app.db.session import engine
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE certificates ADD COLUMN IF NOT EXISTS image_data BYTEA;"))
            conn.commit()
    except Exception as e:
        logger.warning("Startup schema check notice: %s", e)

