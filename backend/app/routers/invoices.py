from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user, RoleChecker
from app.models.models import User, UserRole
from app.schemas.invoice import InvoiceCreate, InvoiceResponse
from app.crud.invoice import invoice as crud_invoice
from app.crud.po import po as crud_po
from app.utils.pdf import generate_invoice_pdf

router = APIRouter()

allow_vendors_and_finance = RoleChecker([UserRole.VENDOR, UserRole.ADMIN, UserRole.MANAGER, UserRole.PROCUREMENT_OFFICER])

@router.post("/from-po/{po_id}", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED)
def generate_invoice(
    *,
    db: Session = Depends(get_db),
    po_id: int,
    current_user: User = Depends(allow_vendors_and_finance)
) -> Any:
    """Generate an invoice from an existing PO with tax calculations."""
    po_obj = crud_po.get(db, id=po_id)
    if not po_obj:
        raise HTTPException(status_code=404, detail="PO not found")
    
    return crud_invoice.create_from_po(db, po=po_obj)

@router.get("/", response_model=List[InvoiceResponse])
def read_invoices(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
) -> Any:
    """List invoices."""
    return crud_invoice.get_multi(db, skip=skip, limit=limit)

@router.get("/{id}/pdf")
def download_invoice_pdf(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """Download invoice as a beautifully formatted PDF."""
    invoice_obj = crud_invoice.get(db, id=id)
    if not invoice_obj:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    po_obj = crud_po.get(db, id=invoice_obj.po_id)
    
    pdf_buffer = generate_invoice_pdf(
        invoice_number=invoice_obj.invoice_number,
        po_number=po_obj.po_number,
        amount=invoice_obj.total_amount,
        tax=invoice_obj.tax_amount
    )
    
    return StreamingResponse(
        pdf_buffer, 
        media_type="application/pdf", 
        headers={"Content-Disposition": f"attachment; filename=Invoice_{invoice_obj.invoice_number}.pdf"}
    )
