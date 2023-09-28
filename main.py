from flask import Flask, request, jsonify
import pandas as pd

app = Flask(__name__)

@app.route("/api", methods=['GET'])
def get_combustiveis():
    # Get query parameters from the request
    ano = request.args.get('ano', type=int)
    limit = request.args.get('limit', type=int)

    if ano is None:
        return jsonify({'status': 400, 'message': 'Invalid parameters'}), 400

    pd.options.display.float_format = "{:,.2f}".format

    contador = 0

    tabela = pd.DataFrame()
    for chunk in pd.read_csv("concatenated_result.csv", chunksize=10000):
        colunas = ["ano", "sigla_uf", "preco_venda"]

        chunk_filtrado = chunk[colunas]

        resumo = chunk_filtrado.groupby("sigla_uf", as_index=False).sum()

        tabela = pd.concat([tabela, resumo])

        contador += 1

        if contador > 2:
            break

    if tabela.empty:
        return jsonify({'status': 404, 'message': 'No data found'}), 404

    result_dict = tabela.to_dict()
    return jsonify(result_dict)

if __name__ == '__main__':
    app.run()

# +----------------------+------+------+-----+---------+----------------+                                                 
# | Field                | Type | Null | Key | Default | Extra          |                                                 
# +----------------------+------+------+-----+---------+----------------+                                                 
# | id                   | int  | NO   | PRI | NULL    | auto_increment |                                                 
# | ano                  | text | YES  |     | NULL    |                |                                                 
# | sigla_uf             | text | YES  |     | NULL    |                |                                                 
# | id_municipio         | text | YES  |     | NULL    |                |                                                 
# | bairro_revenda       | text | YES  |     | NULL    |                |                                                 
# | cep_revenda          | text | YES  |     | NULL    |                |                                                 
# | endereco_revenda     | text | YES  |     | NULL    |                |                                                 
# | cnpj_revenda         | text | YES  |     | NULL    |                |                                                 
# | nome_estabelecimento | text | YES  |     | NULL    |                |                                                 
# | bandeira_revenda     | text | YES  |     | NULL    |                |                                                 
# | data_coleta          | text | YES  |     | NULL    |                |                                                 
# | produto              | text | YES  |     | NULL    |                |                                                 
# | unidade_medida       | text | YES  |     | NULL    |                |                                                 
# | preco_compra         | text | YES  |     | NULL    |                |                                                 
# | preco_venda          | text | YES  |     | NULL    |                |                                                 
# 2016+----------------------+------+------+-----+---------+----------------+ 