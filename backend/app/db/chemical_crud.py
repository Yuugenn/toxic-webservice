from sqlalchemy.orm import Session

from ..models import Chemical
from ..schemas import ChemicalCreate


def get_chemical(db: Session, chemical_id: int):
    return db.query(Chemical).filter(Chemical.id == chemical_id).first()


def get_all_chemicals_by_smiles(db: Session, smiles: str):
    return get_by_smiles_query(db, smiles).all()


def get_chemical_by_smiles(db: Session, smiles: str):
    return get_by_smiles_query(db, smiles).first()


def get_by_smiles_query(db: Session, smiles: str):
    return db.query(Chemical).filter(Chemical.smiles == smiles)


def get_chemical_by_code(db: Session, code: str):
    return db.query(Chemical).filter(Chemical.code == code).first()


def get_chemicals(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Chemical).offset(skip).limit(limit).all()


def create_chemical(db: Session, chemical: ChemicalCreate):
    db_chemical = Chemical(
        smiles=chemical.smiles,
        predicted=chemical.predicted,
        label=chemical.label
    )
    db.add(db_chemical)
    db.commit()
    db.refresh(db_chemical)
    return db_chemical


def update_chemical(db: Session, smiles: str, label: int):
    get_by_smiles_query(db, smiles).update({Chemical.label: label, Chemical.predicted: False})
    db.commit()




