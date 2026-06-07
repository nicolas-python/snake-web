//Snake Game Logik (Browser)
console.log("game.js geladen");

const canvas = document.getElementById("game");         //zugriff auf das canvas-element aus HTML
const ctx = canvas.getContext("2d");                                //benutze den 2D-Zeichenstift für das Canvas

//startpunkt snake
let snakeX = 100;
let snakeY = 100;

function drawSnake()
{
    ctx.fillStyle = "green";
    ctx.fillRect(snakeX, snakeY, 20, 20);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);           //clearRect = Bildschirm reset pro Frame
    drawSnake();
}

setInterval(gameLoop, 200);


