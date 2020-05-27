from typing import Optional

from pydantic.main import BaseModel


# Shared properties
class OrganizationBase(BaseModel):
    name: Optional[str] = None


# Properties to receive on item creation
class OrganizationCreate(OrganizationBase):
    name: str


# Properties shared by models stored in DB
class OrganizationInDBBase(OrganizationBase):
    id: int
    name: str

    class Config:
        orm_mode = True


class Organization(OrganizationInDBBase):
    pass
