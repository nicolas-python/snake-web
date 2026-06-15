F12 drücken für Konsole in Browser 
## Aufbau wofür was
- HTML = Struktur
- JS = Logik im Browser
- Python = Server

## Komentare schreiben
Python	# Kommentar
JavaScript	// Kommentar
HTML	<!-- Kommentar -->


## JavaScript 
ctx = Zeichenwerkzeug (2D Kontext)
Rechtecke zeichnen: ctx.fillRect(x, y, breite, höhe)
Farben setzen: ctx.fillStyle = "green

java böcke schreiben = Struktur durch Klammern
{ = Block startet
} = Block endet
Alles dazwischen gehört zum Block

lets = veränderbar (man kan die Variable komplett neu setzen )
const = Feste zuweisung (man kan nur den Inhalt ändern, aber nicht ersetzen)
Array = eine einfache liste
&& = heist und also = Bedingung 1 UND Bedingung 2 müssen beide stimmen damit was passiert 
||  = bedeutet Oder 
alert = simples browser Popup(wie in phyton mb message)
! = NICHT / Gegenteil

fetch = JavaScript Funktion zum Senden von Daten an den Server
POST = Art der anfrage 
    GET = Daten holen
    POST = Daten senden
JSON = Ein Datenformat   ( Standardformat für Daten zwischen JS und Python)
JSON.stringify() = wandelt JS Objekt → JSON Text
request.get_json() = holt die daten die JS geschickt hat 
console.log() = print im Browser (JavaScript)

## HTML
div =einfach ein Container im HTML
getElementById= Verbindung JS ↔ HTML
innerText= Text im HTML ändern
${score}= setzt Variable in Text einsetzen  (${} wird auch Template Literal / String Interpolation genannt )
addEventListener=reagiert auf taste wie event in pyhton 
document = komplette HTML-Seite im Browser
document. = greift auf Elemente oder Ereignisse der HTML-Seite zu
" " = statischer Text (für einfachen Text ohne Variablen,kein Einfügen von Werten möglich)
` ` = dynamischer Text mit Variablen(erlaubt Variablen mit ${},ideal für dynamische Texte z.b Score, Timer)
CSS = Cascading Style Sheet = Design (Position, Farbe, Größe, Animation)
<style> = CSS direkt in der HTML-Datei
selector = wählt ein HTML-Element aus (#id, .class, tag)
position = absolute = Element frei auf der Seite platzieren
top / left = genaue Position eines Elements
color = Textfarbe
font-size = Schriftgröße
font-weight = macht Text fett
pointer-events: none = Element ist nicht klickbar (Maus geht durch)
background = Hintergrundfarbe eines Elements
border = Rahmen um ein Element
padding = Innenabstand im Element
z-index = bestimmt, welches Element vorne liegt
display = none = Element ist unsichtbar
display = block = Element ist sichtbar
