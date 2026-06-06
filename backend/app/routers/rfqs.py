from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user, RoleChecker
from app.models.models import User, UserRole, RFQStatus
from app.crud.rfq import rfq as crud_rfq
from app.schemas.rfq import RFQCreate, RFQResponse, RFQUpdate
from app.utils.pdf import generate_rfq_pdf

router = APIRouter()


@router.post("/", response_model=RFQResponse, status_code=status.HTTP_201_CREATED)
def create_rfq(
    *,
    db: Session = Depends(get_db),
    rfq_in: RFQCreate,
    current_user: User = Depends(RoleChecker([UserRole.ADMIN, UserRole.PROCUREMENT_OFFICER, UserRole.MANAGER]))
) -> Any:
    """
    Create a new RFQ. Restricted to Admin, Procurement Officer, or Manager.
    """
    return crud_rfq.create_with_owner(db, obj_in=rfq_in, owner_id=current_user.id)


@router.get("/", response_model=List[RFQResponse])
def read_rfqs(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Retrieve RFQs.
    - Admins, Managers, and Procurement Officers can see all RFQs.
    - Vendors can only see open RFQs.
    """
    if current_user.role in [UserRole.ADMIN, UserRole.PROCUREMENT_OFFICER, UserRole.MANAGER]:
        return crud_rfq.get_multi(db, skip=skip, limit=limit)
    else:
        return crud_rfq.get_open_rfqs(db, skip=skip, limit=limit)


@router.get("/{rfq_id}", response_model=RFQResponse)
def read_rfq_by_id(
    *,
    db: Session = Depends(get_db),
    rfq_id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get RFQ by ID.
    """
    db_rfq = crud_rfq.get(db, id=rfq_id)
    if not db_rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="RFQ not found"
        )
    if current_user.role == UserRole.VENDOR and db_rfq.status != RFQStatus.OPEN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vendors can only view open RFQs.",
        )
    return db_rfq


@router.get("/{rfq_id}/pdf")
def get_rfq_pdf(
    *,
    db: Session = Depends(get_db),
    rfq_id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Generate and download a PDF representation of the RFQ.
    """
    db_rfq = crud_rfq.get(db, id=rfq_id)
    if not db_rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="RFQ not found"
        )
    if current_user.role == UserRole.VENDOR and db_rfq.status != RFQStatus.OPEN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vendors can only download PDF for open RFQs.",
        )

    pdf_buffer = generate_rfq_pdf(
        rfq_title=db_rfq.title,
        rfq_desc=db_rfq.description or "",
        deadline_str=db_rfq.deadline.strftime("%Y-%m-%d %H:%M:%S") if db_rfq.deadline else "No Deadline",
    )

    filename = f"RFQ_{db_rfq.id}.pdf"
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.put("/{rfq_id}", response_model=RFQResponse)
def update_rfq(
    *,
    db: Session = Depends(get_db),
    rfq_id: int,
    rfq_in: RFQUpdate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Update RFQ. Only creator or admin can update.
    """
    db_rfq = crud_rfq.get(db, id=rfq_id)
    if not db_rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="RFQ not found"
        )
    if (
        current_user.role != UserRole.ADMIN
        and db_rfq.created_by != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough privileges"
        )
    return crud_rfq.update(db, db_obj=db_rfq, obj_in=rfq_in)


@router.delete("/{rfq_id}", response_model=RFQResponse)
def delete_rfq(
    *,
    db: Session = Depends(get_db),
    rfq_id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Delete RFQ. Only creator or admin can delete.
    """
    db_rfq = crud_rfq.get(db, id=rfq_id)
    if not db_rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="RFQ not found"
        )
    if (
        current_user.role != UserRole.ADMIN
        and db_rfq.created_by != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough privileges"
        )
    return crud_rfq.remove(db, id=rfq_id)
