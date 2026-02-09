const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreVal');

const GRAVITY = 0.25;
const FLAP_STRENGTH = -5;
const PIPE_SPEED = 2;
const PIPE_SPAWN_RATE = 90; 
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

let birdY, birdVelocity, pipes, score, frame, gameOver;

function init() {
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pipes = [];
    score = 0;
    frame = 0;
    gameOver = false;
    scoreElement.innerText = score;
    animate();
}

function createPipe() {
    const minPipeHeight = 50;
    const maxPipeHeight = canvas.height - PIPE_GAP - minPipeHeight;
    const topHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
    pipes.push({ x: canvas.width, top: topHeight });
}

function update() {
    if (gameOver) return;

    birdVelocity += GRAVITY;
    birdY += birdVelocity;

    if (birdY + 10 > canvas.height || birdY - 10 < 0) {
        gameOver = true;
    }

    if (frame % PIPE_SPAWN_RATE === 0) createPipe();

    pipes.forEach((pipe, i) => {
        pipe.x -= PIPE_SPEED;

        if (50 + 10 > pipe.x && 50 - 10 < pipe.x + PIPE_WIDTH) {
            if (birdY - 10 < pipe.top || birdY + 10 > pipe.top + PIPE_GAP) {
                gameOver = true;
            }
        }

        if (pipe.x + PIPE_WIDTH === 50) {
            score++;
            scoreElement.innerText = score;
        }

        if (pipe.x + PIPE_WIDTH < 0) pipes.splice(i, 1);
    });

    frame++;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#FFEB3B";
    ctx.beginPath();
    ctx.arc(50, birdY, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.stroke();

    ctx.fillStyle = "#4CAF50";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
        ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
        
        ctx.fillRect(pipe.x, pipe.top + PIPE_GAP, PIPE_WIDTH, canvas.height);
        ctx.strokeRect(pipe.x, pipe.top + PIPE_GAP, PIPE_WIDTH, canvas.height);
    });

    if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "20px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
        ctx.fillText("Press Space or Tap to Restart", canvas.width / 2, canvas.height / 2 + 30);
    }
}

function animate() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(animate);
    }
}

function handleInput() {
    if (gameOver) {
        init();
    } else {
        birdVelocity = FLAP_STRENGTH;
    }
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') handleInput();
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleInput();
});

init();