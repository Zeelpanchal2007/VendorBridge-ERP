from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.models import Vendor
from app.schemas.vendor import VendorCreate, VendorUpdate


class CRUDVendor(CRUDBase[Vendor, VendorCreate, VendorUpdate]):
    def get_by_name(self, db: Session, *, name: str) -> Vendor | None:
        return db.query(Vendor).filter(Vendor.name == name).first()


vendor = CRUDVendor(Vendor)
