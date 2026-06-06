from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ApprovalBase(BaseModel):
    quotation_id: int
    status: str = "pending" # pending, approved, rejected
    remarks: Optional[str] = None


class ApprovalCreate(ApprovalBase):
    pass


class ApprovalUpdate(BaseModel):
    status: Optional[str] = None
    remarks: Optional[str] = None


class ApprovalResponse(ApprovalBase):
    id: int
    approver_id: int
    approved_at: Optional[datetime] = None

    class Config:
        from_attributes = True
