from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    """
    Login credentials.

    `POST /auth/login` used to declare `email` and `password` as bare function
    arguments, so FastAPI read them from the *query string* — putting passwords
    into server access logs, browser history and Referer headers. They are a
    request body now.
    """

    email: EmailStr
    password: str = Field(min_length=1, max_length=72)


class UserSummary(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserSummary


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ForgotPasswordResponse(BaseModel):
    message: str
    # Returned only while no mail transport is configured, so the reset flow is
    # testable end to end. Remove once reset links are emailed.
    reset_token: str | None = None


class ResetPasswordRequest(BaseModel):
    """
    Reset used to accept `{email, new_password}` with no proof of ownership,
    letting anyone change any account's password given only an address. A
    signed, short-lived token from /auth/forgot-password is now required.
    """

    token: str
    new_password: str = Field(min_length=8, max_length=72)
