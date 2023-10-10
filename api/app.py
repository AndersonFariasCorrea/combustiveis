from flask import Flask, request, jsonify, render_template
import pandas as pd
import datetime

app = Flask(__name__)

df = pd.read_csv("api/bq-results-2009.csv")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/listarPorAnoTipo", methods=['GET'])
def get_combustiveis():
    # Obter os parametps para a query
    ano = request.args.get('ano', type=int)
    produto = request.args.get('produto', type=str)
    limit = request.args.get('limit', type=int)

    if ano is None or produto is None:
        return jsonify({'status': 400, 'message': 'Invalid parameters'}), 400

    pd.options.display.float_format = "{:,.2f}".format

    # filtra o DataFrame com os parametros
    filtered_df = df.loc[(df['ano'] == ano) & (df['produto'] == produto), ['ano', 'produto', 'preco_venda', 'sigla_uf']]

    if filtered_df.empty:
        return jsonify({'status': 404, 'message': 'No data found'}), 404

    # opcao de limitar a quatidade de retorno
    if limit:
        filtered_df = filtered_df.head(limit)

    # converte DataFrame final pra uma lista de dicionário e depois json
    result_list = filtered_df.to_dict(orient='records')
    return jsonify(result_list)

@app.route("/api/listarMediaPrecoPorAno", methods=['GET'])
def get_combustiveis_media():
    # Obtain the parameters for the query
    anoFrom = request.args.get('anoFrom', type=int)
    anoTo = request.args.get('anoTo', type=int)
    produto = request.args.get('produto', type=str)
    limit = request.args.get('limit', type=int)

    if anoFrom is None or produto is None:
        return jsonify({'status': 400, 'message': 'Invalid parameters'}), 400

    if anoTo is None:
        anoTo = datetime.datetime.now().year

    pd.options.display.float_format = "{:,.2f}".format

    # Filter the DataFrame with the parameters
    filtered_df = df[((df['ano'] >= anoFrom) & (df['ano'] <= anoTo)) & (df['produto'] == produto)]

    if filtered_df.empty:
        return jsonify({'status': 404, 'message': 'No data found'}), 404

    # Calculate the count of distinct 'cnpj_revenda'
    count_distinct_cnpj = filtered_df['cnpj_revenda'].nunique()

    # Calculate the average 'preco_compra' and 'preco_venda'
    avg_preco_compra = filtered_df['preco_compra'].mean()
    avg_preco_venda = filtered_df['preco_venda'].mean()

    # média preco_venda por produto e sigla_uf
    result_df = filtered_df.groupby(["produto", "sigla_uf"])["preco_venda"].mean().reset_index()

    # Option to limit the number of results
    if limit:
        result_df = result_df.head(limit)

    # Convert DataFrame final to a list of dictionaries and then to JSON
    result_list = result_df.to_dict(orient='records')

    # Create a JSON response that includes the count and averages
    result_list = {
        'count_distinct_cnpj': count_distinct_cnpj,
        'avg_preco_compra': avg_preco_compra,
        'avg_preco_venda': avg_preco_venda,
        'list': result_list
    }

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