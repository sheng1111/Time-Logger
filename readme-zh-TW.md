# Time-Logger

[English](./readme.md) | [中文](./readme-zh-TW.md)

## 簡介

Time-Logger 是我基於 EJS 和 Express 的學習項目，旨在為用戶提供基本的時間記錄功能。這個 side project 既是一款簡單的時間管理工具，也是探索 Web 應用開發的一個實踐平台。

## DEMO

[![Demo](https://img.shields.io/badge/DEMO-Vercel-brightgreen)](https://time-logger-dun.vercel.app/)

## 功能

- **時間記錄**：使用者可以簡單地開始和結束時間記錄，用於基本的時間追蹤。
- **日誌查看**：提供基本的界面供用戶查看他們的時間記錄。
- **類別管理**：支持用戶自定義時間記錄的分類，並能隨時編輯或刪除分類。
- **時間分析**：通過選擇日期範圍查看不同時間段的總花費。
- **PWA 支持**：作為 Progressive Web App，Time-Logger 可以在手機和桌面上以類似原生應用的體驗運行。
- **Web Worker 計時**：在頁面切換或手機鎖屏時計時器能持續運行，並保證計時精確。

## 技術棧

- **Front-end**: 使用 EJS 模板引擎，簡化 HTML 內容的生成。
- **Back-end**: 透過 Express 框架處理伺服器端請求。
- **IndexedDB**: 用於本地存儲時間記錄和類別數據，支持離線使用。
- **PWA**: 利用 Service Workers 和 Web App Manifests 實現 PWA 功能。
- **Web Worker**: 確保計時器在頁面後台運行或手機鎖屏時仍能持續工作。

## 系統需求

- Node.js 版本 >= 12.x
- 兼容 Service Worker 和 Web Worker 的現代瀏覽器

## 安裝與啟動指南

1. clone

```bash
git clone https://github.com/sheng1111/Time-Logger.git
```

2. 安裝相關套件

```bash
npm install
```

3. 啟動

```bash
npm run start
```

## 詳細使用說明

- **記錄時間**：點擊 "Start" 開始計時，點擊 "Stop" 停止計時，並點擊 "Upload" 保存時間記錄。
- **查看日誌**：進入 "時間" 頁面，選擇日期來查看當天的時間記錄。
- **管理類別**：在 "類別" 頁面，添加或刪除類別。類別可以用於標籤不同的時間記錄。
- **時間分析**：在 "分析" 頁面，選擇日期範圍查看某段時間內的總花費。

## 開發與部署

### 開發

- 本地開發環境：使用 `npm run start` 啟動伺服器並在 `http://localhost:3000` 訪問應用。
- 使用 nodemon 進行開發時即時重新載入。

### 部署

- 你可以使用 Vercel 來部署這個應用，只需將項目 push 到 GitHub，然後將它連接到 Vercel 即可自動部署。

## 學習過程

這個項目是作為學習 EJS 和 Express 的一部分，任何對此感興趣或者想了解 PWA 的開發者都歡迎探索和學習。

## 未來改進計劃

- 添加更多的時間分析圖表
- 支持更多的時間記錄類型（如按任務或項目分組）
- 增強 UI/UX，改善移動端的使用體驗

## 貢獻指南

歡迎提交 pull requests 和 issues。請先 fork 這個 repository 並基於主分支開發你的功能，提交前請確保你的代碼通過了所有測試。

## 版本歷史

### 1.0.0

- 初始版本發布

## 授權條款

MIT License
