from pydantic.main import BaseModel
from sqlalchemy.orm import Session
from starlette import status

from app import schemas
from app.api.user_management import User, get_current_user
from app.db import chemicals_crud
from app.db.session import get_db
from app.prediction.prediction_engine import predict_knn, predict_new, MlModel
from app.db.chemicals_schema import ChemicalCreate, Chemical
from fastapi import APIRouter, Depends, Query, HTTPException

from typing import List

router = APIRouter()


@router.get("/", response_model=List[Chemical])
async def get_chemicals(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
        skip: int = Query(0, ge=0),
        limit: int = Query(10, ge=1, le=100)
):
    return chemicals_crud.get_chemicals(db, skip, limit)


@router.get("/codes/{code}", response_model=Chemical)
async def get_chemical_by_code(
        code: str,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    return chemicals_crud.get_chemical_by_code(db, code)


@router.get("/smiles/{smiles}", response_model=List[Chemical])
async def get_chemicals_by_smiles(
        smiles: str,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    chemicals = chemicals_crud.get_all_chemicals_by_smiles(db, smiles)

    return chemicals


class PredictionAnswer(BaseModel):
    chemical: Chemical
    new: bool


@router.post("/smiles/{smiles}", response_model=PredictionAnswer)
async def predict_chemical_toxicity(
        smiles: str,
        model: MlModel,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
):
    chemical = chemicals_crud.get_chemical_by_smiles(db, smiles)

    if chemical is not None:
        return PredictionAnswer(chemical=chemical, new=False)

    label = predict_new(smiles, MlModel.CNB)

    chem = ChemicalCreate(smiles=smiles, predicted=True, label=label)
    chem_db = chemicals_crud.create_chemical(db, chem)

    return PredictionAnswer(chemical=chem_db, new=True)


@router.put("/smiles/{smiles}", response_model=PredictionAnswer)
async def predict_chemical_toxicity(
        smiles: str,
        label: int = Query(..., ge=0, le=1),
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    if current_user.role == "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid permissions.",
        )
    chemicals_crud.update_chemical(db, smiles, label)

    chem_db = chemicals_crud.get_chemical_by_smiles(db, smiles)
    return PredictionAnswer(chemical=chem_db, new=False)

