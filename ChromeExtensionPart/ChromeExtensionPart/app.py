import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import  pickle
from sklearn.metrics import confusion_matrix,classification_report,accuracy_score

from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
import process as pr
import scipy as sp

urldata = pd.read_csv("all_data_featured_merged.csv")
#urldata.drop("Unnamed: 0",1,inplace=True)

def processing(url):
    tokens_slash = str(url.encode('utf-8')).split('/')# make tokens after splitting by slash
    total_Tokens = []
    for i in tokens_slash:
        tokens = str(i).split('-')# make tokens after splitting by dash
        tokens_dot = []
        for j in range(0,len(tokens)):
            temp_Tokens = str(tokens[j]).split('.')# make tokens after splitting by dot
            tokens_dot = tokens_dot + temp_Tokens
        total_Tokens = total_Tokens + tokens + tokens_dot
    finaltest = list(set(total_Tokens))#remove redundant tokens
    return finaltest
vectorizer = TfidfVectorizer(tokenizer=processing)
X = pr.vectorizer.fit_transform(urldata['url'])
features = sp.sparse.csr_matrix(urldata[['url_length', 'hostname_length',
       'path_length', 'fd_length', 'tld_length', 'count-', 'count@', 'count?',
       'count%', 'count.', 'count=','count-digits', 'count-letters', 'count_dir', 'use_of_ip']].values)

from scipy.sparse import hstack
testing = hstack([X, features])
Y = urldata['result']
target = sp.sparse.csr_matrix(Y)
rfc = RandomForestClassifier()
x_train, x_test, y_train, y_test = train_test_split(testing, Y, train_size=0.3, random_state=42)
rfc.fit(x_train,y_train)
pred_results = rfc.predict(x_test)
accuracy_score(y_test,pred_results)
