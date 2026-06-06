from fastapi import APIRouter

from app.routers import auth, users, vendors, rfqs

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(vendors.router, prefix="/vendors", tags=["vendors"])
api_router.include_router(rfqs.router, prefix="/rfqs", tags=["rfqs"])
