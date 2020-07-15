import traceback

from fastapi import HTTPException
from joblib import load
from rdkit import Chem
from rdkit.Chem import AllChem
import numpy as np
from starlette import status

knn_model = load('model.joblib')


def predict_knn(smiles: str):
    try:
        mol = Chem.MolFromSmiles(smiles)
        bit_vector = AllChem.GetMorganFingerprintAsBitVect(mol, 2, nBits=1024)
        predicted = knn_model.predict([np.asarray(bit_vector)])
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=traceback.format_exc()
        )

    return predicted[0]
