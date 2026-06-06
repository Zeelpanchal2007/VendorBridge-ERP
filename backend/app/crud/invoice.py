from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.models import Invoice, PurchaseOrder
from app.schemas.invoice import InvoiceCreate, InvoiceUpdate


class CRUDInvoice(CRUDBase[Invoice, InvoiceCreate, InvoiceUpdate]):
    def create_from_po(self, db: Session, *, po: PurchaseOrder, tax_rate: float = 0.18) -> Invoice:
        tax_amount = po.total_amount * tax_rate
        db_obj = Invoice(
            invoice_number=f"INV-{po.po_number}",
            po_id=po.id,
            total_amount=po.total_amount + tax_amount,
            tax_amount=tax_amount,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


invoice = CRUDInvoice(Invoice)
