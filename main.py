from flask import Flask, request, jsonify
import pandas as pd

app = Flask(__name__)

# Load your data into a global DataFrame
df = pd.read_csv("combustiveis.csv")

@app.route("/api", methods=['GET'])
def get_combustiveis():
    # Get query parameters from the request
    ano = request.args.get('ano', type=int)
    unidade_medida = request.args.get('unidade_medida', type=str)
    limit = request.args.get('limit', type=int)

    if ano is None or unidade_medida is None:
        return jsonify({'status': 400, 'message': 'Invalid parameters'}), 400

    pd.options.display.float_format = "{:,.2f}".format

    # Filter the DataFrame
    filtered_df = df.loc[(df['ano'] == ano) & (df['unidade_medida'] == unidade_medida), ['ano', 'unidade_medida', 'preco_venda']]

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
