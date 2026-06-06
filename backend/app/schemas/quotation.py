from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.models import QuotationStatus


class QuotationBase(BaseModel):
    rfq_id: int
    vendor_id: int
    total_amount: float
    delivery_days: Optional[int] = None
    notes: Optional[str] = None


class QuotationCreate(QuotationBase):
    is_anomaly: Optional[bool] = False

class QuotationUpdate(BaseModel):
    total_amount: Optional[float] = None
    delivery_days: Optional[int] = None
    notes: Optional[str] = None
    status: Optional[QuotationStatus] = None
    is_anomaly: Optional[bool] = None

from app.schemas.approval import ApprovalResponse

class QuotationResponse(QuotationBase):
    id: int
    status: QuotationStatus
    submitted_at: datetime
    is_anomaly: Optional[bool] = False
    approval: Optional[ApprovalResponse] = None

    class Config:
        from_attributes = True
