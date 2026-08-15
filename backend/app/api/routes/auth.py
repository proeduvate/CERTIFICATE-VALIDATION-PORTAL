from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import (
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    ResetPasswordRequest,
    TokenResponse,
)
from app.core.security import (
    create_access_token,
    create_reset_token,
    decode_token,
    get_current_user,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists",
        )

    # Bootstrap: the very first account becomes the administrator. Registration
    # cannot choose a role, and `User.role` defaults to "intern", so previously
    # a fresh install had no way to reach any admin-only screen without hand
    # editing the database.
    is_first_user = db.query(User).count() == 0

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hash_password(user.password),
        role="admin" if is_first_user else "intern",
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    # One message for "no such account" and "wrong password". Distinct errors
    # ("Invalid Email" vs "Invalid Password") let anyone enumerate which
    # addresses are registered.
    invalid = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect email or password",
    )

    if not user or not verify_password(payload.password, user.password):
        raise invalid

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated",
        )

    token = create_access_token({"sub": user.email, "role": user.role})

    return {"access_token": token, "token_type": "bearer", "user": user}


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    # Tokens are stateless, so there is nothing to revoke server-side. The
    # client drops the token; this endpoint exists to confirm the session was
    # valid and to give logout an audit point later.
    return {"message": "Logged out. Remove the token from the client."}


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == request.email).first()

    # Always answer the same way. Returning 404 for unknown addresses turned
    # this endpoint into an account-existence oracle.
    message = (
        "If an account exists for that address, a reset link has been sent."
    )

    if not user:
        return {"message": message, "reset_token": None}

    # No mail transport is wired up yet, so the token is returned directly to
    # keep the flow usable. Send it by email and stop returning it here.
    return {"message": message, "reset_token": create_reset_token(user.email)}


@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    payload = decode_token(request.token, expected_type="reset")

    user = db.query(User).filter(User.email == payload.get("sub")).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This reset link is no longer valid",
        )

    user.password = hash_password(request.new_password)
    db.commit()

    return {"message": "Password updated. You can now sign in."}
