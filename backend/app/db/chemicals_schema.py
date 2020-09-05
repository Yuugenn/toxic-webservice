from typing import Optional

from pydantic.main import BaseModel


# Shared properties
class ChemicalBase(BaseModel):
    code: Optional[str] = None
    smiles: str
    label: int
    predicted: bool


# Properties to receive on item creation
class ChemicalCreate(ChemicalBase):
    smiles: str
    label: int
    predicted: bool


# Properties shared by models stored in DB
class ChemicalInDBBase(ChemicalBase):
    id: int
    code: Optional[str] = None
    smiles: str
    label: int
    predicted: bool

    class Config:
        orm_mode = True


# Properties to return to client
class Chemical(ChemicalInDBBase):
    pass


# Properties properties stored in DB
class ChemicalInDB(ChemicalInDBBase):
    pass
