from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class InvoiceBase(BaseModel):
    invoice_number: str
    po_id: int
    total_amount: float
    tax_amount: float = 0.0
    status: str = "generated"


class InvoiceCreate(InvoiceBase):
    pass


class InvoiceUpdate(BaseModel):
    status: Optional[str] = None


class InvoiceResponse(InvoiceBase):
    id: int
    generated_at: datetime

    class Config:
        from_attributes = True
