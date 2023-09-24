import db_conn
from flask import Flask

from flask import Flask, render_template

app = Flask(__name__)
# route -> hashtagtreinamentos.com/
# função -> o que você quer exibir naquela página
# template

@app.route("/")
def index():
    return render_template("homepage.html")
# colocar o site no ar
if __name__ == "__main__":
    app.run(debug=True)




# set FLASK_APP=app.py