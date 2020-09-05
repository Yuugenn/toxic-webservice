import traceback
from enum import Enum

from fastapi import HTTPException
from joblib import load
from rdkit import Chem
from rdkit.Chem import AllChem
import numpy as np
from starlette import status

cnb_model = load('ComplementNaiveBayes.joblib')
gnb_model = load('GaussianNaiveBayes.joblib')


class MlModel(Enum):
    CNB = "CNB"
    GNB = "GNB"


def predict_with_model(smiles: str, model: MlModel):
    try:
        mol = Chem.MolFromSmiles(smiles)
        bit_vector = AllChem.GetMorganFingerprintAsBitVect(mol, 2, nBits=1024)

        if model == MlModel.CNB:
            predicted = cnb_model.predict([np.asarray(bit_vector)])
        else:
            predicted = gnb_model.predict([np.asarray(bit_vector)])
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Error during toxicity prediction. The smiles code was probably invalid'
        )

    return predicted[0]
