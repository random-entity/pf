const canvas = document.getElementById("graphics_torus");
const ctx = canvas.getContext("2d");
canvas.width = 256;
canvas.height = 128;

let size = 20;
let rx = 8;
let ry = 2;

let posX = canvas.width / 2;
let posY = canvas.height / 2 - size;
let angle = 0;

function drawFlower() {
  ctx.fillStyle = "gray";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(posX, posY, size, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function animate() {
  drawFlower();

  posX += rx * Math.cos(angle);
  posY += ry * Math.sin(angle);
  angle += 0.1;
  requestAnimationFrame(animate);
}

animate();
