const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

let ball = {
  x: centerX,
  y: centerY,
  radius: 10,
  vx: 4,
  vy: 3
};

// Each circle is a level
let levels = [
  { radius: 120, holeSize: Math.PI / 12 }, // small hole
  { radius: 200, holeSize: Math.PI / 10 },
  { radius: 300, holeSize: Math.PI / 8 },
  { radius: 430, holeSize: Math.PI / 6 }
];

let currentLevel = 0;

function drawCircle(level, color) {
  const r = level.radius;
  const hole = level.holeSize;
  const holeStart = -Math.PI / 2 - hole / 2;
  const holeEnd   = -Math.PI / 2 + hole / 2;

  ctx.strokeStyle = color;
  ctx.lineWidth = 5;

  ctx.beginPath();
  ctx.arc(centerX, centerY, r, holeEnd, holeStart + Math.PI * 2);
  ctx.stroke();
}

function checkEscape() {
  const level = levels[currentLevel];
  const dx = ball.x - centerX;
  const dy = ball.y - centerY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist + ball.radius < level.radius) return false;

  const angle = Math.atan2(dy, dx);
  const holeStart = -Math.PI / 2 - level.holeSize / 2;
  const holeEnd = -Math.PI / 2 + level.holeSize / 2;

  if (angle > holeStart && angle < holeEnd) return true;

  // Otherwise bounce
  const normalAngle = Math.atan2(dy, dx);
  const normalX = Math.cos(normalAngle);
  const normalY = Math.sin(normalAngle);
  const dot = ball.vx * normalX + ball.vy * normalY;
  ball.vx -= 2 * dot * normalX;
  ball.vy -= 2 * dot * normalY;
  return false;
}

function update() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  if (checkEscape()) {
    currentLevel++;
    if (currentLevel < levels.length) {
      ball.radius += 8;
    } else {
      ball.vx = 0;
      ball.vy = 0;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < levels.length; i++) {
    drawCircle(levels[i], i === currentLevel ? "rgb(0,255,255)" : "rgb(60,60,60)");
  }

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "rgb(255,100,100)";
  ctx.fill();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
