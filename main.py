from flask import Flask, render_template

app = Flask(__name__)                           #erstellt die flask-app
@app.route('/')                                 #wenn jemand die Route '/'im Browser aufruft, wird diese Funktion ausgeführt
def start_page():
    return render_template("index.html")

if __name__ == '__main__':                      #entscheidet ob Programm startet
    app.run(debug=True)                         #sorgt für automatisches Neustarten
