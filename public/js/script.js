let seconds = 0;
let minutes = 0;
const displaySeconds = document.getElementById("seconds");
const displayMinures = document.getElementById("minutes");
let interval;
let timeStatus;
let timeRecord = {};
let stratTime;
let stratDate;

startBtn.onclick = () => {
  if (timeStatus === "startBtn") {
    console.log("計時器已經啟動");
  } else {
    // 每秒觸發一次 timer 函式
    interval = setInterval(timer, 1000);
    // 使用 moment.js 設定開始時間和日期，確保時間為 UTC+8
    startTime = moment(new Date()).utcOffset(8).format("HH:mm");
    startDate = moment(new Date()).utcOffset(8).format("YYYY-MM-DD");
    timeStatus = "startBtn";
  }
};

// 點擊停止按鈕時觸發
stopBtn.onclick = () => {
  if (timeStatus === "startBtn") {
    clearInterval(interval); // 停止計時
    timeStatus = "stopBtn";
  } else if (timeStatus === "stopBtn") {
    console.log("計時器已經停止");
  } else if (timeStatus === "restBtn") {
    console.log("請先啟動計時器");
  }
};

// 點擊重置按鈕時觸發
restBtn.onclick = () => {
  if (timeStatus === "startBtn") {
    console.log("請先停止計時器");
  } else if (timeStatus === "stopBtn") {
    returnToZero(); // 重置計時器
  }
};

// 點擊上傳按鈕時觸發
uploadBtn.onclick = () => {
  if (timeStatus === "startBtn") {
    console.log("請先停止計時器");
  } else if (timeStatus === "stopBtn") {
    // 準備要儲存的時間紀錄物件
    timeRecord = {
      date: startDate,
      time: startTime,
      minutes: minutes,
      item: "", // 初始設置為空，讓使用者後續選擇分類
    };

    // 確認資料庫已初始化
    if (db) {
      // 開始一個讀寫交易
      let transaction = db.transaction(["TimeLogs"], "readwrite");
      let timeLogsStore = transaction.objectStore("TimeLogs");
      timeLogsStore.add(timeRecord); // 將記錄新增到資料庫

      transaction.oncomplete = function () {
        console.log("時間紀錄已新增到 IndexedDB");
      };

      transaction.onerror = function (event) {
        console.error("新增時間紀錄時發生錯誤:", event.target.error);
      };

      returnToZero(); // 重置計時器
    } else {
      console.error("資料庫尚未初始化");
    }
  }
};

// 計時器每秒觸發的函式
function timer() {
  seconds++; // 增加秒數

  // 更新顯示的秒數，若秒數小於 10，則補 0
  displaySeconds.innerHTML = seconds < 10 ? `0${seconds}` : `${seconds}`;

  // 如果秒數超過 59，將其重置並增加分鐘數
  if (seconds > 59) {
    minutes++;
    displayMinutes.innerHTML = minutes < 10 ? `0${minutes}` : `${minutes}`;
    seconds = 0;
  }
}

// 重置計時器的函式
function returnToZero() {
  seconds = 0;
  minutes = 0;
  startTime = "";
  timeRecord = {};
  displaySeconds.innerHTML = `0${seconds}`;
  displayMinutes.innerHTML = `0${minutes}`;
  timeStatus = "restBtn";
}
