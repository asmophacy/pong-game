// script.js

const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');
const ballSpeedInput = document.getElementById('ball-speed');
const lastScoreDiv = document.getElementById('last-score');

let playerPaddle = {
    x: 10,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    dy: 0 // Paddle movement speed
};

let aiPaddle = {
    x: canvas.width - 20,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: 3,
    dy: 3,
    speed: 3 // Initial ball speed
};

let playerScore = 0;
let aiScore = 0;
let lastScore = localStorage.getItem('lastScore') || 'No previous game';

lastScoreDiv.textContent = `Last Score: ${lastScore}`;

let gameRunning = false;

// Function to reset the ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = ball.speed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = ball.speed * (Math.random() > 0.5 ? 1 : -1);
}

function update() {
    if (!gameRunning) return;

    // Update ball speed from input
    ball.speed = parseInt(ballSpeedInput.value);
    ball.dx = (ball.dx > 0) ? ball.speed : -ball.speed;
    ball.dy = (ball.dy > 0) ? ball.speed : -ball.speed;

    // Ball movement
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Paddle movement
    playerPaddle.y += playerPaddle.dy;

    // AI Paddle Movement
    const aiSpeed = 5;
    if (aiPaddle.y + aiPaddle.height / 2 < ball.y) {
        aiPaddle.y += aiSpeed;
    } else if (aiPaddle.y + aiPaddle.height / 2 > ball.y) {
        aiPaddle.y -= aiSpeed;
    }

    // Keep paddles within canvas bounds
    if (playerPaddle.y < 0) {
        playerPaddle.y = 0;
    }
    if (playerPaddle.y + playerPaddle.height > canvas.height) {
        playerPaddle.y = canvas.height - playerPaddle.height;
    }
     if (aiPaddle.y < 0) {
        aiPaddle.y = 0;
    }
    if (aiPaddle.y + aiPaddle.height > canvas.height) {
        aiPaddle.y = canvas.height - aiPaddle.height;
    }


    // Bounce off top and bottom edges
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    // Bounce off paddles
    if (ball.x - ball.radius < playerPaddle.x + playerPaddle.width &&
        ball.x > playerPaddle.x &&
        ball.y > playerPaddle.y &&
        ball.y < playerPaddle.y + playerPaddle.height) {
        ball.dx = -ball.dx;
    }

    if (ball.x + ball.radius > aiPaddle.x &&
        ball.x < aiPaddle.x + aiPaddle.width &&
        ball.y > aiPaddle.y &&
        ball.y < aiPaddle.y + aiPaddle.height) {
        ball.dx = -ball.dx;
    }

    // Scoring
    if (ball.x - ball.radius < 0) {
        aiScore++;
        resetBall();
    }

    if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Game over condition
    if (playerScore >= 5 || aiScore >= 5) {
        gameRunning = false;
        lastScore = `Player: ${playerScore}, AI: ${aiScore}`;
        localStorage.setItem('lastScore', lastScore);
        lastScoreDiv.textContent = `Last Score: ${lastScore}`;
        playerScore = 0;
        aiScore = 0;
    }


    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();

    // Draw scores
    ctx.font = '20px Arial';
    ctx.fillText(`Player: ${playerScore}`, 50, 30);
    ctx.fillText(`AI: ${aiScore}`, canvas.width - 150, 30);
}

// Event listeners
startButton.addEventListener('click', () => {
    gameRunning = true;
    resetBall();
    update();
});

// WASD controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'w') {
        playerPaddle.dy = -5;
    } else if (e.key === 's') {
        playerPaddle.dy = 5;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 's') {
        playerPaddle.dy = 0;
    }
});

// Touch controls
canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchY = touch.clientY - rect.top;
    playerPaddle.y = touchY - playerPaddle.height / 2;
});

canvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchY = touch.clientY - rect.top;
    playerPaddle.y = touchY - playerPaddle.height / 2;
    e.preventDefault(); // Prevent scrolling
});

// Mouse (cursor) controls
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    playerPaddle.y = e.clientY - rect.top - playerPaddle.height / 2;
});
