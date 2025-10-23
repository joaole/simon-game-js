const greenBtn = document.getElementById("green");
const redBtn = document.getElementById("red");
const yellowBtn = document.getElementById("yellow");
const blueBtn = document.getElementById("blue");
const startButton = document.getElementById("startButton");
const scoreDisplay = document.getElementById("score");

const colorButtons = {
  green: greenBtn,
  red: redBtn,
  yellow: yellowBtn,
  blue: blueBtn,
};

const colors = ["green", "red", "yellow", "blue"];

// Game state variables
let order = [];
let playerOrder = [];
let score = 0;
let isPlayerTurn = false;
let gameOn = false;

/**
 * Creates a delay for a specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to delay.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Starts the Simon game.
 */
function startGame() {
  gameOn = true;
  score = 0;
  order = [];
  playerOrder = [];
  scoreDisplay.textContent = `Score: ${score}`;
  startButton.disabled = true;
  startButton.style.display = 'none';

  nextRound();
}

/**
 * Proceeds to the next round of the game.
 */
function nextRound() {
  isPlayerTurn = false;
  playerOrder = [];
  
  const randomColor = colors[Math.floor(Math.random() * 4)];
  order.push(randomColor);

  playSequence();
}

/**
 * Activates a button by adding a 'lit' class for a visual effect.
 * @param {string} color - The color of the button to activate.
 * @returns {Promise<void>} A promise that resolves after the button flash.
 */
function activateButton(color) {
  const button = colorButtons[color];
  
  return new Promise(resolve => {
    button.classList.add('lit');
    
    setTimeout(() => {
      button.classList.remove('lit');
      // A short delay before resolving to allow separation between sounds
      setTimeout(() => resolve(), 100);
    }, 350); // Flash time reduced for a snappier feel
  });
}

/**
 * Plays the current color sequence to the player.
 */
async function playSequence() {
  await sleep(700); // A brief pause before the sequence starts

  for (const color of order) {
    await activateButton(color);
    await sleep(200); // A short pause between colors
  }

  isPlayerTurn = true; // Allow player input after the sequence is shown
}

/**
 * Ends the game and displays the final score.
 */
function gameOver() {
  alert(`Game Over! Your final score was: ${score}`);
  gameOn = false;
  startButton.disabled = false;
  startButton.style.display = 'block';
}

/**
 * Checks the player's input against the generated order.
 */
function checkOrder() {
  const lastClickIndex = playerOrder.length - 1;
  
  // Check if the last clicked color is correct
  if (playerOrder[lastClickIndex] !== order[lastClickIndex]) {
    gameOver();
    return;
  }

  // Check if the player has completed the full sequence
  if (playerOrder.length === order.length) {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    isPlayerTurn = false; // Disable input while the next sequence plays
    setTimeout(nextRound, 1200); // Give a longer pause before the next round
  }
}

/**
 * Handles the player's click on a color button.
 * @param {MouseEvent} event - The click event.
 */
function handlePlayerClick(event) {
  if (!gameOn || !isPlayerTurn) return;

  const clickedColor = event.target.id;

  activateButton(clickedColor);
  playerOrder.push(clickedColor);
  checkOrder();
}

// --- Event Listeners Setup ---

startButton.addEventListener('click', startGame);
greenBtn.addEventListener('click', handlePlayerClick);
redBtn.addEventListener('click', handlePlayerClick);
yellowBtn.addEventListener('click', handlePlayerClick);
blueBtn.addEventListener('click', handlePlayerClick);
