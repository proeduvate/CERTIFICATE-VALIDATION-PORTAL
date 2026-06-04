from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def list_users() -> dict[str, list]:
    return {"users": []}
