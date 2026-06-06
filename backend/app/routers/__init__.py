from fastapi import APIRouter

from app.routers import (
    auth, 
    users, 
    vendors, 
    rfqs, 
    quotations, 
    approvals, 
    purchase_orders, 
    invoices
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(vendors.router, prefix="/vendors", tags=["vendors"])
api_router.include_router(rfqs.router, prefix="/rfqs", tags=["rfqs"])
api_router.include_router(quotations.router, prefix="/quotations", tags=["quotations"])
api_router.include_router(approvals.router, prefix="/approvals", tags=["approvals"])
api_router.include_router(purchase_orders.router, prefix="/purchase-orders", tags=["purchase_orders"])
api_router.include_router(invoices.router, prefix="/invoices", tags=["invoices"])
