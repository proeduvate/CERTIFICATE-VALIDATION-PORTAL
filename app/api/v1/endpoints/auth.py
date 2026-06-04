from fastapi import APIRouter

router = APIRouter()


@router.post("/login")
def login() -> dict[str, str]:
    return {"message": "Login endpoint"}
