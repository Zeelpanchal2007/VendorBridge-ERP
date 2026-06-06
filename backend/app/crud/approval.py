from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.models import Approval, QuotationStatus
from app.schemas.approval import ApprovalCreate, ApprovalUpdate
from app.crud.quotation import quotation as crud_quotation
from app.crud.po import po as crud_po
from app.schemas.po import PurchaseOrderCreate
import uuid
from datetime import datetime


class CRUDApproval(CRUDBase[Approval, ApprovalCreate, ApprovalUpdate]):
    def create_and_process(
        self, db: Session, *, obj_in: ApprovalCreate, approver_id: int
    ) -> Approval:
        # Create approval record
        db_obj = Approval(
            quotation_id=obj_in.quotation_id,
            approver_id=approver_id,
            status=obj_in.status,
            remarks=obj_in.remarks,
            approved_at=datetime.utcnow() if obj_in.status == "approved" else None
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        # Update quotation status
        quotation = crud_quotation.get(db, id=obj_in.quotation_id)
        if quotation:
            q_status = QuotationStatus.APPROVED if obj_in.status == "approved" else QuotationStatus.REJECTED
            crud_quotation.update(db, db_obj=quotation, obj_in={"status": q_status})

            # Auto-generate PO if approved
            if obj_in.status == "approved":
                po_in = PurchaseOrderCreate(
                    po_number=f"PO-{uuid.uuid4().hex[:8].upper()}",
                    quotation_id=quotation.id,
                    total_amount=quotation.total_amount,
                )
                crud_po.create(db, obj_in=po_in)

        return db_obj


approval = CRUDApproval(Approval)
