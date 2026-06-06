from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.models import RFQ, RFQItem
from app.schemas.rfq import RFQCreate, RFQUpdate
from typing import List


class CRUDRFQ(CRUDBase[RFQ, RFQCreate, RFQUpdate]):
    def create_with_items(self, db: Session, *, obj_in: RFQCreate, created_by: int) -> RFQ:
        db_obj = RFQ(
            title=obj_in.title,
            description=obj_in.description,
            deadline=obj_in.deadline,
            status=obj_in.status,
            created_by=created_by,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        
        for item_in in obj_in.items:
            db_item = RFQItem(
                rfq_id=db_obj.id,
                product_name=item_in.product_name,
                quantity=item_in.quantity,
                description=item_in.description,
                unit_price_estimate=item_in.unit_price_estimate,
            )
            db.add(db_item)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi_by_creator(
        self, db: Session, *, created_by: int, skip: int = 0, limit: int = 100
    ) -> List[RFQ]:
        return (
            db.query(RFQ)
            .filter(RFQ.created_by == created_by)
            .offset(skip)
            .limit(limit)
            .all()
        )


rfq = CRUDRFQ(RFQ)
