from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.models import Quotation
from app.schemas.quotation import QuotationCreate, QuotationUpdate
from typing import List


class CRUDQuotation(CRUDBase[Quotation, QuotationCreate, QuotationUpdate]):
    def get_multi_by_rfq(
        self, db: Session, *, rfq_id: int, skip: int = 0, limit: int = 100
    ) -> List[Quotation]:
        return (
            db.query(Quotation)
            .filter(Quotation.rfq_id == rfq_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_multi_by_vendor(
        self, db: Session, *, vendor_id: int, skip: int = 0, limit: int = 100
    ) -> List[Quotation]:
        return (
            db.query(Quotation)
            .filter(Quotation.vendor_id == vendor_id)
            .offset(skip)
            .limit(limit)
            .all()
        )


quotation = CRUDQuotation(Quotation)
