import csv
import os
import db_conn

csv_file_path = input("Informe o caminho absoluto para o arquivo CSV: ")

table_name = "combustiveis"

with open(csv_file_path, "r", encoding="utf-8") as csv_file:
    csv_reader = csv.reader(csv_file)
    header = next(csv_reader)

insert_sql_statements = []
with open(csv_file_path, "r", encoding="utf-8") as csv_file:
    csv_reader = csv.DictReader(csv_file)
    for row in csv_reader:
        insert_sql = f"INSERT INTO {table_name} ({', '.join(row.keys())}) VALUES ({', '.join(['%s' for _ in row.values()])})"
        insert_sql_statements.append((insert_sql, tuple(row.values())))

try:
    connection = mysql.connector.connect(**db_conn.db_config)
    cursor = connection.cursor()

    create_table_sql = f"CREATE TABLE IF NOT EXISTS {table_name} (id INT AUTO_INCREMENT PRIMARY KEY, "
    create_table_sql += ", ".join([f"{column} TEXT" for column in header]) + ");"
    cursor.execute(create_table_sql)

    for insert_sql, values in insert_sql_statements:
        cursor.execute(insert_sql, values)

    connection.commit()
    print("Os dados forma inseridos com sucesso.")

except mysql.connector.Error as error:
    print("Error: ", error)

finally:
    if connection.is_connected():
        cursor.close()
        connection.close()
