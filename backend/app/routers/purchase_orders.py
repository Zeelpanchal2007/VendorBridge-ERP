from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user
from app.models.models import User
from app.schemas.po import PurchaseOrderResponse
from app.crud.po import po as crud_po

router = APIRouter()

@router.get("/", response_model=List[PurchaseOrderResponse])
def read_purchase_orders(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
) -> Any:
    """List purchase orders."""
    return crud_po.get_multi(db, skip=skip, limit=limit)

@router.get("/{id}", response_model=PurchaseOrderResponse)
def read_purchase_order(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get PO by ID."""
    po_obj = crud_po.get(db, id=id)
    if not po_obj:
        raise HTTPException(status_code=404, detail="PO not found")
    return po_obj
