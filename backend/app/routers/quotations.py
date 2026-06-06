from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user, RoleChecker
from app.models.models import User, UserRole, RFQStatus
from app.schemas.quotation import QuotationCreate, QuotationUpdate, QuotationResponse
from app.crud.quotation import quotation as crud_quotation
from app.crud.rfq import rfq as crud_rfq

router = APIRouter()

allow_vendors = RoleChecker([UserRole.VENDOR, UserRole.ADMIN])

@router.post("/", response_model=QuotationResponse, status_code=status.HTTP_201_CREATED)
def submit_quotation(
    *,
    db: Session = Depends(get_db),
    quotation_in: QuotationCreate,
    current_user: User = Depends(allow_vendors)
) -> Any:
    """Submit a quotation for an RFQ."""
    rfq_obj = crud_rfq.get(db, id=quotation_in.rfq_id)
    if not rfq_obj:
        raise HTTPException(status_code=404, detail="RFQ not found")
    if rfq_obj.status != RFQStatus.OPEN:
        raise HTTPException(status_code=400, detail="RFQ is not open for quotations")
    return crud_quotation.create(db, obj_in=quotation_in)

@router.get("/rfq/{rfq_id}", response_model=List[QuotationResponse])
def get_quotations_by_rfq(
    *,
    db: Session = Depends(get_db),
    rfq_id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get all quotations for a specific RFQ."""
    return crud_quotation.get_multi_by_rfq(db, rfq_id=rfq_id)

@router.get("/vendor/me", response_model=List[QuotationResponse])
def get_my_quotations(
    *,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(allow_vendors)
) -> Any:
    """Get all quotations submitted by the current vendor."""
    from app.crud.vendor import vendor as crud_vendor
    vendor_obj = crud_vendor.get_by_email(db, email=current_user.email)
    if not vendor_obj:
        return []
    return crud_quotation.get_multi_by_vendor(db, vendor_id=vendor_obj.id, skip=skip, limit=limit)

@router.get("/{id}", response_model=QuotationResponse)
def read_quotation(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get quotation by ID."""
    q_obj = crud_quotation.get(db, id=id)
    if not q_obj:
        raise HTTPException(status_code=404, detail="Quotation not found")
    return q_obj
