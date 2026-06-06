from pydantic import BaseModel, EmailStr
from app.models.models import UserRole


# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    full_name: str | None = None
    role: UserRole = UserRole.PROCUREMENT_OFFICER
    is_active: bool = True


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str


# Properties to receive via API on update
class UserUpdate(BaseModel):
    email: EmailStr | None = None
    full_name: str | None = None
    password: str | None = None
    role: UserRole | None = None
    is_active: bool | None = None


# Properties properties stored in DB (response schema)
class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True
