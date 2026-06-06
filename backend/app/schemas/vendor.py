from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class VendorBase(BaseModel):
    name: str
    gst_number: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = "active"


class VendorCreate(VendorBase):
    pass


class VendorUpdate(VendorBase):
    name: Optional[str] = None
    rating: Optional[float] = None


class VendorResponse(VendorBase):
    id: int
    rating: float
    created_at: datetime

    class Config:
        from_attributes = True
