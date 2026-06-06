from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum
from ..core.database import Base

# Enums
class UserRole(str, enum.Enum):
    ADMIN = "admin"
    PROCUREMENT_OFFICER = "procurement_officer"
    MANAGER = "manager"
    VENDOR = "vendor"

class RFQStatus(str, enum.Enum):
    DRAFT = "draft"
    OPEN = "open"
    CLOSED = "closed"
    APPROVED = "approved"

class QuotationStatus(str, enum.Enum):
    PENDING = "pending"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"

# ====================== MODELS ======================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.PROCUREMENT_OFFICER)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    rfqs_created = relationship("RFQ", back_populates="created_by_user", foreign_keys="RFQ.created_by")
    approvals_made = relationship("Approval", back_populates="approver")


class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    gst_number = Column(String, unique=True)
    contact_person = Column(String)
    email = Column(String, unique=True)
    phone = Column(String)
    address = Column(Text)
    category = Column(String)  # e.g., "Electronics", "Raw Material"
    status = Column(String, default="active")  # active, inactive
    rating = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class RFQ(Base):
    __tablename__ = "rfqs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    deadline = Column(DateTime)
    status = Column(SQLEnum(RFQStatus), default=RFQStatus.OPEN)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    created_by_user = relationship("User", back_populates="rfqs_created")
    items = relationship("RFQItem", back_populates="rfq", cascade="all, delete-orphan")
    quotations = relationship("Quotation", back_populates="rfq")


class RFQItem(Base):
    __tablename__ = "rfq_items"

    id = Column(Integer, primary_key=True, index=True)
    rfq_id = Column(Integer, ForeignKey("rfqs.id"))
    product_name = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    description = Column(Text)
    unit_price_estimate = Column(Float)

    rfq = relationship("RFQ", back_populates="items")


class Quotation(Base):
    __tablename__ = "quotations"

    id = Column(Integer, primary_key=True, index=True)
    rfq_id = Column(Integer, ForeignKey("rfqs.id"))
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    total_amount = Column(Float)
    delivery_days = Column(Integer)
    notes = Column(Text)
    status = Column(SQLEnum(QuotationStatus), default=QuotationStatus.PENDING)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())

    rfq = relationship("RFQ", back_populates="quotations")
    vendor = relationship("Vendor")
    approval = relationship("Approval", back_populates="quotation", uselist=False)


class Approval(Base):
    __tablename__ = "approvals"

    id = Column(Integer, primary_key=True, index=True)
    quotation_id = Column(Integer, ForeignKey("quotations.id"), unique=True)
    approver_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="pending")  # pending, approved, rejected
    remarks = Column(Text)
    approved_at = Column(DateTime(timezone=True), nullable=True)

    quotation = relationship("Quotation", back_populates="approval")
    approver = relationship("User", back_populates="approvals_made")


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    po_number = Column(String, unique=True)
    quotation_id = Column(Integer, ForeignKey("quotations.id"))
    total_amount = Column(Float)
    status = Column(String, default="issued")
    issued_at = Column(DateTime(timezone=True), server_default=func.now())

    quotation = relationship("Quotation")


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String, unique=True)
    po_id = Column(Integer, ForeignKey("purchase_orders.id"))
    total_amount = Column(Float)
    tax_amount = Column(Float, default=0.0)
    status = Column(String, default="generated")
    generated_at = Column(DateTime(timezone=True), server_default=func.now())

    purchase_order = relationship("PurchaseOrder")
