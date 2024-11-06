const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Create the pong ball
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 5,
  dx: 5,
  dy: 5,
  color: "#fff",
};

// Create the paddles
const paddleWidth = 10, paddleHeight = 100;
const leftPaddle = {
  x: 0,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: "#fff",
  dy: 0
};

const rightPaddle = {
  x: canvas.width - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: "#fff",
  dy: 0
};

// Draw the ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

// Draw paddles
function drawPaddles() {
  ctx.beginPath();
  ctx.rect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  ctx.fillStyle = leftPaddle.color;
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.rect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
  ctx.fillStyle = rightPaddle.color;
  ctx.fill();
  ctx.closePath();
}

// Move the paddles
function movePaddles() {
  leftPaddle.y += leftPaddle.dy;
  rightPaddle.y += rightPaddle.dy;

  // Prevent paddles from going out of bounds
  if (leftPaddle.y < 0) leftPaddle.y = 0;
  if (leftPaddle.y + leftPaddle.height > canvas.height) leftPaddle.y = canvas.height - leftPaddle.height;

  if (rightPaddle.y < 0) rightPaddle.y = 0;
  if (rightPaddle.y + rightPaddle.height > canvas.height) rightPaddle.y = canvas.height - rightPaddle.height;
}

// Ball movement logic
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Ball collision with top and bottom walls
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.dy = -ball.dy;
  }

  // Ball collision with paddles
  if (ball.x - ball.radius < leftPaddle.x + leftPaddle.width && ball.y > leftPaddle.y && ball.y < leftPaddle.y + leftPaddle.height) {
    ball.dx = -ball.dx;
  }

  if (ball.x + ball.radius > rightPaddle.x && ball.y > rightPaddle.y && ball.y < rightPaddle.y + rightPaddle.height) {
    ball.dx = -ball.dx;
  }

  // Ball out of bounds (score)
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
  }
}

// Control paddles with keyboard
document.addEventListener("keydown", function (event) {
  if (event.key == "ArrowUp") {
    rightPaddle.dy = -10;
  }
  if (event.key == "ArrowDown") {
    rightPaddle.dy = 10;
  }
  if (event.key == "w") {
    leftPaddle.dy = -10;
  }
  if (event.key == "s") {
    leftPaddle.dy = 10;
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key == "ArrowUp" || event.key == "ArrowDown") {
    rightPaddle.dy = 0;
  }
  if (event.key == "w" || event.key == "s") {
    leftPaddle.dy = 0;
  }
});

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  drawBall();
  drawPaddles();
  moveBall();
  movePaddles();

  requestAnimationFrame(draw); // Keep drawing
}

// Start the game
draw();
