from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from app.models.models import RFQStatus


# --- RFQ Item Schemas ---
class RFQItemBase(BaseModel):
    product_name: str
    quantity: int
    description: Optional[str] = None
    unit_price_estimate: Optional[float] = None


class RFQItemCreate(RFQItemBase):
    pass


class RFQItemUpdate(RFQItemBase):
    product_name: Optional[str] = None
    quantity: Optional[int] = None


class RFQItemResponse(RFQItemBase):
    id: int
    rfq_id: int

    class Config:
        from_attributes = True


# --- RFQ Schemas ---
class RFQBase(BaseModel):
    title: str
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    status: Optional[RFQStatus] = RFQStatus.OPEN


class RFQCreate(RFQBase):
    items: List[RFQItemCreate] = []


class RFQUpdate(RFQBase):
    title: Optional[str] = None
    items: Optional[List[RFQItemCreate]] = None # Optional item update logic


class RFQResponse(RFQBase):
    id: int
    created_by: int
    created_at: datetime
    items: List[RFQItemResponse] = []

    class Config:
        from_attributes = True
