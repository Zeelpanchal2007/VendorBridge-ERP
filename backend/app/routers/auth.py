from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.config import settings
from app.dependencies.database import get_db
from app.crud.user import user as crud_user
from app.schemas.user import UserCreate, UserResponse
from app.schemas.token import Token
from app.utils.auth import create_access_token

router = APIRouter()


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate
) -> Any:
    """
    Create a new user account (Signup).
    Supports roles: admin, procurement_officer, manager, vendor.
    """
    # Verify if user already exists
    user = crud_user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists in the system.",
        )
    
    # Create the user using CRUD layer
    new_user = crud_user.create(db, obj_in=user_in)
    return new_user


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_alias(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate
) -> Any:
    """
    Alias endpoint for signup (backward compatibility).
    """
    return signup(db=db, user_in=user_in)


@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login. Get an access token for future requests.
    This endpoint is used by Swagger UI (/docs) via the Authorize dialog.
    """
    # Authenticate the user credentials
    user = crud_user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User account is inactive",
        )
    
    # Expiration delta calculation
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Generate the access token (claims include sub and role)
    token = create_access_token(
        subject=user.id,
        role=user.role.value,
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": token,
        "token_type": "bearer",
    }
