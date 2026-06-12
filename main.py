from flask import Flask, render_template, request, jsonify
from database import init_db, save_score, save_player, get_highscores

app = Flask(__name__)                           #erstellt die flask-app

@app.route('/')                                 #wenn jemand die Route '/'im Browser aufruft, wird diese Funktion ausgeführt
def start_page():
    return render_template("index.html")


@app.route("/create_player", methods=["POST"])  #@app.route() = legt eine URL (Route) fest und verbindet sie mit einer Python-Funktion
def create_player():

    data = request.get_json()
    name = data["name"]

    save_player(name)
    return jsonify({"status": "ok","message": f"Der Name '{name}' wurde übernommen!"})


@app.route("/save_score", methods=["POST"])       #@app.route() = legt eine URL (Route) fest und verbindet sie mit einer Python-Funktion
def save_score_route():
    data = request.get_json()

    name = data["name"]
    score = data["score"]

    save_score(name, score, 0)  # aus deiner alten DB-Funktion

    return jsonify({"status": "ok","message": "Score gespeichert!"})

@app.route("/highscores")
def highscores():

    highscores = get_highscores()
    return jsonify(highscores)


if __name__ == '__main__':                      #entscheidet ob Programm startet
    init_db()                                   #tabelle erstellen
    app.run(debug=True)                         #sorgt für automatisches Neustarten