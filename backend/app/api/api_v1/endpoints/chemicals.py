from pydantic.main import BaseModel
from sqlalchemy.orm import Session
from starlette import status

from app import schemas
from app.db import chemical_crud, crud
from app.db.session import get_db
from app.prediction.prediction_engine import predict_knn
from app.schemas.chemicals import ChemicalCreate, Chemical
from fastapi import APIRouter, Depends, Query, HTTPException

from typing import List

router = APIRouter()

# in-memory while waiting for DB
# chem1 = Chemical(id=1, code="NCGC00091441-01", smiles="[H][C@]12CC[C@H](C)CN1[C@@]3([H])C[C@@]4([H])[C@]5([H])CC=C6CC(CC[C@]6(C)[C@@]5([H])CC[C@]4(C)[C@@]3([H])[C@@H]2C)O[C@@H]7O[C@H](CO)[C@H](O)[C@H](O[C@@H]8O[C@H](CO)[C@@H](O)[C@H](O)[C@H]8O)[C@H]7O[C@H]9O[C@@H](C)[C@H](O)[C@@H](O)[C@H]9O", label=0)
# chem2 = Chemical(id=2, code="NCGC00181104-01", smiles="[I-].CCN1C(SC2=C1C=CC=C2)=CC=CC=CC3=[N+](CC)C4=C(S3)C=CC=C4", label=0)
# chem3 = Chemical(id=3, code="NCGC00018301-02", smiles="CCCCCCCCNC(C)C(O)C1=CC=C(SC(C)C)C=C1", label=0)
# chem4 = Chemical(id=4, code="NCGC00091112-02", smiles="[Cl-].CN(C)C1=CC=C(C=C1)C(C2=CC=C(C=C2)N(C)C)=C3C=CC(C=C3)=[N+](C)C", label=1)
#
# chemicals = [chem1, chem2, chem3, chem4]


@router.get("/", response_model=List[schemas.Chemical])
async def get_chemicals(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):

    return chemical_crud.get_chemicals(db, skip, limit)


@router.get("/codes/{code}", response_model=schemas.Chemical)
async def get_chemical_by_code(
        code: str,
        db: Session = Depends(get_db)
):
    return chemical_crud.get_chemical_by_code(db, code)


@router.get("/smiles/{smiles}", response_model=List[schemas.Chemical])
async def get_chemicals_by_smiles(
    smiles: str,
    db: Session = Depends(get_db)
):
    chemicals = chemical_crud.get_all_chemicals_by_smiles(db, smiles)

    return chemicals


class PredictionAnswer(BaseModel):
    chemical: Chemical
    new: bool


@router.post("/smiles/{smiles}", response_model=PredictionAnswer)
async def predict_chemical_toxicity(
    smiles: str,
    db: Session = Depends(get_db)
):
    chemical = chemical_crud.get_chemical_by_smiles(db, smiles)

    if chemical is not None:
        return PredictionAnswer(chemical=chemical, new=False)

    label = predict_knn(smiles)

    chem = ChemicalCreate(smiles=smiles, predicted=True, label=label)

    try:
        chem_db = chemical_crud.create_chemical(db, chem)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='DB Error'
        )


    return PredictionAnswer(chemical=chem_db, new=True)


# @router.post("/", response_model=schemas.Chemical)
# async def submit_chemical(chem_input: ChemicalCreate):
#     # id and owner_id are temporary while waiting for db
#     chem = Chemical(id=1, owner_id=1, code=chem_input.code, smiles=chem_input.smiles, label=False)
#     chemicals.append(chem)
#     return chem
