//Snake Game Logik (Browser)
let food = { x: 200, y: 200 };
let score = 0;
let gameTimer = 0;
let baseSpeed = 200;
let activePlayer = null;
let specialFood = null;
let specialFoodType = null;
let activeEffects = {slow: 0, speed: 0};
let specialFoodCooldown = 15
let difficulty = null;
let scoreMultiplier = 1;
let obstacles = [];
let gameRunning = false;
let canMove = true;
let secretMap = false;
let movingObstaclesEnabled = false;
let obstacleDirection = 1;
let currentEasyBackground = null;
const snakeColors = ["red", "green", "yellow", "blue", "white", "orange", "purple", "brown", "pink", "gold", "silver", "gray", "purple"];
let colorOffset = 0;
let bodyColor = "darkgreen";
let gameOverAnimation = null;
let gameOverColorIndex = 0;

const images = {easy_gras: new Image(), easy_gras_2: new Image(), normal_gras: new Image(), hard_lava: new Image(), secret_map: new Image()};
images.easy_gras.src = "/static/snake_img/easy_gras.png";
images.easy_gras_2.src = "/static/snake_img/easy_gras_2.png";
images.normal_gras.src = "/static/snake_img/normal_gras.png";
images.hard_lava.src = "/static/snake_img/hard_lava.png";
images.secret_map.src = "/static/snake_img/secret_map.png";

let effectHud = document.getElementById("effectHud");
const specialFoodHud = document.getElementById("messagespecialfood");
const messageHud = document.getElementById("messageHud");
const scoreHud = document.getElementById("scoreHud");       //speichert hud ab in neuer variable hud

const playerNameInput = document.getElementById("playerName");
const savePlayerButton = document.getElementById("savePlayer");
const highscoresDiv = document.getElementById("highscores");

const canvas = document.getElementById("game");         //zugriff auf das canvas-element aus HTML
const ctx = canvas.getContext("2d");                                //benutze den 2D-Zeichenstift für das Canvas
const easyBtn = document.getElementById("easyBtn");
const normalBtn = document.getElementById("normalBtn");
const hardBtn = document.getElementById("hardBtn");

document.getElementById("restartBtn").onclick = () =>
{
    clearInterval(gameOverAnimation);
    document.getElementById("gameOverBox").style.display = "none";

    resetGame();
    gameLoop();
};

document.getElementById("menuBtn").onclick = () =>
{
    clearInterval(gameOverAnimation);
    document.getElementById("gameOverBox").style.display = "none";

    easyBtn.disabled = false;
    normalBtn.disabled = false;
    hardBtn.disabled = false;
}


//startpunkt und kopf snake
let snake =[                             //let = veränderbar
    { x: 160, y: 160, color: "green" }];

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
    if (difficulty === null)
    {
        alert("Bitte zuerst eine Schwierigkeit auswählen.");
        return;
    }
    const playerName = playerNameInput.value;

    fetch("/create_player",
        {
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

        // HUD Nachricht
        messageHud.innerText = "Spiel gestartet!";
        setTimeout(() =>
        {
            messageHud.style.display = "none";
        }, 1000);
        gameRunning = true;

        easyBtn.disabled = true;
        normalBtn.disabled = true;
        hardBtn.disabled = true;

        initGame();
        gameLoop();
    })
    .catch(error =>
    {
        console.error("Fehler:", error);
    });
});

easyBtn.addEventListener("click", function()
{
    if (gameRunning) return;
    difficulty = "easy";
    applyDifficulty();
    setObstacles();
});

normalBtn.addEventListener("click", function()
{
    if (gameRunning) return;
    difficulty = "normal";
    applyDifficulty();
    setObstacles();
});

hardBtn.addEventListener("click", function()
{
    if (gameRunning) return;
    difficulty = "hard";
    applyDifficulty();
    setObstacles();
});

//schwierigkeit
function applyDifficulty()
{

    if (difficulty === "easy")
    {
        baseSpeed = 160;
        scoreMultiplier = 1;
        specialFoodCooldown = 20;
    }

    else if (difficulty === "normal")
    {
        baseSpeed = 125;
        scoreMultiplier = 1.5;
        specialFoodCooldown = 15;
    }

    else if (difficulty === "hard")
    {
        baseSpeed = 100;
        scoreMultiplier = 2;
        specialFoodCooldown = 10;
    }

    gameSpeed = baseSpeed;
}
function createNormalObstacles()
{
    obstacles = [
        { x: 100, y: 80 }, { x: 120, y: 80 },
        { x: 100, y: 100 }, { x: 120, y: 100 },

        { x: 240, y: 180 }, { x: 260, y: 180 },
        { x: 240, y: 200 }, { x: 260, y: 200 },

        { x: 120, y: 280 }, { x: 140, y: 280 },
        { x: 120, y: 300 }, { x: 140, y: 300 }
    ];
}

function createHardObstacles()
{
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

function moveObstacles()
{
    if (!movingObstaclesEnabled)
    {
        return;
    }

    if (!gameRunning)
    {
        return;
    }

    // bewegen
    for (let o of obstacles)
    {
        o.x += 20 * obstacleDirection;
    }

    // prüfen ob irgendein Hindernis den Rand erreicht
    for (let o of obstacles)
    {
        if (o.x + 20 >= canvas.width)
        {
            obstacleDirection = -1;
            break;
        }

        if (o.x <= 0)
        {
            obstacleDirection = 1;
            break;
        }
    }
}

function setObstacles()
{
    obstacles = [];

    if (difficulty === "normal")
    {
        createNormalObstacles();
    }
    else if (difficulty === "hard")
    {
        createHardObstacles();
    }

    drawObstacles();
}

function drawObstacles()
{
    ctx.fillStyle = "gray";

    for (let o of obstacles)
    {
        ctx.fillRect(o.x, o.y, 20, 20);
    }
}

function getCurrentSpeed()
{
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
    if (direction === "left") head.x -= 20;
    if (direction === "up") head.y -= 20;
    if (direction === "down") head.y += 20;

    // wand kollesion
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height)
    {
        gameOver();
        return;
    }

    // Hinderniss kollision
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

    // neues Kopfteil hinzufügen
    snake.unshift({ x: head.x, y: head.y, color: "green" });          //unshift= füge etwas ganz vorne ins Array ein

    //food kollision check
    if (snake[0].x === food.x && snake[0].y === food.y)
    {
        score += scoreMultiplier;
        spawnFood();

        bodyColor = snakeColors[Math.floor(Math.random() * snakeColors.length)];
    }
    else
    {
        snake.pop();
    }

    //special food check
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


function drawBackground()
{
    if (secretMap)
    {
        ctx.drawImage(images.secret_map, 0, 0, 400, 400);
    }
    else if (difficulty === "easy")
  {
    if (!currentEasyBackground)
    {
        currentEasyBackground = images.easy_gras;
    }

    ctx.drawImage(currentEasyBackground, 0, 0, 400, 400);
  }
    else if (difficulty === "normal")
    {
        ctx.drawImage(images.normal_gras, 0, 0, 400, 400);
    }
    else
    {
        ctx.drawImage(images.hard_lava, 0, 0, 400, 400);
    }
}
//easy modus grid
function drawGrid()
{
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 1;

    //vertikale Linien
    for (let x = 0; x <= canvas.width; x += 20)
    {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    //horizontale Linien
    for (let y = 0; y <= canvas.height; y += 20)
    {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

//snake zeichnung(canvas)
function drawSnake()
{
    for (let i = 0; i < snake.length; i++)
    {
        if (i === 0)
        {
            ctx.fillStyle = "green"; // Kopf bleibt fix
        }
        else
        {
            ctx.fillStyle = bodyColor;
        }

        ctx.fillRect(snake[i].x, snake[i].y, 20, 20);
    }
}

function drawFood()
{
    ctx.fillStyle = "yellow";
    ctx.fillRect(food.x, food.y, 20, 20);
}

function spawnFood() {
    let x, y;

    do {
        x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
        y = Math.floor(Math.random() * (canvas.height / 20)) * 20;
    } while (!isFree(x, y));

    food = { x, y };
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

     let x, y;

    do
    {
        x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
        y = Math.floor(Math.random() * (canvas.height / 20)) * 20;
    }
    while (!isFree(x, y));

    specialFood = { x, y };

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

    gameTimer = gameTimer + 1;

    // Special Food Cooldown
    if (specialFoodCooldown > 0)
    {
        specialFoodCooldown = specialFoodCooldown - 1;
    }
    else
    {
        spawnSpecialFood();
    }
    //speed steigerung
     if (gameTimer > 0 && gameTimer % 10 === 0)
    {

        if (difficulty === "easy")
            baseSpeed -= 5;

        else if (difficulty === "normal")
            baseSpeed -= 10;

        else if (difficulty === "hard")
            baseSpeed -= 15;

        baseSpeed = Math.max(60, baseSpeed);
    }

    let modifier = 0;

    // Slow Effect runterzählen
    if (activeEffects.slow > 0)
    {
        activeEffects.slow = activeEffects.slow - 1;
        modifier = modifier + 50;
    }

    // Speed Effect runterzählen
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

function isFree(x, y)
{
    // Snake check
    if (snake.some(s => s.x === x && s.y === y))
        return false;

    // Hindernis check
    if (obstacles.some(o => o.x === x && o.y === y))
        return false;

    return true;
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
    if (!gameRunning) return; // verhindert doppeltes Triggern

    gameRunning = false;

    clearInterval(gameOverAnimation);

    gameOverColorIndex = 0;

    const messageHud = document.getElementById("messageHud");
    const gameOverBox = document.getElementById("gameOverBox");
    const gameOverText = document.getElementById("gameOverText");

    //HUD ausblenden
    messageHud.style.display = "none";

    // großes Game Over anzeigen
    gameOverBox.style.display = "block";

   // Farb-Blink Animation
    gameOverAnimation = setInterval(() =>
    {
        gameOverText.style.color = snakeColors[gameOverColorIndex];
        gameOverColorIndex = (gameOverColorIndex + 1) % snakeColors.length;
    }, 300);

    //score save
    fetch("/save_score",                //fetch = sendet Daten an Server
    {
        method: "POST",                                   //post = Daten werden gesendet
        headers:
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({                      // JSON= JS → JSON Format
            name: activePlayer,
            score: score
        })
    });
}

function resetGame()
{
    applyDifficulty();

    snake = [{ x: 160, y: 160 }];
    direction = "right";
    score = 0;
    gameTimer = 0;
    gameSpeed = baseSpeed;
    gameRunning = true;
    messageHud.style.display = "none";                  //gameOver text wird ausgeblendet bei nexter runde

    initGame();
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
function gameLoop()
{
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveSnake();
    moveObstacles();

    if (obstacles.some(o => o.x === snake[0].x && o.y === snake[0].y))
    {
        gameOver();
        return;
    }

    drawBackground();
    if (difficulty === "easy") drawGrid();

    drawSnake();
    drawFood();
    drawSpecialFood();
    drawObstacles();

    updateHUD();

    setTimeout(() =>
    {
        canMove = true;

        if (gameRunning)
        {
            gameLoop();
        }
    }, getCurrentSpeed());
}

function initGame()
{
    secretMap = Math.random() < 0.1;

    movingObstaclesEnabled = false;

    if (difficulty === "easy")
    {
    currentEasyBackground = Math.random() < 0.5
        ? images.easy_gras
        : images.easy_gras_2;
    }
    setObstacles();

    snake = [{ x: 160, y: 160 }];
    direction = "right";
    score = 0;
    gameTimer = 0;

    spawnFood();

    if (secretMap)
    {
        setTimeout(() =>
        {
            movingObstaclesEnabled = true;
        }, 5000);
    }
}

loadHighscores();
setInterval(loadHighscores, 3000);
setInterval(updateTimer, 1000);