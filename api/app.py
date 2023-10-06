from flask import Flask, request, jsonify, render_template
import pandas as pd
# Import the database configuration from core/db_conn.py
# import mysql.connector

app = Flask(__name__)

# Load your data into a global DataFrame
df = pd.read_csv("combustiveis.csv")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api", methods=['GET'])
def get_combustiveis():
    # Get query parameters from the request
    ano = request.args.get('ano', type=int)
    produto = request.args.get('produto', type=str)
    limit = request.args.get('limit', type=int)

    if ano is None or produto is None:
        return jsonify({'status': 400, 'message': 'Invalid parameters'}), 400

    pd.options.display.float_format = "{:,.2f}".format

    # Filter the DataFrame
    filtered_df = df.loc[(df['ano'] == ano) & (df['produto'] == produto), ['ano', 'produto', 'preco_venda', 'sigla_uf']]

    if filtered_df.empty:
        return jsonify({'status': 404, 'message': 'No data found'}), 404

    # Optionally, limit the number of rows if 'limit' is provided
    if limit:
        filtered_df = filtered_df.head(limit)

    # Convert the filtered DataFrame to a list of dictionaries and jsonify it
    result_list = filtered_df.to_dict(orient='records')
    return jsonify(result_list)

if __name__ == '__main__':
    app.run()

# FORMAT PLUS SAMPLE FROM TABLE
# | ano  | sigla_uf | id_municipio |   bairro_revenda  | cep_revenda|    endereco_revenda   |   cnpj_revenda |   nome_estabelecimento  |
# |------|----------|--------------|-------------------|------------|----------------------------------------|-------------------------|
# | 2009 |   SP     |   3530508    |   Vila Lambari    | 13731087   | Praca Capitão Olimpio | 04363381000124 | Auto Posto Ebenezer Ltda|

# | bandeira_revenda | data_coleta | produto | unidade_medida | preco_compra | preco_venda |
# |------------------|-------------|---------|----------------|--------------|-------------|
# |     Branca       | 2009-07-06  | Diesel  |  R$/litro      |    -         |   1.999     |