from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user, RoleChecker
from app.models.models import User, UserRole
from app.schemas.rfq import RFQCreate, RFQUpdate, RFQResponse
from app.crud.rfq import rfq as crud_rfq

router = APIRouter()

allow_procurement = RoleChecker([UserRole.PROCUREMENT_OFFICER, UserRole.ADMIN])

@router.post("/", response_model=RFQResponse, status_code=status.HTTP_201_CREATED)
def create_rfq(
    *,
    db: Session = Depends(get_db),
    rfq_in: RFQCreate,
    current_user: User = Depends(allow_procurement)
) -> Any:
    """Create a new RFQ with multiple items."""
    return crud_rfq.create_with_items(db, obj_in=rfq_in, created_by=current_user.id)

@router.get("/", response_model=List[RFQResponse])
def read_rfqs(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
) -> Any:
    """Retrieve RFQs."""
    return crud_rfq.get_multi(db, skip=skip, limit=limit)

@router.get("/{id}", response_model=RFQResponse)
def read_rfq(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get a specific RFQ by ID."""
    rfq_obj = crud_rfq.get(db, id=id)
    if not rfq_obj:
        raise HTTPException(status_code=404, detail="RFQ not found")
    return rfq_obj

@router.put("/{id}", response_model=RFQResponse)
def update_rfq(
    *,
    db: Session = Depends(get_db),
    id: int,
    rfq_in: RFQUpdate,
    current_user: User = Depends(allow_procurement)
) -> Any:
    """Update an RFQ."""
    rfq_obj = crud_rfq.get(db, id=id)
    if not rfq_obj:
        raise HTTPException(status_code=404, detail="RFQ not found")
    return crud_rfq.update(db, db_obj=rfq_obj, obj_in=rfq_in)
