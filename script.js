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

function playSound(index) {
  if (sounds[index]) {
    sounds[index].currentTime = 0;
    sounds[index].play();
  }
}

function stopSound(index) {
  if (sounds[index]) {
    sounds[index].pause();
    sounds[index].currentTime = 0;
  }
}

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
    playSound(index);  // Start playing the sound
    tile.style.opacity = 0.5;  // Highlight the tile
    setTimeout(() => {
      tile.style.opacity = 1;  // Stop highlighting the tile
      stopSound(index);  // Stop the sound
      setTimeout(resolve, 300); // Wait before the next tile
    }, 600); // 600ms for visual highlight
  });
}

tiles.forEach((tile) => {
  tile.addEventListener('click', () => {
    if (!acceptingInput) return;

    const clickedIndex = parseInt(tile.dataset.id);
    flashTile(clickedIndex); // Visual + sound feedback
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

  fetch('game.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `score=${score}`
  });
}

function resetGame() {
  gameOverPopup.style.display = 'none';
  bgMusic.play();
  startGame();
}

function shareScore() {
  const scoreText = `I scored ${score} on Simon SIGN 🎮🔥! Try to beat me!`;
  const gameURL = 'https://your-vercel-link.vercel.app'; // replace this with your actual game URL
  const imageURL = 'https://your-vercel-link.vercel.app/screenshot.jpg'; // replace with a hosted image

  const tweetText = encodeURIComponent(`${scoreText}\n${gameURL}`);
  const tweetImage = encodeURIComponent(imageURL); // currently won't embed as an image via X API, but good to include

  const tweetURL = `https://twitter.com/intent/tweet?text=${tweetText}`;

  window.open(tweetURL, '_blank');
}

}
