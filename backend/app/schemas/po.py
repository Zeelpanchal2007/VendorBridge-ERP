from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PurchaseOrderBase(BaseModel):
    po_number: str
    quotation_id: int
    total_amount: float
    status: str = "issued"


class PurchaseOrderCreate(PurchaseOrderBase):
    pass


class PurchaseOrderUpdate(BaseModel):
    status: Optional[str] = None


class PurchaseOrderResponse(PurchaseOrderBase):
    id: int
    issued_at: datetime

    class Config:
        from_attributes = True
