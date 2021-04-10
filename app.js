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
const miscklickDiv = document.getElementById('miscklick_div');
let miscklicksCheckBox = document.getElementById('miscklick');
const timerDiv = document.getElementById('timer_div');
const customizedTimer = document.getElementById('customized_timer');

let bubbleDiv;
let remainingTime;
let timer;
let onBubbleClick;
let count;
let posX;
let posY;
let bubbleLifetime;

function setTimer() {
  if (customizedTimer.value < 10) {
    customizedTimer.value = 10;
  } else if (customizedTimer.value > 60) {
    customizedTimer.value = 60;
  }

  remainingTime = customizedTimer.value;
}

function createBubble() {
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

  bubbleLifetime = setTimeout(function () {
    removeAndCreateNew();
  }, 1000);

  if (!miscklicksCheckBox.checked) {
    bubbleDiv.addEventListener('click', onBubbleClick);
  }
}

function removeBubble() {
  bubbles.removeChild(bubbleDiv);
  if (!miscklicksCheckBox.checked) {
    bubbleDiv.removeEventListener('click', onBubbleClick);
  }
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
    endGame();
  }
}

function startGame() {
  if (miscklicksCheckBox.checked) {
    window.addEventListener('click', onClickFunction);
  }
  setTimer();

  miscklickDiv.style.display = 'none';
  countdownDiv.style.display = 'block';
  timerDiv.style.display = 'none';

  timer = setInterval(countdown, 1000); //set the countdown to every second
  createBubble();
  countdown();
  count = 0;
  score.style.display = 'none';
  startBtn.style.display = 'none';
}

function endGame() {
  if (miscklicksCheckBox.checked) {
    window.removeEventListener('click', onClickFunction, false);
  }

  clearTimeout(bubbleLifetime);

  miscklickDiv.style.display = 'block';
  countdownDiv.style.display = 'none';
  timerDiv.style.display = 'block';
  score.style.display = 'block';
  startBtn.style.display = 'block';
  bubbleDiv.style.display = 'none';

  score.innerHTML = `YOUR SCORE: ${count}`;

  return (message.innerHTML = `${
    count <
    parseInt(customizedTimer.value) +
      (parseInt(customizedTimer.value) / 100) * 30 //30% from timer
      ? `You can do better!!!`
      : `Good job!!!`
  }`);
}

removeAndCreateNew = () => {
  removeBubble();
  createBubble();
};

onBubbleClick = () => {
  popSound.play();
  clearTimeout(bubbleLifetime);
  count++;
  removeBubble();
  createBubble();
};

onClickFunction = (event) => {
  if (event.target.id === 'bubble') {
    onBubbleClick();
  } else if (event.target.id === 'startBtn') {
    console.log('game started');
  } else {
    clearTimeout(bubbleLifetime);
    count--;
    removeBubble();
    createBubble();
  }
};

startBtn.addEventListener('click', startGame);
