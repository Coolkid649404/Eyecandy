const canvas = document.getElementById('fightCanvas');
const ctx = canvas.getContext('2d');

let player = { x: 290, y: 190, size: 10, speed: 4 };
let bullets = [];
let hp = 20;

function drawPlayer() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(player.x - 5, player.y + 10);
    ctx.lineTo(player.x + 5, player.y + 10);
    ctx.closePath();
    ctx.fill();
}

function drawBullets() {
    ctx.fillStyle = 'white';
    bullets.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function moveBullets() {
    bullets.forEach(b => {
        b.x += b.vx;
        b.y += b.vy;
    });
    bullets = bullets.filter(b => b.x > 0 && b.x < canvas.width && b.y > 0 && b.y < canvas.height);
}

function spawnBullet() {
    let angle = Math.random() * 2 * Math.PI;
    let speed = 2 + Math.random() * 2;
    bullets.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 5
    });
}

function detectCollisions() {
    bullets.forEach(b => {
        let dx = player.x - b.x;
        let dy = player.y - b.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < player.size + b.size) {
            hp -= 1;
            document.getElementById('hp').innerText = `HP: ${hp}`;
            bullets.splice(bullets.indexOf(b), 1);
            if (hp <= 0) {
                alert('GAME OVER');
                location.reload();
            }
        }
    });
}

// Keyboard controls
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && player.x > 5) player.x -= player.speed;
    if (e.key === 'ArrowRight' && player.x < canvas.width - 5) player.x += player.speed;
    if (e.key === 'ArrowUp' && player.y > 5) player.y -= player.speed;
    if (e.key === 'ArrowDown' && player.y < canvas.height - 15) player.y += player.speed;
});

// Touch controls
function moveTouch(direction) {
    if (direction === 'left' && player.x > 5) player.x -= player.speed;
    if (direction === 'right' && player.x < canvas.width - 5) player.x += player.speed;
    if (direction === 'up' && player.y > 5) player.y -= player.speed;
    if (direction === 'down' && player.y < canvas.height - 15) player.y += player.speed;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    moveBullets();
    detectCollisions();
    requestAnimationFrame(gameLoop);
}

setInterval(spawnBullet, 500);
gameLoop();
