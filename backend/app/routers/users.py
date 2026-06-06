from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user, RoleChecker
from app.models.models import User, UserRole
from app.crud.user import user as crud_user
from app.schemas.user import UserResponse, UserUpdate

router = APIRouter()


@router.get("/me", response_model=UserResponse)
def read_user_me(
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get current user profile.
    """
    return current_user


@router.put("/me", response_model=UserResponse)
def update_user_me(
    *,
    db: Session = Depends(get_db),
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Update own user profile.
    """
    return crud_user.update(db, db_obj=current_user, obj_in=user_in)


@router.get("/", response_model=List[UserResponse])
def read_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(RoleChecker([UserRole.ADMIN])),
) -> Any:
    """
    Retrieve all users. Admin only.
    """
    return crud_user.get_multi(db, skip=skip, limit=limit)
