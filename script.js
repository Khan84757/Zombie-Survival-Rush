const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');

canvas.width = 400;
canvas.height = 500;

// Game Variables
let score = 0;
let health = 100;
let wave = 1;
let zombies = [];
let bullets = [];
let player = { x: 180, y: 400, width: 40, height: 40 };

// Movement Flags
let keys = {};

// Start Game
startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    startGame();
});

// Handle Player Movement
document.addEventListener('keydown', (e) => (keys[e.key] = true));
document.addEventListener('keyup', (e) => (keys[e.key] = false));

// Spawn Zombies
function spawnZombies() {
    for (let i = 0; i < wave * 2; i++) {
        zombies.push({
            x: Math.random() * (canvas.width - 40),
            y: Math.random() * -300,
            width: 30,
            height: 30,
            speed: 1 + wave * 0.5,
        });
    }
}

// Draw Player
function drawPlayer() {
    ctx.fillStyle = '#4caf50';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Move Player
function movePlayer() {
    if (keys['ArrowLeft'] && player.x > 0) player.x -= 5;
    if (keys['ArrowRight'] && player.x + player.width < canvas.width) player.x += 5;
    if (keys['ArrowUp'] && player.y > 0) player.y -= 5;
    if (keys['ArrowDown'] && player.y + player.height < canvas.height) player.y += 5;
}

// Shoot Bullets
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        bullets.push({
            x: player.x + player.width / 2 - 5,
            y: player.y,
            width: 5,
            height: 10,
            speed: 5,
        });
    }
});

// Draw Bullets
function drawBullets() {
    ctx.fillStyle = '#ff5722';
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        if (bullet.y < 0) bullets.splice(index, 1);
    });
}

// Draw Zombies
function drawZombies() {
    ctx.fillStyle = '#e63946';
    zombies.forEach((zombie, index) => {
        zombie.y += zombie.speed;
        ctx.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);

        // Check collision with player
        if (
            zombie.x < player.x + player.width &&
            zombie.x + zombie.width > player.x &&
            zombie.y < player.y + player.height &&
            zombie.y + zombie.height > player.y
        ) {
            zombies.splice(index, 1);
            health -= 10;
        }

        // Check if zombie reaches bottom
        if (zombie.y > canvas.height) {
            zombies.splice(index, 1);
            health -= 5;
        }
    });
}

// Handle Bullet Collision
function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        zombies.forEach((zombie, zIndex) => {
            if (
                bullet.x < zombie.x + zombie.width &&
                bullet.x + bullet.width > zombie.x &&
                bullet.y < zombie.y + zombie.height &&
                bullet.y + bullet.height > zombie.y
            ) {
                bullets.splice(bIndex, 1);
                zombies.splice(zIndex, 1);
                score += 10;
            }
        });
    });
}

// Update HUD
function updateHUD() {
    document.getElementById('score').textContent = score;
    document.getElementById('health').textContent = health;
    document.getElementById('wave').textContent = wave;
}

// Main Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    movePlayer();

    drawBullets();
    drawZombies();

    checkCollisions();
    updateHUD();

    if (zombies.length === 0) {
        wave++;
        spawnZombies();
    }

    if (health <= 0) {
        alert('Game Over! Final Score: ' + score);
        location.reload();
    } else {
        requestAnimationFrame(gameLoop);
    }
}

// Start Game
function startGame() {
    spawnZombies();
    gameLoop();
        }
