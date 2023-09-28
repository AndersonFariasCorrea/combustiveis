from flask import Flask, request, jsonify
from core.db_conn import db_config  # Import the database configuration from core/db_conn.py
import mysql.connector

app = Flask(__name__)

conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()

@app.route("/api", methods=['GET'])
def get_combustiveis():
    # Get query parameters from the request
    ano = request.args.get('ano', type=int)
    limit = request.args.get('limit', type=int)

    if ano is None:
        return jsonify({'status': 400, 'message': 'Invalid parameters'}), 400

    try:
        query = "SELECT preco_venda, sigla_uf FROM combustiveis WHERE ano = %s LIMIT %s"
        cursor.execute(query, (ano, limit))
        results = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        data = [dict(zip(columns, row)) for row in results]

        if not data:
            return jsonify({'status': 404, 'message': 'No data found'}), 404

        return jsonify(data)

    except mysql.connector.Error as error:
        return jsonify({'error': str(error)}), 500

if __name__ == '__main__':
    app.run()
