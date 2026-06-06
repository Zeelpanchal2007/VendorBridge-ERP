from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user, RoleChecker
from app.models.models import User, UserRole
from app.schemas.vendor import VendorCreate, VendorUpdate, VendorResponse
from app.crud.vendor import vendor as crud_vendor

router = APIRouter()

# Allow procurement officers and admins to manage vendors
allow_procurement = RoleChecker([UserRole.PROCUREMENT_OFFICER, UserRole.ADMIN])

@router.post("/", response_model=VendorResponse, status_code=status.HTTP_201_CREATED)
def create_vendor(
    *,
    db: Session = Depends(get_db),
    vendor_in: VendorCreate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """Create a new vendor."""
    existing_vendor = crud_vendor.get_by_email(db, email=vendor_in.email)
    if existing_vendor:
        raise HTTPException(status_code=400, detail="Vendor with this email already exists.")
    return crud_vendor.create(db, obj_in=vendor_in)

@router.get("/", response_model=List[VendorResponse])
def read_vendors(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
) -> Any:
    """Retrieve vendors."""
    vendors = crud_vendor.get_multi(db, skip=skip, limit=limit)
    return vendors

@router.get("/{id}", response_model=VendorResponse)
def read_vendor(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get a specific vendor by ID."""
    vendor_obj = crud_vendor.get(db, id=id)
    if not vendor_obj:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor_obj

@router.put("/{id}", response_model=VendorResponse)
def update_vendor(
    *,
    db: Session = Depends(get_db),
    id: int,
    vendor_in: VendorUpdate,
    current_user: User = Depends(allow_procurement)
) -> Any:
    """Update a vendor."""
    vendor_obj = crud_vendor.get(db, id=id)
    if not vendor_obj:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return crud_vendor.update(db, db_obj=vendor_obj, obj_in=vendor_in)

@router.delete("/{id}", response_model=VendorResponse)
def delete_vendor(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(allow_procurement)
) -> Any:
    """Delete a vendor."""
    vendor_obj = crud_vendor.get(db, id=id)
    if not vendor_obj:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return crud_vendor.remove(db, id=id)
