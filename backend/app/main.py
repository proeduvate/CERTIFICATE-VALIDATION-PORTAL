from fastapi import FastAPI
from app.db.init_db import create_tables
from app.api.routes.auth import router as auth_router
from app.api.routes.intern import router as intern_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.certificate import router as certificate_router
from app.api.routes.document import router as document_router
from app.api.routes.lor import router as lor_router


app = FastAPI(title="Intern Management System API", version="1.0.0")

create_tables()


app.include_router(auth_router)
app.include_router(intern_router)
app.include_router(dashboard_router)
app.include_router(certificate_router)
app.include_router(lor_router)
app.include_router(document_router)


@app.get("/")
def home():
    return {"message": "Intern Management System API Running Successfully"}
