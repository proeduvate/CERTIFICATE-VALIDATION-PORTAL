from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    # bcrypt only hashes the first 72 bytes, so anything longer is silently
    # truncated. Reject it rather than accept a misleading password.
    password: str = Field(min_length=8, max_length=72)


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    is_active: bool

    model_config = {"from_attributes": True}
