from pydantic import BaseModel
import datetime
from app.models.models import RFQStatus


# Shared properties
class RFQBase(BaseModel):
    title: str
    description: str | None = None
    deadline: datetime.datetime | None = None


# Properties to receive via API on creation
class RFQCreate(RFQBase):
    pass


# Properties to receive via API on update
class RFQUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    deadline: datetime.datetime | None = None
    status: RFQStatus | None = None


# Response properties
class RFQResponse(RFQBase):
    id: int
    created_by: int | None
    created_at: datetime.datetime
    status: RFQStatus

    class Config:
        from_attributes = True
