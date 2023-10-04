from flask import Flask, request, jsonify
import pandas as pd

df = pd.read_csv("bq-results-2009.csv")

# print(df.loc[df['ano'] == 2009])
# print(df.loc[(df['ano'] == 2009) & (df['unidade_medida'] == 'R$/litro'), ['ano', 'unidade_medida', 'preco_venda']])

print(df.columns.tolist())
# print(df[[c for c in df.columns if 'ano' in c]])
