from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import ForgotPasswordRequest, ResetPasswordRequest
from app.core.security import hash_password
from app.core.security import verify_password, create_access_token
from app.core.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hash_password(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid Email")

    if not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid Password")

    token = create_access_token({"sub": user.email, "role": user.role})

    return {
    "access_token": token,
    "token_type": "bearer",
    "user": {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
    },
}


@router.get("/profile")
def profile(current_user=Depends(get_current_user)):
    return {"message": "Profile fetched successfully", "user": current_user}

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role,
    }

@router.post("/logout")
def logout(
    current_user: User = Depends(get_current_user),
):
    return {
        "message": "Logout successful. Please remove the token from the client.",
    }



@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == request.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "message": "User verified. You can reset your password.",
    }


@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == request.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = hash_password(request.new_password)

    db.commit()

    return {"message": "Password reset successfully."}
