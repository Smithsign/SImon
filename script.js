const sequence = [];
let playerSequence = [];
let score = 0;
let acceptingInput = false;

const sounds = [
  new Audio('sound1.wav'),
  new Audio('sound2.wav'),
  new Audio('sound3.wav'),
  new Audio('sound4.wav'),
  new Audio('sound5.wav'),
  new Audio('sound6.wav'),
];

const startBtn = document.getElementById('startBtn');
const gameBoard = document.getElementById('gameBoard');
const tiles = document.querySelectorAll('.tile');
const gameOverPopup = document.getElementById('gameOverPopup');
const scoreDisplay = document.getElementById('scoreDisplay');

startBtn.addEventListener('click', () => {
  startBtn.style.display = 'none';
  gameBoard.style.display = 'grid';
  startGame();
});

function startGame() {
  sequence.length = 0;
  playerSequence = [];
  score = 0;
  nextRound();
}

function nextRound() {
  const randomIndex = Math.floor(Math.random() * tiles.length);
  sequence.push(randomIndex);
  playerSequence = [];
  acceptingInput = false;
  playSequence();
}

function playSequence() {
  sequence.forEach((tileIndex, i) => {
    setTimeout(() => {
      flashTile(tileIndex);
      if (i === sequence.length - 1) {
        setTimeout(() => acceptingInput = true, 600);
      }
    }, 700 * i);
  });
}

function flashTile(index) {
  const tile = tiles[index];
  tile.style.opacity = 0.5;
  sounds[index].play();
  setTimeout(() => tile.style.opacity = 1, 300);
}

tiles.forEach((tile) => {
  tile.addEventListener('click', () => {
    if (!acceptingInput) return;

    const clickedIndex = parseInt(tile.dataset.id);
    flashTile(clickedIndex);
    playerSequence.push(clickedIndex);

    if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
      gameOver();
    } else if (playerSequence.length === sequence.length) {
      score++;
      acceptingInput = false;
      setTimeout(nextRound, 1000);
    }
  });
});

function gameOver() {
  scoreDisplay.textContent = score;
  gameOverPopup.style.display = 'block';

  fetch('game.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `score=${score}`
  });
}

function resetGame() {
  gameOverPopup.style.display = 'none';
  startGame();
}

function shareScore() {
  const tweet = `https://twitter.com/intent/tweet?text=I scored ${score} on Simon Arcade! Try to beat me!`;
  window.open(tweet, '_blank');
}
