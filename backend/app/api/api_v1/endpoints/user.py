from typing import List, Any

from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.orm import Session

from app import schemas, models
from app.api import deps
from app.core import config
from app.db.crud import create_user, get_user_by_email
from app.schemas import User

router = APIRouter()

admin = User(
    id=1,
    email='test@test.de',
    full_name='Max Mustermann',
    is_active=True,
    is_admin=True,
    organization='FHWS',
    password='admin'
)

users = [admin]


@router.get("/", response_model=List[schemas.User])
async def get_all_users(
        db: Session = Depends(deps.get_db),
        skip: int = 0,
        limit: int = 100,
):
    return users
    # return get_users(db, skip, limit)


@router.get("/{user_id}", response_model=schemas.User)
def read_user_by_id(
    user_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
) -> Any:
    user = next((x for x in users if x.id == user_id), None)
    # user = get_user(db, user_id=user_id)
    if user == current_user:
        return user
    if current_user.is_admin is False:
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return user


@router.post("/", response_model=schemas.User)
async def create_new_user(
        *,
        db: Session = Depends(deps.get_db),
        user_create: schemas.UserCreate
) -> Any:

    user = next((x for x in users if x.email == user_create.email), None)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    # user = create_user(db, user)
    user = User(
        id=1,
        email=user_create.email,
        full_name=user_create.full_name,
        is_active=user_create.is_active,
        is_admin=user_create.is_admin,
        organization=user_create.organization,
        password=user_create.password
    )
    users.append(user)
    return user


@router.post("/open", response_model=schemas.User)
def create_user_open(
    *,
    db: Session = Depends(deps.get_db),
    password: str = Body(...),
    email: str = Body(...),
    full_name: str = Body(None),
) -> Any:
    """
    Create new user without the need to be logged in.
    """
    if not config.USERS_OPEN_REGISTRATION:
        raise HTTPException(
            status_code=403,
            detail="Open user registration is forbidden on this server",
        )
    user = get_user_by_email(db, email=email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system",
        )
    user_in = schemas.UserCreate(password=password, email=email, full_name=full_name)
    user = create_user(db, user=user_in)
    return user


@router.put("/{user_id}", response_model=schemas.User)
async def update_user(
        *,
        db: Session = Depends(deps.get_db),
        user_id: int,
        user_in: schemas.UserUpdate,
):
    print("Not implemented")


@router.put("/me", response_model=schemas.User)
def update_user_me(
    *,
    db: Session = Depends(deps.get_db),
    password: str = Body(None),
    full_name: str = Body(None),
    email: str = Body(None),
    # current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update own user.
    """
