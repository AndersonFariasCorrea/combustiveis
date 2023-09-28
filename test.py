from flask import Flask, request, jsonify
import pandas as pd

df = pd.read_csv("combustiveis.csv")

print(df.loc[df['ano'] == 2009])
