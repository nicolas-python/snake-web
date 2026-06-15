//Snake Game Logik (Browser)
console.log("game.js geladen");

let food = { x: 200, y: 200 };
let score = 0;
let gameTimer = 0;
let baseSpeed = 200;
let activePlayer = null;
let specialFood = null;
let specialFoodType = null;
let activeEffects = {slow: 0, speed: 0};
let specialFoodCooldown = 15
let difficulty = "normal";
let scoreMultiplier = 1;
let obstacles = [];
let gameRunning = false;

let effectHud = document.getElementById("effectHud");
const specialFoodHud = document.getElementById("messagespecialfood");
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

        initGame();
        gameLoop();
    })
    .catch(error => {
        console.error("Fehler:", error);
    });
});

//schwierigkeit
function applyDifficulty() {

    if (difficulty === "easy") {
        baseSpeed = 220;
        scoreMultiplier = 1;
        specialFoodCooldown = 20;
    }

    else if (difficulty === "normal") {
        baseSpeed = 180;
        scoreMultiplier = 1.5;
        specialFoodCooldown = 15;
    }

    else if (difficulty === "hard") {
        baseSpeed = 140;
        scoreMultiplier = 2;
        specialFoodCooldown = 10;
    }

    gameSpeed = baseSpeed;
}
function createNormalObstacles() {
    obstacles = [
        { x: 100, y: 80 }, { x: 120, y: 80 },
        { x: 100, y: 100 }, { x: 120, y: 100 },

        { x: 240, y: 180 }, { x: 260, y: 180 },
        { x: 240, y: 200 }, { x: 260, y: 200 },

        { x: 120, y: 280 }, { x: 140, y: 280 },
        { x: 120, y: 300 }, { x: 140, y: 300 }
    ];
}

function createHardObstacles() {
    obstacles = [
        { x: 80, y: 80 }, { x: 100, y: 80 }, { x: 120, y: 80 },
        { x: 80, y: 100 }, { x: 100, y: 100 }, { x: 120, y: 100 },
        { x: 80, y: 120 }, { x: 100, y: 120 }, { x: 120, y: 120 },

        { x: 260, y: 80 }, { x: 280, y: 80 }, { x: 300, y: 80 },
        { x: 260, y: 100 }, { x: 280, y: 100 }, { x: 300, y: 100 },
        { x: 260, y: 120 }, { x: 280, y: 120 }, { x: 300, y: 120 },

        { x: 80, y: 260 }, { x: 100, y: 260 }, { x: 120, y: 260 },
        { x: 80, y: 280 }, { x: 100, y: 280 }, { x: 120, y: 280 },
        { x: 80, y: 300 }, { x: 100, y: 300 }, { x: 120, y: 300 },

        { x: 260, y: 260 }, { x: 280, y: 260 }, { x: 300, y: 260 },
        { x: 260, y: 280 }, { x: 280, y: 280 }, { x: 300, y: 280 },
        { x: 260, y: 300 }, { x: 280, y: 300 }, { x: 300, y: 300 }
    ];
}

function drawObstacles() {
    ctx.fillStyle = "gray";

    for (let o of obstacles) {
        ctx.fillRect(o.x, o.y, 20, 20);
    }
}

function getCurrentSpeed() {
    let speed = baseSpeed;

    if (activeEffects.slow > 0) speed += 60;
    if (activeEffects.speed > 0) speed -= 60;

    return Math.max(60, speed);
}

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
        showFloatingMessage("+3 Punkte");
    }

    else if (specialFoodType === "grow")
    {
        score += 2;
        let last = snake[snake.length - 1];
        snake.push({ x: last.x, y: last.y });           //+1
        snake.push({ x: last.x, y: last.y });           //+2
        showFloatingMessage("Gewachsen");
    }
    else if (specialFoodType === "slow")
    {
        activeEffects.slow = 10;
        showFloatingMessage("Verlangsamt!");
    }
    else if (specialFoodType === "poison")
    {
        score -= 10;
        showFloatingMessage("Vergiftet -10 Punkte");
    }
    else if (specialFoodType === "speed_boost")
    {
        activeEffects.speed = 10;
        showFloatingMessage("SpeedBoost");
    }
    else if (specialFoodType === "shrink")
    {
        if (snake.length > 2)
        {
            showFloatingMessage("Geschrumpft -2 ");
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

    //Hinderniss kollision
    if (obstacles.some(o => o.x === head.x && o.y === head.y))
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

    //food kollision check
    if (snake[0].x === food.x && snake[0].y === food.y)
    {
        score += scoreMultiplier;
        spawnFood();
    }
    else
    {
        snake.pop();
    }
}


function checkSelfCollision(x, y)
{
    for (let i = 1; i < snake.length;i = i + 1)
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
        ctx.fillStyle = "violet";
    }
    else if (specialFoodType === "speed_boost")
    {
        ctx.fillStyle = "white";
    }
    else if (specialFoodType === "shrink")
    {
        ctx.fillStyle = "orange";
    }
    else
    {
        ctx.fillStyle = "red";
    }

    ctx.fillRect(specialFood.x, specialFood.y, 20, 20);
}

function updateHUD()
{
    let text = `Score: ${score} - Time: ${gameTimer}s`;       //${} = setze die variable hier in den text

    if (activeEffects.speed > 0)
    {
        text += ` | Speed: ${buildCountdown(activeEffects.speed)}`;
    }

    if (activeEffects.slow > 0)
    {
        text += ` | Slow: ${buildCountdown(activeEffects.slow)}`;
    }

    scoreHud.innerText = text;
}

function updateTimer()
{
    if (paused) return;

    if (!activePlayer) return;

    gameTimer = gameTimer + 1;

    if (specialFoodCooldown > 0)
    {
    console.log("Cooldown Special Food:", specialFoodCooldown);
    specialFoodCooldown = specialFoodCooldown - 1;
    }
    else
    {
    spawnSpecialFood();
    }
    let modifier = 0;

    if (activeEffects.slow > 0)
    {
        activeEffects.slow = activeEffects.slow - 1;
        modifier = modifier + 50;
    }

    if (activeEffects.speed > 0)
    {
        activeEffects.speed = activeEffects.speed - 1;
        modifier = modifier - 50;
    }

    gameSpeed = baseSpeed + modifier;
}

function buildCountdown(value)
{
    return value;
}

function removeSpecialFood()
{
    specialFood = null;
    specialFoodType = null;
}

function showFloatingMessage(text)
{
    specialFoodHud.innerText = text;
    specialFoodHud.style.color = "gold";
    specialFoodHud.style.display = "block";

    let position = 200;

    let animation = setInterval(function()
    {
        position -= 2;
        specialFoodHud.style.top = position + "px";

        if (position <= 120)
        {
            clearInterval(animation);
            specialFoodHud.innerText = "";
        }
    }, 30);
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

function resetGame()
{
    snake = [{ x: 160, y: 160 }];
    direction = "right";
    score = 0;
    gameTimer = 0;
    gameSpeed = baseSpeed;
    gameRunning = true;

    spawnFood();
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
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveSnake();
    drawSnake();
    drawFood();
    drawSpecialFood();
    drawObstacles();

    updateHUD();

    setTimeout(gameLoop, getCurrentSpeed());
}

function initGame() {
    snake = [{ x: 160, y: 160 }];
    direction = "right";
    score = 0;
    gameTimer = 0;

    if (difficulty === "easy") createNormalObstacles();
    else if (difficulty === "hard") createHardObstacles();
    else createNormalObstacles();

    spawnFood();
}

loadHighscores();
setInterval(loadHighscores, 3000);
setInterval(updateTimer, 1000);
