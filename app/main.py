from fastapi import FastAPI

from app.api.v1.router import api_router

app = FastAPI(title="Pro API")

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "API is running"}
