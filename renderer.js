const WORK_TIME = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;

const STATES = {
  WORK: '工作',
  SHORT_BREAK: '短休息',
  LONG_BREAK: '长休息'
};

let currentTime = WORK_TIME;
let totalTime = WORK_TIME;
let state = STATES.WORK;
let pomodoroCount = 0;
let timerInterval = null;
let isRunning = false;

const timeEl = document.getElementById('time');
const statusEl = document.getElementById('status');
const progressCircle = document.getElementById('progress-circle');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const pomodoroDots = document.getElementById('pomodoro-dots');

const CIRCUMFERENCE = 2 * Math.PI * 90;
progressCircle.style.strokeDasharray = CIRCUMFERENCE;

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateProgress() {
  const progress = (totalTime - currentTime) / totalTime;
  const offset = CIRCUMFERENCE * progress;
  progressCircle.style.strokeDashoffset = offset;
}

function updateDisplay() {
  timeEl.textContent = formatTime(currentTime);
  statusEl.textContent = state;
  updateProgress();
}

function updatePomodoroDots() {
  const dots = pomodoroDots.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index < pomodoroCount);
  });
}

function updateColors() {
  const colors = {
    [STATES.WORK]: '#ff6b6b',
    [STATES.SHORT_BREAK]: '#3498db',
    [STATES.LONG_BREAK]: '#9b59b6'
  };
  progressCircle.style.stroke = colors[state];
}

function startTimer() {
  if (isRunning) return;

  isRunning = true;
  startBtn.disabled = true;
  pauseBtn.disabled = false;

  timerInterval = setInterval(() => {
    currentTime--;
    updateDisplay();

    if (currentTime <= 0) {
      clearInterval(timerInterval);
      isRunning = false;

      if (window.electronAPI) {
        const messages = {
          [STATES.WORK]: '工作完成！该休息一下了',
          [STATES.SHORT_BREAK]: '休息结束，开始工作吧',
          [STATES.LONG_BREAK]: '休息结束，继续加油'
        };
        window.electronAPI.sendNotification('番茄钟', messages[state]);
      }

      transitionState();
    }
  }, 1000);
}

function pauseTimer() {
  if (!isRunning) return;

  clearInterval(timerInterval);
  isRunning = false;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;

  if (state === STATES.WORK) {
    currentTime = WORK_TIME;
    totalTime = WORK_TIME;
  } else {
    const time = state === STATES.SHORT_BREAK ? SHORT_BREAK : LONG_BREAK;
    currentTime = time;
    totalTime = time;
  }

  updateDisplay();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function transitionState() {
  if (state === STATES.WORK) {
    pomodoroCount++;
    updatePomodoroDots();

    if (pomodoroCount % 4 === 0) {
      state = STATES.LONG_BREAK;
      currentTime = LONG_BREAK;
    } else {
      state = STATES.SHORT_BREAK;
      currentTime = SHORT_BREAK;
    }
  } else {
    state = STATES.WORK;
    currentTime = WORK_TIME;
  }

  totalTime = currentTime;
  updateColors();
  updateDisplay();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

pauseBtn.disabled = true;
updateDisplay();