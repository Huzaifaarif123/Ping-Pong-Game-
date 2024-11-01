const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Constants
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const paddleWidth = 10;
const paddleHeight = 100;
const paddleSpeed = 6;

const ballRadius = 10;
const initialBallSpeed = 5;

// Player Objects
const player1 = {
    x: 10,
    y: (canvasHeight - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    score: 0
};

const player2 = {
    x: canvasWidth - paddleWidth - 10,
    y: (canvasHeight - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    score: 0
};

// Ball Object
const ball = {
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    radius: ballRadius,
    speed: initialBallSpeed,
    dx: initialBallSpeed,
    dy: initialBallSpeed
};

// Keyboard Controls
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    w: false,
    s: false
};

// Event Listeners for Keyboard
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') keys.ArrowUp = true;
    if (e.key === 'ArrowDown') keys.ArrowDown = true;
    if (e.key === 'w') keys.w = true;
    if (e.key === 's') keys.s = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') keys.ArrowUp = false;
    if (e.key === 'ArrowDown') keys.ArrowDown = false;
    if (e.key === 'w') keys.w = false;
    if (e.key === 's') keys.s = false;
});

// Draw Rectangle (Paddle)
function drawRect(x, y, width, height, color = '#fff') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// Draw Circle (Ball)
function drawBall(x, y, radius, color = '#fff') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

// Draw Net
function drawNet() {
    ctx.strokeStyle = '#fff';
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(canvasWidth / 2, 0);
    ctx.lineTo(canvasWidth / 2, canvasHeight);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Update Paddle Positions
function updatePaddles() {
    // Player 1 Controls (W and S)
    if (keys.w && player1.y > 0) {
        player1.y -= paddleSpeed;
    }
    if (keys.s && player1.y + player1.height < canvasHeight) {
        player1.y += paddleSpeed;
    }

    // Player 2 Controls (Arrow Up and Arrow Down)
    if (keys.ArrowUp && player2.y > 0) {
        player2.y -= paddleSpeed;
    }
    if (keys.ArrowDown && player2.y + player2.height < canvasHeight) {
        player2.y += paddleSpeed;
    }
}

// Reset Ball to Center
function resetBall() {
    ball.x = canvasWidth / 2;
    ball.y = canvasHeight / 2;
    ball.speed = initialBallSpeed;
    // Randomize initial direction
    ball.dx = ball.speed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = ball.speed * (Math.random() > 0.5 ? 1 : -1);
}

// Update Ball Position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top and Bottom Collision
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvasHeight) {
        ball.dy *= -1;
    }

    // Left and Right Collision (Scoring)
    if (ball.x - ball.radius < 0) {
        player2.score += 1;
        updateScore();
        resetBall();
    } else if (ball.x + ball.radius > canvasWidth) {
        player1.score += 1;
        updateScore();
        resetBall();
    }

    // Paddle Collision
    // Player 1
    if (
        ball.x - ball.radius < player1.x + player1.width &&
        ball.y > player1.y &&
        ball.y < player1.y + player1.height
    ) {
        ball.dx = Math.abs(ball.dx);
        ball.speed += 0.5;
        ball.dx = ball.speed;
    }

    // Player 2
    if (
        ball.x + ball.radius > player2.x &&
        ball.y > player2.y &&
        ball.y < player2.y + player2.height
    ) {
        ball.dx = -Math.abs(ball.dx);
        ball.speed += 0.5;
        ball.dx = -ball.speed;
    }
}

// Update Scores in UI
function updateScore() {
    document.getElementById('player1Score').innerText = player1.score;
    document.getElementById('player2Score').innerText = player2.score;
}

// Draw Everything
function draw() {
    // Clear Canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw Net
    drawNet();

    // Draw Paddles
    drawRect(player1.x, player1.y, player1.width, player1.height);
    drawRect(player2.x, player2.y, player2.width, player2.height);

    // Draw Ball
    drawBall(ball.x, ball.y, ball.radius);
}

// Game Loop
function gameLoop() {
    updatePaddles();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Restart Button
document.getElementById('restartButton').addEventListener('click', () => {
    player1.score = 0;
    player2.score = 0;
    updateScore();
    resetBall();
});

// Initialize Game
updateScore();
resetBall();
gameLoop();
