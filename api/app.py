from flask import Flask, request, jsonify, render_template
import pandas as pd
import datetime

app = Flask(__name__)

df = pd.read_csv("api/bq-results-2009.csv")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/listaTiposCombustiveis", methods=['GET'])
def get_combustiveis_tipos():
    pd.options.display.float_format = "{:,.2f}".format

    anoFrom = request.args.get('anoFrom', type=int)
    anoTo = request.args.get('anoTo', type=int)
    limit = request.args.get('limit', type=int)

    if anoFrom is None:
        return jsonify({'status': 400, 'msg': 'Parametros inválidos'}), 400
    
    if anoTo is None:
        anoTo = datetime.datetime.now().year

    filtered_df = df.loc[((df['ano'] >= anoFrom) & (df['ano'] <= anoTo) & (df['produto'] != 'Glp')), ['produto']]


    if filtered_df.empty:
        return jsonify({'status': 404, 'msg': 'Nenhum dado encontrado'}), 404

    distinct_produtos = filtered_df['produto'].unique()

    if limit:
        distinct_produtos = distinct_produtos[:limit]

    result_list = distinct_produtos.tolist()

    return jsonify(result_list)


@app.route("/api/listarMediaPrecoPorAno", methods=['GET'])
def get_combustiveis_media():
    
    anoFrom = request.args.get('anoFrom', type=int)
    anoTo = request.args.get('anoTo', type=int)
    produto = request.args.get('produto', type=str)
    limit = request.args.get('limit', type=int)
    
    sigla_uf = request.args.get('sigla_uf', type=str)
    id_municipio = request.args.get('id_municipio', type=int)
    bairro_revenda = request.args.get('bairro_revenda', type=str)
    cep_revenda = request.args.get('cep_revenda', type=int)
    endereco_revenda = request.args.get('endereco_revenda', type=str)
    cnpj_revenda = request.args.get('cnpj_revenda', type=int)
    unidade_medida = request.args.get('unidade_medida', type=str)
    preco_compra = request.args.get('preco_compra', type=float)
    preco_venda = request.args.get('preco_venda', type=float)

    pd.options.display.float_format = "{:,.2f}".format

    conditions = {
        'produto': produto,
        'sigla_uf': sigla_uf,
        'id_municipio': id_municipio,
        'bairro_revenda': bairro_revenda,
        'cep_revenda': cep_revenda,
        'cnpj_revenda': cnpj_revenda,
        'unidade_medida': unidade_medida,
        'preco_compra': preco_compra,
        'preco_venda': preco_venda 
    }
    
    filtered_df = df

    if anoFrom is not None:
        filtered_df = filtered_df[filtered_df['ano'] >= anoFrom]

    if anoTo is not None:
        filtered_df = filtered_df[filtered_df['ano'] <= anoTo]

    # Filter based on other conditions
    for key, value in conditions.items():
        if value is not None and value != "":
            filtered_df = filtered_df[(filtered_df[key] == value) & (filtered_df['produto'] != 'Glp')]


    if filtered_df.empty:
        return jsonify({'status': 404, 'msg': 'Nenhum dado encontrado'}), 404

    count_distinct_cnpj = filtered_df['cnpj_revenda'].nunique()

    avg_preco_compra = filtered_df['preco_compra'].mean()
    avg_preco_venda = filtered_df['preco_venda'].mean()
    
    if cnpj_revenda is not None and len(str(cnpj_revenda)) > 0:
        result_df = filtered_df.groupby(["produto", "nome_estabelecimento", "cep_revenda"])["preco_venda"].mean().reset_index()

    if cep_revenda is not None and len(str(cep_revenda)) > 0:
        result_df = filtered_df.groupby(["produto", "nome_estabelecimento", "sigla_uf", "cnpj_revenda", "bairro_revenda"])["preco_venda"].mean().reset_index()
        
    if id_municipio is not None: 
        result_df = filtered_df.groupby(["produto", "id_municipio"])["preco_venda"].mean().reset_index()

    else:    
        result_df = filtered_df.groupby(["produto", "sigla_uf"])["preco_venda"].mean().reset_index()

    if limit:
        result_df = result_df.head(limit)

    result_list = result_df.to_dict(orient='records')

    if count_distinct_cnpj != count_distinct_cnpj:
        count_distinct_cnpj = 0

    if avg_preco_compra != avg_preco_compra:
        avg_preco_compra = 0

    if avg_preco_venda != avg_preco_venda:
        avg_preco_venda = 0

    result_list = {
        'count_distinct_cnpj': count_distinct_cnpj,
        'avg_preco_compra': avg_preco_compra,
        'avg_preco_venda': avg_preco_venda,
        'list': result_list
    }

    return jsonify(result_list)


if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')


# FORMAT PLUS SAMPLE FROM TABLE
# | ano  | sigla_uf | id_municipio |   bairro_revenda  | cep_revenda|    endereco_revenda   |   cnpj_revenda |   nome_estabelecimento  |
# |------|----------|--------------|-------------------|------------|----------------------------------------|-------------------------|
# | 2009 |   SP     |   3530508    |   Vila Lambari    | 13731087   | Praca Capitão Olimpio | 04363381000124 | Auto Posto Ebenezer Ltda|

# | bandeira_revenda | data_coleta | produto | unidade_medida | preco_compra | preco_venda |
# |------------------|-------------|---------|----------------|--------------|-------------|
# |     Branca       | 2009-07-06  | Diesel  |  R$/litro      |    -         |   1.999     |

# https://servicodados.ibge.gov.br/api/v1/localidades/municipios/3530508 get municipio