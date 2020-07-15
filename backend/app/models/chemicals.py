from sqlalchemy import Boolean, Column, Integer, String

from app.db.session import Base


class Chemical(Base):
    __tablename__ = "chemicals"

    id = Column(Integer, primary_key=True, index=True)
    smiles = Column(String)
    code = Column(String, unique=True)
    label = Column(Integer)
    predicted = Column(Boolean)


