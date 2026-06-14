//Snake Game Logik (Browser)
console.log("game.js geladen");

let food = { x: 200, y: 200 };
let score = 0;
let gameTimer = 0;
let gameSpeed = 200;
let activePlayer = null;
let specialFood = null;
let specialFoodType = null;
let specialFoodCooldown = 15

const messageHud = document.getElementById("messageHud");
const scoreHud = document.getElementById("scoreHud");       //speichert hud ab in neuer variable hud

const playerNameInput = document.getElementById("playerName");
const savePlayerButton = document.getElementById("savePlayer");
const highscoresDiv = document.getElementById("highscores");

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
        activePlayer = playerName;

        console.log(data);

        // HUD Nachricht
        messageHud.innerText = "Spiel gestartet!";
        setTimeout(() => {
            messageHud.style.display = "none";
        }, 1000);
        gameRunning = true;
        startGameLoop()

    })
    .catch(error => {
        console.error("Fehler:", error);
    });
});

//bewegung
function moveSnake()
{
    if (paused) return;

    let head = { x: snake[0].x, y: snake[0].y };

    if (direction === "right") head.x += 20;
    if (direction === "left") head.x-= 20;
    if (direction === "up") head.y -= 20;
    if (direction === "down") head.y += 20;

    if (specialFood &&
    snake[0].x === specialFood.x &&
    snake[0].y === specialFood.y)
{
    if (specialFoodType === "score")
    {
        score += 3;
    }

    else if (specialFoodType === "grow")
    {
        score += 2;
        let last = snake[snake.length - 1];
        snake.push({ x: last.x, y: last.y });           //+1
        snake.push({ x: last.x, y: last.y });           //+2
    }
    else if (specialFoodType === "slow")
    {
        gameSpeed += 50;
    }
    else if (specialFoodType === "poison")
    {
        score -= 10;
    }
    else if (specialFoodType === "speed_boost")
    {
        gameSpeed -= 50;
    }
    else if (specialFoodType === "shrink")
    {
        if (snake.length > 2)
        {
            snake.pop();
            snake.pop();
        }
    }

    specialFood = null;
    specialFoodType = null;
    }

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

function spawnSpecialFood()
{
    if (specialFood !== null)
    {
        return;
    }

    if (specialFoodCooldown > 0)
    {
        return;
    }

    if (Math.random() > 0.2)
    {
        return;
    }

    specialFood =
    {
        x: Math.floor(Math.random() * 19) * 20,
        y: Math.floor(Math.random() * 19) * 20
    };

    let foodTypeNumber = Math.floor(Math.random() * 6) + 1;

    if (foodTypeNumber === 1)
    {
        specialFoodType = "score";
    }
    else if (foodTypeNumber === 2)
    {
        specialFoodType = "grow";
    }
    else if (foodTypeNumber === 3)
    {
        specialFoodType = "slow";
    }
    else if (foodTypeNumber === 4)
    {
        specialFoodType = "poison";
    }
    else if (foodTypeNumber === 5)
    {
        specialFoodType = "speed_boost";
    }
    else if (foodTypeNumber === 6)
    {
        specialFoodType = "shrink";
    }
    console.log("Special Food Type:", specialFoodType);
    specialFoodCooldown = 15;
    setTimeout(removeSpecialFood, 5000);
}

function drawSpecialFood()
{
    if (!specialFood) return;

    // Farbe abhängig vom Typ
    if (specialFoodType === "score")
    {
        ctx.fillStyle = "gold";
    }
    else if (specialFoodType === "grow")
    {
        ctx.fillStyle = "green";
    }
    else if (specialFoodType === "slow")
    {
        ctx.fillStyle = "blue";
    }
    else if (specialFoodType === "poison")
    {
        ctx.fillStyle = "red";
    }
    else if (specialFoodType === "speed_boost")
    {
        ctx.fillStyle = "orange";
    }
    else if (specialFoodType === "shrink")
    {
        ctx.fillStyle = "purple";
    }
    else
    {
        ctx.fillStyle = "white";
    }

    ctx.fillRect(specialFood.x, specialFood.y, 20, 20);
}

function resetGame()
{
    snake = [{ x: 100, y: 100 }];
    direction = "right";
    score = 0;
    gameTimer = 0;
    gameSpeed = 200;
    gameRunning = true;
    spawnFood();
}

function updateHUD()
{
    scoreHud.innerText = `Score: ${score} - Time: ${gameTimer}s`;                    //${} = setze die variable hier in den text
}

function updateTimer()
{
    if (paused) return;

    if (!activePlayer) return;

    gameTimer++;

    if (gameTimer % 10 === 0)
    {
        gameSpeed -= 10;
        console.log("Neue Geschwindigkeit:", gameSpeed);
    }
    if (specialFoodCooldown > 0)
    {
    console.log("Cooldown Special Food:", specialFoodCooldown);
    specialFoodCooldown = specialFoodCooldown - 1;
    }
    else
    {
    spawnSpecialFood();
    }
}

function removeSpecialFood()
{
    specialFood = null;
    specialFoodType = null;
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

function loadHighscores()
{
    fetch("/highscores")
    .then(response => response.json())
    .then(data =>
    {
       highscoresDiv.innerHTML = "<h3>Top 3 Highscores</h3>";

        data.slice(0, 3).forEach((player, index) =>
        {
            highscoresDiv.innerHTML +=
                `<div>${index + 1}. ${player[0]} - ${player[1]}</div>`;
        });
    });
}

//game loop
function startGameLoop()
{
    if (!gameRunning || !activePlayer)
    {
        return;
    }

    gameLoop();

    setTimeout(startGameLoop, gameSpeed);
}

function gameLoop()
{
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveSnake();
    drawSnake();
    drawFood();
    drawSpecialFood();

    updateHUD();
}

loadHighscores();
setInterval(loadHighscores, 3000);
setInterval(updateTimer, 1000);
startGameLoop();
