//Snake Game Logik (Browser)
console.log("game.js geladen");

let food = { x: 200, y: 200 };
let score = 0;
let activePlayer = null;

const hud = document.getElementById("hud");     //speichert hud ab in neuer variable hud

const playerNameInput = document.getElementById("playerName");
const savePlayerButton = document.getElementById("savePlayer");

const canvas = document.getElementById("game");         //zugriff auf das canvas-element aus HTML
const ctx = canvas.getContext("2d");                                //benutze den 2D-Zeichenstift für das Canvas

//startpunkt und kopf snake
let snake = [                               //let = veränderbar
  { x: 100, y: 100 }
];

//steuerung
let direction = "right";
let paused = false;


document.addEventListener("keydown", function(event)

{
    if (event.key === "ArrowLeft") direction = "left";
    if (event.key === "ArrowRight") direction = "right";
    if (event.key === "ArrowUp") direction = "up";
    if (event.key === "ArrowDown") direction = "down";

    if (event.key === "p") paused = !paused;
});


// Spieler speichern
savePlayerButton.addEventListener("click", function()
{
    const playerName = playerNameInput.value;

    fetch("/create_player", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: playerName
        })
    })
    .then(response => response.json())
    .then(data => {
        activePlayer = playerName
        console.log(data); // Debug in Konsole
        hud.innerText = data.message; // Anzeige im Spiel
    })
    .catch(error => {
        console.error("Fehler:", error);
    });
})



//bewegung
function moveSnake()
{
    if (paused) return;

    let head = { x: snake[0].x, y: snake[0].y };

    if (direction === "right") head.x += 20;
    if (direction === "left") head.x-= 20;
    if (direction === "up") head.y -= 20;
    if (direction === "down") head.y += 20;

    //wand kollesion
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height)
    {
        gameOver();
        return;
    }

    // selbst kollision
    if (checkSelfCollision(head.x, head.y))
    {
        gameOver();
        return;
    }

    snake.unshift(head);

        //vorne einfügen und hinten entfernen
    //food kollision check
    if (snake[0].x === food.x && snake[0].y === food.y)
    {
        score= score +1;
        spawnFood();
    }
    else
    {
        snake.pop();
    }
}


function checkSelfCollision(x, y)
{
    for (let i = 1; i < snake.length; i++)
    {
        if (x === snake[i].x && y === snake[i].y)
        {
            return true;
        }
    }

    return false;
}


//snake zeichnung(canvas)
function drawSnake()
{
    ctx.fillStyle = "green";

    for (let part of snake)
    {
        ctx.fillRect(part.x, part.y, 20, 20);
    }
}

function drawFood()
{
    ctx.fillStyle = "yellow";
    ctx.fillRect(food.x, food.y, 20, 20);
}

function spawnFood()
{
    food = {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20
    };
}

let gameRunning = true;


function resetGame()
{
    snake = [{ x: 100, y: 100 }];
    direction = "right";
    score = 0;
    gameRunning = true;
    spawnFood();
}

function updateHUD()
{
    hud.innerText = `Score: ${score}`;                      //${} = setze die variable hier in den text
}

function gameOver()
{
    gameRunning = false;

    fetch("/save_score", {                      //fetch = sendet Daten an Server
        method: "POST",                                   //post = Daten werden gesendet
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({                      // JSON= JS → JSON Format
            name: activePlayer,
            score: score
        })
    });

    alert("Game Over");
    resetGame();
}

//game loop
function gameLoop()
{
    if (!gameRunning) return;

    if (!activePlayer) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveSnake();
    drawSnake();
    drawFood();

    updateHUD();
}

setInterval(gameLoop, 200);