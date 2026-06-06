from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.models import PurchaseOrder
from app.schemas.po import PurchaseOrderCreate, PurchaseOrderUpdate


class CRUDPurchaseOrder(CRUDBase[PurchaseOrder, PurchaseOrderCreate, PurchaseOrderUpdate]):
    def get_by_po_number(self, db: Session, *, po_number: str) -> PurchaseOrder | None:
        return db.query(PurchaseOrder).filter(PurchaseOrder.po_number == po_number).first()


po = CRUDPurchaseOrder(PurchaseOrder)
