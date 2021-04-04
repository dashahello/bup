/**
 * Since we start calculating position of bubble from the top left corner
 * and the bubble being a max size of 200 and able to grow 100 in each direction..
 * the min x y should be 100
 *
 * without taking scaling into consideration, the max y value should be 700 - 200
 * when also taking scaling into consideration, the max y value should be 700 - 200 - 100
 * because the bubble can grow in size by 100 pixels max in EVERY direction
 *
 * to make the bubble not scale out of the screen on the right side.......
 * we should do something like: window.innerWidth - 200 - 100
 *
 *
 * minX = maxBubbleSize / 2
 * minY = maxBubbleSize / 2
 *
 * maxX = window.innerWidth - maxBubbleSize - (maxBubbleSize / 2)
 * maxY = window.innerHeight - maxBubbleSize - (maxBubbleSize / 2)
 */

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomRgbString(maxChannelValue) {
  return `rgb( ${Math.random() * maxChannelValue}, ${
    Math.random() * maxChannelValue
  }, ${Math.random() * maxChannelValue})`;
}

const bubbles = document.getElementById('bubbles');
const score = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const message = document.getElementById('message');
const countdownDiv = document.getElementById('countdown_div');
const popSound = document.getElementById('sound1');
const countdownSound = document.getElementById('sound2');

let bubbleDiv;
let remainingTime;
let onBubbleClick;
let count;
let posX;
let posY;

function createDiv() {
  const maxBubbleHeight = (window.innerHeight / 100) * 42.8571428571;
  const minBubbleHeight = (window.innerHeight / 100) * 7.14285714286;

  const maxBubbleWidth = (window.innerWidth / 100) * 21.9619326501;
  const minBubbleWidth = (window.innerWidth / 100) * 3.66032210835;

  const maxBubbleSize =
    maxBubbleHeight < maxBubbleWidth ? maxBubbleHeight : maxBubbleWidth;

  const minBubbleSize =
    minBubbleHeight < minBubbleWidth ? minBubbleHeight : minBubbleWidth;

  message.innerHTML = '';

  const bubbleSize = randomNumberBetween(maxBubbleSize, minBubbleSize);

  const color = randomRgbString(250);

  posX = randomNumberBetween(
    bubbleSize / 2,
    window.innerWidth - bubbleSize - bubbleSize / 2
  );
  posY = randomNumberBetween(
    bubbleSize / 2,
    window.innerHeight - bubbleSize - bubbleSize / 2
  );

  bubbleDiv = document.createElement('div');
  bubbleDiv.id = 'bubble';
  bubbleDiv.style.width = bubbleSize + 'px';
  bubbleDiv.style.height = bubbleSize + 'px';
  bubbleDiv.style.background = color;
  bubbleDiv.style.top = posY + 'px';
  bubbleDiv.style.left = posX + 'px';

  bubbles.appendChild(bubbleDiv);

  onBubbleClick = () => {
    popSound.play();

    count++;

    removeDiv();
    createDiv();
  };
  //checking if the correct ellement (div id="bubble") was clicked
  //removing and creating new bubble div if user miscklicks
  window.onclick = function (event) {
    if (event.target.id === 'bubble') {
      onBubbleClick();
    } else {
      removeDiv();
      createDiv();
    }
  };

  bubbleDiv.addEventListener('click', onBubbleClick);
}

function removeDiv() {
  if (onBubbleClick) {
    bubbleDiv.removeEventListener('click', onBubbleClick);
  }

  bubbles.removeChild(bubbleDiv);
}

let timer;

function startGame() {
  countdownDiv.style.display = 'block';

  remainingTime = 30;
  timer = setInterval(countdown, 1000); //set the countdown to every second

  createDiv();
  countdown();
  count = 0;
  score.style.display = 'none';
  startBtn.style.display = 'none';

  // setTimeout(() => {
  //   // startBtn.removeEventListener("click", startGame);
  //   score.style.display = "block";
  //   startBtn.style.display = "block";
  //   bubbleDiv.style.display = "none";
  //   score.innerHTML = `YOUR SCORE: ${count}`;
  //   return (message.innerHTML = `${
  //     count < 4 ? `You can do better!!!` : `Good job!!!`
  //   }`);
  // }, 3000);
}

function countdown() {
  if (remainingTime > 0) {
    if (remainingTime <= 3) {
      countdownSound.play();
    }
    countdownDiv.innerHTML = `${remainingTime} left`;
    remainingTime--; //we subtract the second each iteration
  } else {
    clearTimeout(timer);
    showResult();
  }
}
//
//
function showResult() {
  // startBtn.removeEventListener("click", startGame);

  countdownDiv.style.display = 'none';

  score.style.display = 'block';
  startBtn.style.display = 'block';
  bubbleDiv.style.display = 'none';
  score.innerHTML = `YOUR SCORE: ${count}`;

  return (message.innerHTML = `${
    count < 40 ? `You can do better!!!` : `Good job!!!`
  }`);
}

startBtn.addEventListener('click', startGame);
