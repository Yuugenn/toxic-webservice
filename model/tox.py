# Installieren:
# conda create -c rdkit -n my-rdkit-env rdkit


# In Anaconda zur Environment wechseln:
# conda activate my-rdkit-env
#
# Von hier aus das Skript starten:
# python tox.py


from joblib import dump

from rdkit import Chem, DataStructs
from rdkit.Chem import AllChem

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import KFold, train_test_split
from sklearn.naive_bayes import GaussianNB, MultinomialNB, ComplementNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC, LinearSVC
from sklearn.tree import DecisionTreeClassifier

import csv, math, numpy as np


chemicals = []


with open('tox_21_66000.csv') as csvfile:

    readCSV = csv.reader( csvfile, delimiter=',' )
    
    next( readCSV, None )  # skip header
    
    for row in readCSV:
    
        # row[0]: no
        # row[1]: smiles
        # row[2]: code
        # row[3]: label (0 = nicht giftig, 1 = giftig)

        isInArrayChemicals = False

        for chemical in chemicals:

            if row[1] == chemical[0]:  # same smiles

                isInArrayChemicals = True

                if row[3] == "1":

                    chemical[1] = "1"

        if not isInArrayChemicals:

            chemicals.append([ row[1], row[3] ])


bitVects = []
labels   = []


for chemical in chemicals:

    # chemical[0]: smiles
    # chemical[1]: label (0 = nicht giftig, 1 = giftig)

    try:

        mol = Chem.MolFromSmiles( chemical[0] )
        bitVect = AllChem.GetMorganFingerprintAsBitVect( mol, 2, nBits=1024 )

        bitVects.append( np.asarray(bitVect) )
        labels.append( int(chemical[1]) )

    except Exception as e:

        print( f"Fehler bei {chemical[0]}" )


def count( labels ):

    not_toxic = 0
    toxic = 0
    
    for el in labels:

        if el == 0:

            not_toxic = not_toxic + 1

        elif el == 1:

            toxic = toxic + 1

    print( f"Nicht giftig: {not_toxic}" )
    print( f"Giftig: {toxic}" )


count( labels )


X = np.array( bitVects )
y = np.array( labels )


algorithms = {
    "SupportVectorClassifier": SVC(),
    "LinearSupportVectorClassifier": LinearSVC(),
    "KNearestNeighbor": KNeighborsClassifier( n_neighbors=int(math.sqrt(len(y))) ),
    "GaussianNaiveBayes": GaussianNB(),
    "MultinominalNaiveBayes": MultinomialNB(),
    "ComplementNaiveBayes": ComplementNB(),
    "RandomForestClassifier": RandomForestClassifier(),
    "DecisionTreeClassifier": DecisionTreeClassifier()
}


for key in algorithms:

    value = algorithms[key]

    print( value )

    model = value

    model.fit( X, y )

    dump( model, f"{key}.joblib" )

    """
    X_train, X_test, y_train, y_test = train_test_split( X, y, test_size=0.3 )  # 30% Testdaten

    model = value

    model.fit( X_train, y_train )

    print( model.score(X_test, y_test) )

    predicted = model.predict( X_test )

    print( confusion_matrix(y_test, predicted) )
    """

    """
    kFold = KFold( n_splits=7 )

    for train_index, test_index in kFold.split( X ):

        X_train, X_test = X[train_index], X[test_index]
        y_train, y_test = y[train_index], y[test_index]

        model = value

        model.fit( X_train, y_train )

        print( model.score(X_test, y_test) )

        predicted = model.predict( X_test )       

        print( confusion_matrix(y_test, predicted) )
    """