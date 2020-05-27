from sqlalchemy import Boolean, Column, Integer, String

from app.db.session import Base


class Chemicals(Base):
    __tablename__ = "ToxTable"

    id = Column(Integer, primary_key=True, index=True)
    smiles = Column(String)
    code = Column(String, unique=True, index=True)
    label = Column(Integer)
    owner_id = Column(Integer)


