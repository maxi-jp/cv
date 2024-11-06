// Tetris game constants
const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 30;
const COLORS = [
  'cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'
];

// Initialize the grid
const grid = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(''));

// Tetromino shapes
const SHAPES = [
  [[1, 1, 1, 1]],  // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
  [[1, 0, 0], [1, 1, 1]], // L
  [[0, 0, 1], [1, 1, 1]]  // J
];

// Current tetromino
let currentShape;
let currentX, currentY;
let gameOver = false;
let score = 0;

// Function to draw the grid
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      if (grid[row][col]) {
        ctx.fillStyle = grid[row][col];
        ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }
}

// Function to draw the active tetromino
function drawTetromino() {
  for (let row = 0; row < currentShape.length; row++) {
    for (let col = 0; col < currentShape[row].length; col++) {
      if (currentShape[row][col]) {
        ctx.fillStyle = COLORS[SHAPES.indexOf(currentShape)];
        ctx.fillRect((currentX + col) * BLOCK_SIZE, (currentY + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }
}

// Function to check if the current tetromino position is valid
function isValidMove() {
  for (let row = 0; row < currentShape.length; row++) {
    for (let col = 0; col < currentShape[row].length; col++) {
      if (currentShape[row][col]) {
        let x = currentX + col;
        let y = currentY + row;
        if (x < 0 || x >= COLUMNS || y >= ROWS || grid[y] && grid[y][x]) {
          return false;
        }
      }
    }
  }
  return true;
}

// Function to place the tetromino on the grid
function placeTetromino() {
  for (let row = 0; row < currentShape.length; row++) {
    for (let col = 0; col < currentShape[row].length; col++) {
      if (currentShape[row][col]) {
        grid[currentY + row][currentX + col] = COLORS[SHAPES.indexOf(currentShape)];
      }
    }
  }
  clearLines();
  if (currentY <= 0) {
    gameOver = true; // Game over if a new tetromino can't fit
  }
}

// Function to clear full lines
function clearLines() {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (grid[row].every(cell => cell !== '')) {
      grid.splice(row, 1);
      grid.unshift(Array(COLUMNS).fill(''));
      score += 100;
    }
  }
}

// Function to generate a new random tetromino
function newTetromino() {
  const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  currentShape = randomShape;
  currentX = Math.floor(COLUMNS / 2) - Math.floor(currentShape[0].length / 2);
  currentY = 0;
  if (!isValidMove()) {
    gameOver = true; // Game over if the starting position is invalid
  }
}

// Function to handle keypresses
document.addEventListener('keydown', function (event) {
  if (gameOver) return;

  if (event.key === 'ArrowLeft') {
    currentX--;
    if (!isValidMove()) currentX++;
  } else if (event.key === 'ArrowRight') {
    currentX++;
    if (!isValidMove()) currentX--;
  } else if (event.key === 'ArrowDown') {
    currentY++;
    if (!isValidMove()) {
      currentY--;
      placeTetromino();
      newTetromino();
    }
  } else if (event.key === 'ArrowUp') {
    const rotatedShape = currentShape[0].map((_, i) => currentShape.map(row => row[i])).reverse();
    const originalShape = currentShape;
    currentShape = rotatedShape;
    if (!isValidMove()) {
      currentShape = originalShape;
    }
  }
});

// Game loop
function gameLoop() {
  if (gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', 100, canvas.height / 2);
    ctx.fillText('Score: ' + score, 100, canvas.height / 2 + 40);
    return;
  }

  drawGrid();
  drawTetromino();

  if (!gameOver) {
    currentY++;
    if (!isValidMove()) {
      currentY--;
      placeTetromino();
      newTetromino();
    }
  }

  //requestAnimationFrame(gameLoop);
}

// Start the game
newTetromino();
setInterval(gameLoop, 1000/2);
//gameLoop();
