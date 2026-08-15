import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

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

# The browser blocks every cross-origin request without this. The API and the
# Vite dev server run on different ports, so without CORS the frontend could
# reach nothing — even though curl worked fine.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

# Serve uploaded certificates/documents so the frontend can link to them.
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount(
    f"/{settings.UPLOAD_DIR}",
    StaticFiles(directory=settings.UPLOAD_DIR),
    name="uploads",
)

app.include_router(auth_router)
app.include_router(intern_router)
app.include_router(dashboard_router)
app.include_router(certificate_router)
app.include_router(lor_router)
app.include_router(document_router)
app.include_router(verification_router)


@app.get("/", tags=["Health"])
def home():
    return {
        "message": "ProEduvate Certificate Validation API",
        "status": "ok",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
