import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import api_router

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI App
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for VendorBridge - RFQ and Vendor Management System",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Set up CORS middleware
# Reads from configuration settings or defaults to allow typical dev ports
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Domain API Routers
app.include_router(api_router, prefix=settings.API_V1_STR)


# Simple Root Endpoint
@app.get("/", tags=["health"])
def root() -> dict[str, str]:
    """
    Root endpoint verifying the API status.
    """
    return {"message": "VendorBridge Backend is running"}
