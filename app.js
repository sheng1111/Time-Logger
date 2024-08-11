const express = require("express");
const engine = require("ejs-locals");
const path = require("path");

// 建立 Express 應用程式
const app = express();

// 設定靜態檔案目錄
app.use(express.static("public"));

// 使用中介軟體解析 JSON 和 URL 編碼的請求主體
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 設定 EJS 引擎和視圖檔案路徑
app.engine("ejs", engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 再次設定靜態檔案目錄，確保正確的檔案路徑
app.use(express.static(path.join(__dirname, "public")));

// 定義路由處理 GET 請求，回應相應的 EJS 視圖

// 首頁路由，回應 index.ejs
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// 列表頁路由，接收可選的日期參數，並回應 list.ejs
app.get("/list", (req, res) => {
  // 檢查是否有傳入日期參數，沒有則使用當前日期
  const selectedDate = req.query.date || new Date().toISOString().split("T")[0];

  // 渲染 list.ejs，並將選定的日期傳遞給視圖
  res.render("list.ejs", { selectedDate: selectedDate });
});

// 類別頁路由，回應 category.ejs
app.get("/category", (req, res) => {
  res.render("category.ejs");
});

// 分析頁路由，回應 analytics.ejs
app.get("/analytics", (req, res) => {
  res.render("analytics.ejs");
});

// 啟動伺服器，並監聽指定的端口
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
