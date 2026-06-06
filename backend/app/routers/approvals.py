from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user, RoleChecker
from app.models.models import User, UserRole, QuotationStatus
from app.schemas.approval import ApprovalCreate, ApprovalResponse
from app.crud.approval import approval as crud_approval
from app.crud.quotation import quotation as crud_quotation

router = APIRouter()

# Managers are responsible for approvals
allow_managers = RoleChecker([UserRole.MANAGER, UserRole.ADMIN])

@router.post("/", response_model=ApprovalResponse, status_code=status.HTTP_201_CREATED)
def create_approval(
    *,
    db: Session = Depends(get_db),
    approval_in: ApprovalCreate,
    current_user: User = Depends(allow_managers)
) -> Any:
    """Approve or reject a quotation. Approving automatically generates a Purchase Order."""
    quotation = crud_quotation.get(db, id=approval_in.quotation_id)
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    if quotation.status != QuotationStatus.PENDING:
        raise HTTPException(status_code=400, detail="Quotation already processed")
    
    return crud_approval.create_and_process(db, obj_in=approval_in, approver_id=current_user.id)

@router.get("/", response_model=List[ApprovalResponse])
def read_approvals(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
) -> Any:
    """List approvals."""
    return crud_approval.get_multi(db, skip=skip, limit=limit)
