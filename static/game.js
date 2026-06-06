//Snake Game Logik (Browser)

const canvas = document.getElementById("game");         //zugriff auf das canvas-element aus HTML
const ctx = canvas.getContext("2d");                                //benutze den 2D-Zeichenstift für das Canvas

// Test: ein Quadrat zeichnen
ctx.fillStyle = "green";
ctx.fillRect(100, 100, 20, 20);