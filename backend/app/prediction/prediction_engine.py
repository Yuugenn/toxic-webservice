from joblib import load
from rdkit import Chem
from rdkit.Chem import AllChem
import numpy as np

knn_model = load('model.joblib')


def predict_knn(smiles: str):
    mol = Chem.MolFromSmiles(smiles)
    bit_vector = AllChem.GetMorganFingerprintAsBitVect(mol, 2, nBits=1024)
    predicted = knn_model.predict([np.asarray(bit_vector)])
    return predicted[0]
