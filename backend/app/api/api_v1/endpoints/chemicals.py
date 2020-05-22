from typing import List

from fastapi import APIRouter

from app import schemas
from app.schemas.chemicals import ChemicalCreate, Chemical

router = APIRouter()

# in-memory while waiting for DB
chem1 = Chemical(id=1, owner_id=1, code="NCGC00091441-01", smiles="[H][C@]12CC[C@H](C)CN1[C@@]3([H])C[C@@]4([H])[C@]5([H])CC=C6CC(CC[C@]6(C)[C@@]5([H])CC[C@]4(C)[C@@]3([H])[C@@H]2C)O[C@@H]7O[C@H](CO)[C@H](O)[C@H](O[C@@H]8O[C@H](CO)[C@@H](O)[C@H](O)[C@H]8O)[C@H]7O[C@H]9O[C@@H](C)[C@H](O)[C@@H](O)[C@H]9O", label=False)
chem2 = Chemical(id=2, owner_id=1, code="NCGC00181104-01", smiles="[I-].CCN1C(SC2=C1C=CC=C2)=CC=CC=CC3=[N+](CC)C4=C(S3)C=CC=C4", label=False)
chem3 = Chemical(id=3, owner_id=1, code="NCGC00018301-02", smiles="CCCCCCCCNC(C)C(O)C1=CC=C(SC(C)C)C=C1", label=False)
chem4 = Chemical(id=4, owner_id=1, code="NCGC00091112-02", smiles="[Cl-].CN(C)C1=CC=C(C=C1)C(C2=CC=C(C=C2)N(C)C)=C3C=CC(C=C3)=[N+](C)C", label=True)

chemicals = [chem1, chem2, chem3, chem4]


@router.get("/", response_model=List[schemas.Chemical])
async def get_chemical():
    return chemicals


@router.get("/{chem_id}", response_model=schemas.Chemical)
async def get_chemical(
        chem_id: int
):
    return next((x for x in chemicals if x.id == chem_id), None)


@router.get("/codes/{code}", response_model=schemas.Chemical)
async def get_chemical(
        code: str
):
    return next((x for x in chemicals if x.code == code), None)


@router.get("/smiles/{smiles}", response_model=schemas.Chemical)
async def get_chemical(
        smiles: str
):
    return next((x for x in chemicals if x.smiles == smiles), None)


@router.post("/", response_model=schemas.Chemical)
async def submit_chemical(chem_input: ChemicalCreate):
    # id and owner_id are temporary while waiting for db
    chem = Chemical(id=1, owner_id=1, code=chem_input.code, smiles=chem_input.smiles, label=False)
    chemicals.append(chem)
    return chem
