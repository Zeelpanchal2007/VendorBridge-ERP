from typing import List
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.models import RFQ, RFQStatus
from app.schemas.rfq import RFQCreate, RFQUpdate


class CRUDRFQ(CRUDBase[RFQ, RFQCreate, RFQUpdate]):
    def create_with_owner(
        self, db: Session, *, obj_in: RFQCreate, owner_id: int
    ) -> RFQ:
        obj_in_data = obj_in.model_dump()
        db_obj = RFQ(**obj_in_data, created_by=owner_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi_by_owner(
        self, db: Session, *, owner_id: int, skip: int = 0, limit: int = 100
    ) -> List[RFQ]:
        return (
            db.query(RFQ)
            .filter(RFQ.created_by == owner_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_open_rfqs(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[RFQ]:
        return (
            db.query(RFQ)
            .filter(RFQ.status == RFQStatus.OPEN)
            .offset(skip)
            .limit(limit)
            .all()
        )


rfq = CRUDRFQ(RFQ)
