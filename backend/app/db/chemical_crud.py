from sqlalchemy.orm import Session

from ..models import Chemicals


def get_chemical(db: Session, chemical_id: int):
    return db.query(Chemicals).filter(Chemicals.id == chemical_id).first()

