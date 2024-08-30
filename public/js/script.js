let db; // 全域變數，用來儲存資料庫連線
let worker; // 用來儲存 Web Worker 的實例
let timeStatus; // 用來追蹤計時器的狀態（開始、停止、重置）
let timeRecord = {}; // 用來儲存一條時間紀錄的物件
let startTime; // 計時開始的時間
let startDate; // 計時開始的日期

const displaySeconds = document.getElementById("seconds"); // 用來顯示秒數的 HTML 元素
const displayMinutes = document.getElementById("minutes"); // 用來顯示分鐘數的 HTML 元素

// 開啟 IndexedDB 資料庫，版本設為 2
let request = window.indexedDB.open("TimeLoggerDB", 2);

// 當資料庫第一次被開啟或版本變更時觸發，這裡用來創建資料表
request.onupgradeneeded = function (event) {
  db = event.target.result;
  // 如果 TimeLogs 資料表不存在，則創建它
  if (!db.objectStoreNames.contains("TimeLogs")) {
    let timeLogsStore = db.createObjectStore("TimeLogs", {
      keyPath: "id", // 每筆記錄的唯一標識符
      autoIncrement: true, // 自動遞增 ID
    });
    // 為日期欄位創建索引，允許多筆記錄擁有相同日期
    timeLogsStore.createIndex("date", "date", { unique: false });
  }
};

// 當資料庫成功開啟時觸發
request.onsuccess = function (event) {
  db = event.target.result; // 儲存資料庫連線

  // 檢查並創建 'TimeLogs' 物件存儲
  checkAndCreateObjectStore();
};

// 當資料庫開啟失敗時觸發
request.onerror = function (event) {
  console.error("開啟 IndexedDB 時發生錯誤:", event);
};

// 檢查並創建 'TimeLogs' 物件存儲的函式
function checkAndCreateObjectStore() {
  const objectStoreNames = db.objectStoreNames;
  if (!objectStoreNames.contains("TimeLogs")) {
    // 如果 'TimeLogs' 不存在，需要升級資料庫版本來創建它
    const newVersion = db.version + 1;
    db.close();

    const request = window.indexedDB.open("TimeLoggerDB", newVersion);

    request.onupgradeneeded = function (event) {
      db = event.target.result;

      let timeLogsStore = db.createObjectStore("TimeLogs", {
        keyPath: "id",
        autoIncrement: true,
      });
      timeLogsStore.createIndex("date", "date", { unique: false });

      console.log("成功創建 'TimeLogs' 物件存儲");
    };

    request.onsuccess = function (event) {
      db = event.target.result;
    };

    request.onerror = function (event) {
      console.error("創建 'TimeLogs' 物件存儲時發生錯誤:", event);
    };
  } else {
    console.log("'TimeLogs' 物件存儲已存在");
  }
}

// 點擊開始按鈕時觸發
startBtn.onclick = () => {
  if (timeStatus === "startBtn") {
    console.log("計時器已經啟動");
  } else {
    if (typeof Worker !== "undefined") {
      if (worker) {
        worker.terminate(); // 如果之前有 Worker，先終止
      }
      worker = new Worker("/js/timerWorker.js"); // 啟動 Web Worker

      worker.onmessage = function (event) {
        const { minutes, seconds } = event.data;
        displayMinutes.innerHTML = minutes < 10 ? `0${minutes}` : `${minutes}`;
        displaySeconds.innerHTML = seconds < 10 ? `0${seconds}` : `${seconds}`;
      };

      // 使用 moment.js 設定開始時間和日期，確保時間為 UTC+8
      startTime = moment(new Date()).utcOffset(8).format("HH:mm");
      startDate = moment(new Date()).utcOffset(8).format("YYYY-MM-DD");
      timeStatus = "startBtn";
    } else {
      console.error("你的瀏覽器不支持 Web Worker");
    }
  }
};

// 點擊停止按鈕時觸發
stopBtn.onclick = () => {
  if (timeStatus === "startBtn") {
    worker.terminate(); // 停止 Worker
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
    if (worker) {
      worker.terminate(); // 重置時也停止 Worker
    }
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
      minutes: parseInt(displayMinutes.innerHTML),
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

// 重置計時器的函式
function returnToZero() {
  if (worker) {
    worker.terminate();
  }
  displaySeconds.innerHTML = `00`;
  displayMinutes.innerHTML = `00`;
  timeStatus = "restBtn";
}
