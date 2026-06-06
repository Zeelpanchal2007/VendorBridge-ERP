from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.models import Vendor
from app.schemas.vendor import VendorCreate, VendorUpdate


class CRUDVendor(CRUDBase[Vendor, VendorCreate, VendorUpdate]):
    def get_by_gst(self, db: Session, *, gst_number: str) -> Vendor | None:
        return db.query(Vendor).filter(Vendor.gst_number == gst_number).first()

    def get_by_email(self, db: Session, *, email: str) -> Vendor | None:
        return db.query(Vendor).filter(Vendor.email == email).first()


vendor = CRUDVendor(Vendor)
