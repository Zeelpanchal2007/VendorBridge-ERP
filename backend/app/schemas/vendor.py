from pydantic import BaseModel, EmailStr
import datetime


# Shared properties
class VendorBase(BaseModel):
    name: str
    gst_number: str | None = None
    contact_person: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    address: str | None = None
    category: str | None = None


# Properties to receive via API on creation
class VendorCreate(VendorBase):
    pass


# Properties to receive via API on update
class VendorUpdate(BaseModel):
    name: str | None = None
    gst_number: str | None = None
    contact_person: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    address: str | None = None
    category: str | None = None
    status: str | None = None
    rating: float | None = None


# Response properties
class VendorResponse(VendorBase):
    id: int
    status: str
    rating: float
    created_at: datetime.datetime

    class Config:
        from_attributes = True
