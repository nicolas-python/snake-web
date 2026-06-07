//Snake Game Logik (Browser)
console.log("game.js geladen");

const canvas = document.getElementById("game");         //zugriff auf das canvas-element aus HTML
const ctx = canvas.getContext("2d");                                //benutze den 2D-Zeichenstift für das Canvas

//startpunkt snake
let snakeX = 100;
let snakeY = 100;

//steuerung
let direction = "right";
let paused = false;

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft") direction = "left";
    if (event.key === "ArrowRight") direction = "right";
    if (event.key === "ArrowUp") direction = "up";
    if (event.key === "ArrowDown") direction = "down";

    if (event.key === "p") paused = !paused;
});

//bewegung
function moveSnake() {
    if (paused) return;

    if (direction === "right") snakeX += 20;
    if (direction === "left") snakeX -= 20;
    if (direction === "up") snakeY -= 20;
    if (direction === "down") snakeY += 20;
}

//snake zeichnung(canvas)
function drawSnake()
{
    ctx.fillStyle = "green";
    ctx.fillRect(snakeX, snakeY, 20, 20);
}

//game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);           //clearRect = Bildschirm reset pro Frame
    moveSnake();
    drawSnake();
}

setInterval(gameLoop, 200);


