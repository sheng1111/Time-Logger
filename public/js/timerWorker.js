// timerWorker.js
let seconds = 0;
let minutes = 0;

function timer() {
  seconds++;
  if (seconds > 59) {
    minutes++;
    seconds = 0;
  }
  postMessage({ minutes, seconds }); // 將結果發送回主執行緒
}

setInterval(timer, 1000); // 每秒執行一次計時
