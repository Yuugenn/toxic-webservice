from typing import Optional

from pydantic.main import BaseModel


# Shared properties
class ChemicalBase(BaseModel):
    code: Optional[str] = None
    smiles: Optional[str] = None
    label: Optional[bool] = None


# Properties to receive on item creation
class ChemicalCreate(ChemicalBase):
    code: str
    smiles: str


# Properties shared by models stored in DB
class ChemicalInDBBase(ChemicalBase):
    id: int
    code: str
    smiles: str
    label: bool
    owner_id: int

    class Config:
        orm_mode = True


# Properties to return to client
class Chemical(ChemicalInDBBase):
    pass


# Properties properties stored in DB
class ChemicalInDB(ChemicalInDBBase):
    pass
