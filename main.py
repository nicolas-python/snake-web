from flask import Flask, render_template ,request, jsonify
from database import init_db,save_score,save_player

app = Flask(__name__)                           #erstellt die flask-app
@app.route('/')                                 #wenn jemand die Route '/'im Browser aufruft, wird diese Funktion ausgeführt
def start_page():
    return render_template("index.html")

@app.route("/save_score", methods=["POST"])       #@app.route() = legt eine URL (Route) fest und verbindet sie mit einer Python-Funktion
def save_score_route():
    data = request.get_json()
    score = data["score"]

    save_score("player1", score, 0)  # aus deiner alten DB-Funktion

    return jsonify({"status": "ok"})

@app.route("/create_player", methods=["POST"])
def create_player():

    data = request.get_json()
    name = data["name"]

    save_player(name)

    return jsonify({"status": "ok"})

if __name__ == '__main__':                      #entscheidet ob Programm startet
    init_db()                                   #tabelle erstellen
    app.run(debug=True)                         #sorgt für automatisches Neustarten