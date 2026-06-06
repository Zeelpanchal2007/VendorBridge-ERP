from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user, RoleChecker
from app.models.models import User, UserRole, Vendor
from app.crud.vendor import vendor as crud_vendor
from app.schemas.vendor import VendorCreate, VendorResponse, VendorUpdate

router = APIRouter()


@router.post("/", response_model=VendorResponse, status_code=status.HTTP_201_CREATED)
def create_vendor(
    *,
    db: Session = Depends(get_db),
    vendor_in: VendorCreate,
    current_user: User = Depends(RoleChecker([UserRole.ADMIN, UserRole.PROCUREMENT_OFFICER, UserRole.MANAGER]))
) -> Any:
    """
    Create a new vendor profile. Restricted to Admin, Procurement Officer, or Manager.
    """
    existing_vendor = crud_vendor.get_by_name(db, name=vendor_in.name)
    if existing_vendor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A vendor with this name already exists.",
        )
    return crud_vendor.create(db, obj_in=vendor_in)


@router.get("/", response_model=List[VendorResponse])
def read_vendors(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Retrieve vendors. All authenticated users can view the directory.
    """
    return crud_vendor.get_multi(db, skip=skip, limit=limit)


@router.get("/{vendor_id}", response_model=VendorResponse)
def read_vendor_by_id(
    *,
    db: Session = Depends(get_db),
    vendor_id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get vendor profile by ID.
    """
    db_vendor = crud_vendor.get(db, id=vendor_id)
    if not db_vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Vendor not found"
        )
    return db_vendor


@router.put("/{vendor_id}", response_model=VendorResponse)
def update_vendor(
    *,
    db: Session = Depends(get_db),
    vendor_id: int,
    vendor_in: VendorUpdate,
    current_user: User = Depends(RoleChecker([UserRole.ADMIN, UserRole.PROCUREMENT_OFFICER, UserRole.MANAGER]))
) -> Any:
    """
    Update vendor profile. Restricted to Admin, Procurement Officer, or Manager.
    """
    db_vendor = crud_vendor.get(db, id=vendor_id)
    if not db_vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Vendor not found"
        )

    # Status and Rating updates are ignored in this route; only changed via status endpoint or rating calculations
    if vendor_in.status:
        vendor_in.status = None
    if vendor_in.rating:
        vendor_in.rating = None

    return crud_vendor.update(db, db_obj=db_vendor, obj_in=vendor_in)


@router.patch("/{vendor_id}/status", response_model=VendorResponse)
def change_vendor_status(
    *,
    db: Session = Depends(get_db),
    vendor_id: int,
    status: str,  # active, inactive
    current_user: User = Depends(RoleChecker([UserRole.ADMIN, UserRole.MANAGER]))
) -> Any:
    """
    Approve/activate or deactivate a vendor profile (Admin/Manager only).
    """
    db_vendor = crud_vendor.get(db, id=vendor_id)
    if not db_vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Vendor not found"
        )
    if status not in ["active", "inactive"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status. Allowed values: active, inactive",
        )
    return crud_vendor.update(db, db_obj=db_vendor, obj_in={"status": status})
