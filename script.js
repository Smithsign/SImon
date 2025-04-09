const sequence = [];
let playerSequence = [];
let score = 0;
let acceptingInput = false;

const sounds = {
  0: new Audio('DO.wav'),
  1: new Audio('RE.wav'),
  2: new Audio('MI.wav'),
  3: new Audio('FA.wav'),
  4: new Audio('SI.wav'),
  5: new Audio('LA.wav'),
};

const bgMusic = new Audio('bg-music.wav');
bgMusic.loop = true;
bgMusic.volume = 0.2;

const gameOverSound = new Audio('gameover.wav');

const startBtn = document.getElementById('startBtn');
const gameBoard = document.getElementById('gameBoard');
const tiles = document.querySelectorAll('.tile');
const gameOverPopup = document.getElementById('gameOverPopup');
const scoreDisplay = document.getElementById('scoreDisplay');

startBtn.addEventListener('click', () => {
  startBtn.style.display = 'none';
  gameBoard.style.display = 'grid';
  bgMusic.play();
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

async function playSequence() {
  for (let i = 0; i < sequence.length; i++) {
    const tileIndex = sequence[i];
    await flashTile(tileIndex);
  }
  acceptingInput = true;
}

function flashTile(index) {
  return new Promise((resolve) => {
    const tile = tiles[index];
    playSound(index);
    tile.style.opacity = 0.5;
    setTimeout(() => {
      tile.style.opacity = 1;
      setTimeout(resolve, 300);
    }, 600);
  });
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
  bgMusic.pause();
  gameOverSound.play();
  scoreDisplay.textContent = score;
  gameOverPopup.style.display = 'block';
}

function resetGame() {
  gameOverPopup.style.display = 'none';
  bgMusic.play();
  startGame();
}

function playSound(index) {
  if (sounds[index]) {
    sounds[index].currentTime = 0;
    sounds[index].play();
  }
}

function shareScore() {
  const tweet = `https://twitter.com/intent/tweet?text=I scored ${score} on Simon SIGN! 🔥 Play it here: https://s-imon.vercel.app/`;
  window.open(tweet, '_blank');
}
