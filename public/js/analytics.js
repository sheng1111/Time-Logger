// analytics.js
document.addEventListener("DOMContentLoaded", function () {
  let db;

  // 開啟 IndexedDB，版本為 2
  const request = indexedDB.open("TimeLoggerDB", 2);

  // 當成功開啟 IndexedDB 時執行
  request.onsuccess = function (event) {
    db = event.target.result;

    const weekSelector = document.getElementById("weekSelector");
    populateWeekSelector(weekSelector);

    // 初始化載入當前選擇的週數據
    weekSelector.addEventListener("change", function () {
      const selectedWeek = this.value;
      loadAnalytics(selectedWeek);
    });
  };

  // 當開啟 IndexedDB 發生錯誤時執行
  request.onerror = function (event) {
    console.error("開啟 IndexedDB 時發生錯誤:", event);
  };

  // 根據數據庫中的紀錄動態生成週選項
  function populateWeekSelector(weekSelector) {
    const transaction = db.transaction(["TimeLogs"], "readonly");
    const timeLogsStore = transaction.objectStore("TimeLogs");
    const request = timeLogsStore.getAll();

    // 當成功取得所有紀錄時執行
    request.onsuccess = function (event) {
      const timeRecords = event.target.result;

      if (timeRecords.length === 0) {
        console.error("無法選擇有效的週數，因為沒有可用的時間紀錄。");
        return;
      }

      // 取得第一筆紀錄的日期並設定為開始週的日期
      const firstRecordDate = new Date(timeRecords[0].date);
      const currentDate = new Date();
      let currentStartDate = getMonday(firstRecordDate);
      let lastOption;

      // 依據週次遞增並填充下拉選單
      while (currentStartDate <= currentDate) {
        const endDate = new Date(currentStartDate);
        endDate.setDate(endDate.getDate() + 6);

        const option = document.createElement("option");
        option.value = `${formatDateForValue(
          currentStartDate
        )} - ${formatDateForValue(endDate)}`;
        option.textContent = `${formatDate(currentStartDate)} - ${formatDate(
          endDate
        )}`;
        weekSelector.appendChild(option);

        lastOption = option; // 保留最後一個選項，即最新的一週

        currentStartDate.setDate(currentStartDate.getDate() + 7);
      }

      // 設定 weekSelector 的值為最新一週，並加載數據
      if (lastOption) {
        weekSelector.value = lastOption.value;
        loadAnalytics(lastOption.value);
      } else {
        console.error("無法選擇有效的週數。");
      }
    };

    // 當取得所有紀錄時發生錯誤時執行
    request.onerror = function (event) {
      console.error("檢索時間紀錄時發生錯誤:", event.target.error);
    };
  }

  // 載入並顯示選定週的數據
  function loadAnalytics(selectedWeek) {
    if (!selectedWeek) {
      console.error("選定的週數為未定義。");
      return;
    }

    // 將選定週的開始日期和結束日期轉換為日期物件
    const [startDateStr, endDateStr] = selectedWeek.split(" - ");
    const startDate = parseDateString(startDateStr.trim());
    const endDate = new Date(parseDateString(endDateStr.trim()));
    endDate.setHours(23, 59, 59, 999); // 確保結束日期覆蓋整天

    const transaction = db.transaction(["TimeLogs"], "readonly");
    const timeLogsStore = transaction.objectStore("TimeLogs");
    const request = timeLogsStore.getAll();

    // 當成功取得所有紀錄時執行
    request.onsuccess = function (event) {
      const timeRecords = event.target.result;

      // 根據選定的週篩選出對應的紀錄
      const filteredRecords = timeRecords.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate >= startDate && recordDate <= endDate;
      });

      // 整理篩選後的數據並統計每個項目的總時間
      const timeSummary = filteredRecords.reduce((acc, record) => {
        if (!acc[record.item]) {
          acc[record.item] = 0;
        }
        acc[record.item] += record.minutes;
        return acc;
      }, {});

      const tableBody = document.getElementById("analyticsTable");
      tableBody.innerHTML = "";

      // 根據統計結果生成表格內容
      if (Object.keys(timeSummary).length === 0) {
        const row = tableBody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 2;
        cell.textContent = "本週無統計數據";
        cell.style.textAlign = "center";
      } else {
        Object.keys(timeSummary).forEach((item) => {
          const row = tableBody.insertRow();
          const cellItem = row.insertCell(0);
          const cellMinutes = row.insertCell(1);
          cellItem.textContent = item;
          cellItem.style =
            "vertical-align: middle; width:70%; text-align:left; padding-left:2rem";
          cellMinutes.textContent = timeSummary[item];
        });
      }
    };

    // 當取得所有紀錄時發生錯誤時執行
    request.onerror = function (event) {
      console.error("檢索時間紀錄時發生錯誤:", event.target.error);
    };
  }

  // 獲取給定日期所在週的星期一
  function getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // 當天是星期日的情形
    return new Date(date.setDate(diff));
  }

  // 將日期格式化為 YYYY/MM/DD
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  // 將日期格式化為 YYYY-MM-DD，用於選項的值
  function formatDateForValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // 將字串轉換為日期物件
  function parseDateString(dateStr) {
    const [year, month, day] = dateStr.split(/[\/-]/).map(Number);
    return new Date(year, month - 1, day);
  }
});
