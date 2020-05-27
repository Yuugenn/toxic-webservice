from typing import Optional

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: Optional[str] = None
    is_active: Optional[bool] = True
    is_admin: bool = False
    full_name: Optional[str] = None
    organization: Optional[str] = None


# Properties to receive via API on creation
class UserCreate(UserBase):
    email: str
    password: str
    full_name: str
    organization: str


# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = None


class UserInDBBase(UserBase):
    id: Optional[int] = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class User(UserInDBBase):
    pass


# Additional properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str
