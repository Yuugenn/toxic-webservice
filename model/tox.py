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
from sklearn.model_selection import KFold
from sklearn.naive_bayes import GaussianNB, MultinomialNB, ComplementNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import LinearSVC, SVC
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


X = np.array( bitVects )
y = np.array( labels )


algorithms = {
    "SupportVectorClassifier": SVC(),
    "LinearSupportVectorClassifier": LinearSVC(),
   #"KNearestNeighbor": KNeighborsClassifier( n_neighbors=87 ),  # Wurzel aus 7578
    "KNearestNeighbor": KNeighborsClassifier( n_neighbors=77 ),  # Wurzel aus 6062 (80%)
    "GaussianNaiveBayes": GaussianNB(),
    "MultinomialNaiveBayes": MultinomialNB(),
    "ComplementNaiveBayes": ComplementNB(),
    "RandomForestClassifier": RandomForestClassifier(),
    "DecisionTreeClassifier": DecisionTreeClassifier()
}


for key in algorithms:

    value = algorithms[key]

    print( value )

    model = value

    """

    model.fit( X, y )

    dump( model, f"{key}.joblib" )

    """

    scores = []
    fnr    = []  # false negative rate
    tpr    = []  # true  positive rate

    kFold = KFold( n_splits=5, shuffle=True )

    for train_index, test_index in kFold.split( X ):

        X_train, X_test = X[train_index], X[test_index]
        y_train, y_test = y[train_index], y[test_index]

        model.fit( X_train, y_train )

        scores.append( model.score(X_test, y_test) )

        confusionMatrix = confusion_matrix( y_test, model.predict(X_test) )

        fnr.append( confusionMatrix[1][0] / (confusionMatrix[1][0] + confusionMatrix[1][1]) )  # fn / (fn + tp)
        tpr.append( confusionMatrix[1][1] / (confusionMatrix[1][1] + confusionMatrix[1][0]) )  # tp / (tp + fn)

        print( confusionMatrix )

    print( np.mean(scores) )
    print( np.mean(fnr)    )
    print( np.mean(tpr)    )