const svg = document.getElementById('game');
const pacmanGroup = document.getElementById('pacman');
const foodGroup = document.getElementById('food');
const ghostsGroup = document.getElementById('ghosts');
const scoreEl = document.getElementById('score');

const TILE_SIZE = 20;
const ROWS = 20;
const COLS = 20;

let score = 0;

// Improved 20x20 grid maze (0 = wall, 1 = dot)
const maze = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,1,0],
  [0,1,0,1,0,1,0,1,0,0,1,0,0,1,0,1,1,1,0,0],
  [0,1,0,1,0,1,1,1,1,0,1,1,1,1,1,0,1,0,1,0],
  [0,1,0,1,1,1,0,0,1,1,1,1,0,0,1,1,1,0,1,0],
  [0,1,0,0,0,1,0,1,0,1,1,0,1,0,1,0,0,0,1,0],
  [0,1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,0],
  [0,1,0,1,0,0,0,1,1,1,1,1,1,0,0,0,1,0,1,0],
  [0,1,0,1,1,1,0,0,0,1,1,0,0,0,1,1,1,0,1,0],
  [0,1,0,0,0,1,1,1,0,1,1,0,1,1,1,0,0,0,1,0],
  [0,1,0,0,0,1,1,1,0,1,1,0,1,1,1,0,0,0,1,0],
  [0,1,0,1,1,1,0,0,0,1,1,0,0,0,1,1,1,0,1,0],
  [0,1,0,1,0,0,0,1,1,1,1,1,1,0,0,0,1,0,1,0],
  [0,1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,0],
  [0,1,0,0,0,1,0,1,0,1,1,0,1,0,1,0,0,0,1,0],
  [0,1,0,1,1,1,0,0,1,1,1,1,0,0,1,1,1,0,1,0],
  [0,1,0,1,0,1,1,1,1,0,0,1,1,1,1,1,1,0,1,0],
  [0,1,0,1,0,1,0,1,0,0,1,1,0,1,0,1,0,1,0,0],
  [0,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  
];

const pacman = { x: 1, y: 1, dx: 0, dy: 0 };
const ghost = { x: 10, y: 10, dx: 0, dy: 0, color: 'red' }; // Single ghost controlled by the player

function drawMaze() {
  foodGroup.innerHTML = '';
  const wallsGroup = document.getElementById('walls');
  wallsGroup.innerHTML = ''; // Clear existing walls

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (maze[y][x] === 1) {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', x * TILE_SIZE + TILE_SIZE / 2);
        dot.setAttribute('cy', y * TILE_SIZE + TILE_SIZE / 2);
        dot.setAttribute('r', 3);
        dot.setAttribute('fill', 'white');
        foodGroup.appendChild(dot);
      } else if (maze[y][x] === 0) {
        const wall = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        wall.setAttribute('x', x * TILE_SIZE);
        wall.setAttribute('y', y * TILE_SIZE);
        wall.setAttribute('width', TILE_SIZE);
        wall.setAttribute('height', TILE_SIZE);
        wall.setAttribute('fill', 'blue');
        wallsGroup.appendChild(wall);
      }
    }
  }
}

function drawEntities() {
  pacmanGroup.innerHTML = '';
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  p.setAttribute('cx', pacman.x * TILE_SIZE + TILE_SIZE / 2);
  p.setAttribute('cy', pacman.y * TILE_SIZE + TILE_SIZE / 2);
  p.setAttribute('r', TILE_SIZE / 2 - 2);
  p.setAttribute('fill', 'yellow');
  pacmanGroup.appendChild(p);

  ghostsGroup.innerHTML = '';
  const ghostEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  ghostEl.setAttribute('cx', ghost.x * TILE_SIZE + TILE_SIZE / 2);
  ghostEl.setAttribute('cy', ghost.y * TILE_SIZE + TILE_SIZE / 2);
  ghostEl.setAttribute('r', TILE_SIZE / 2 - 2);
  ghostEl.setAttribute('fill', ghost.color);
  ghostsGroup.appendChild(ghostEl);
}

function canMove(x, y) {
  return maze[y] && maze[y][x] !== 0;
}

function update() {
  // Pac-Man move
  const nextX = pacman.x + pacman.dx;
  const nextY = pacman.y + pacman.dy;
  if (canMove(nextX, nextY)) {
    pacman.x = nextX;
    pacman.y = nextY;
    if (maze[pacman.y][pacman.x] === 1) {
      maze[pacman.y][pacman.x] = 2;
      score += 10;
      scoreEl.textContent = score;
    }
  }

  // Ghost move
  const ghostNextX = ghost.x + ghost.dx;
  const ghostNextY = ghost.y + ghost.dy;
  if (canMove(ghostNextX, ghostNextY)) {
    ghost.x = ghostNextX;
    ghost.y = ghostNextY;
  }

  // Collision
  if (ghost.x === pacman.x && ghost.y === pacman.y) {
    localStorage.setItem('score', score); // Save score
    window.location.href = 'gameover.html'; // Redirect to game over page
  }
}

function gameLoop() {
  update();
  drawMaze();
  drawEntities();
  setTimeout(gameLoop, 200);
}

document.addEventListener('keydown', e => {
  // Pac-Man controls (Arrow keys)
  if (e.key === 'ArrowUp') { pacman.dx = 0; pacman.dy = -1; }
  if (e.key === 'ArrowDown') { pacman.dx = 0; pacman.dy = 1; }
  if (e.key === 'ArrowLeft') { pacman.dx = -1; pacman.dy = 0; }
  if (e.key === 'ArrowRight') { pacman.dx = 1; pacman.dy = 0; }

  // Ghost controls (WASD keys)
  if (e.key === 'w') { ghost.dx = 0; ghost.dy = -1; }
  if (e.key === 's') { ghost.dx = 0; ghost.dy = 1; }
  if (e.key === 'a') { ghost.dx = -1; ghost.dy = 0; }
  if (e.key === 'd') { ghost.dx = 1; ghost.dy = 0; }
});

// Start game
drawMaze();
gameLoop();
