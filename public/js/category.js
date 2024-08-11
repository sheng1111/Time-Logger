// 檢查 localStorage 中是否已存在 'categories' 這個鍵值
// 如果不存在，則初始化一個預設的類別列表
if (!localStorage.getItem("categories")) {
  localStorage.setItem(
    "categories",
    JSON.stringify(["公務", "吃飯", "閱讀", "專案", "邊專案"])
  );
}

// 新增類別的函式
function addCategory() {
  const displayCategory = document.getElementById("newCategory"); // 獲取使用者輸入的新類別
  const newCategory = displayCategory.value.trim(); // 移除輸入內容的前後空白

  // 檢查新類別是否為空字串
  if (newCategory !== "") {
    // 從 localStorage 中讀取現有的類別列表，如果沒有則初始化為空陣列
    const existingCategories =
      JSON.parse(localStorage.getItem("categories")) || [];
    // 檢查新類別是否已存在於類別列表中
    if (!existingCategories.includes(newCategory)) {
      // 如果新類別不在現有列表中，則將其加入列表
      existingCategories.push(newCategory);
      // 將更新後的類別列表儲存回 localStorage
      localStorage.setItem("categories", JSON.stringify(existingCategories));

      // 更新顯示的類別列表
      updateCategoryList();
    }
  }

  // 清空輸入框的值
  displayCategory.value = "";
}

// 更新顯示的類別列表的函式
function updateCategoryList() {
  const categoryList = document.getElementById("categoryList"); // 獲取顯示類別的 HTML 元素
  const existingCategories =
    JSON.parse(localStorage.getItem("categories")) || []; // 從 localStorage 中讀取現有的類別列表

  // 生成表格的 HTML，將每個類別生成一行
  const rowsHtml = existingCategories
    .map(
      (category) => `
        <tr>
            <td style="vertical-align: middle; width:80%; text-align:left; padding-left:2rem">${category}</td>
            <td>
                <button type="button" class="btn btn-sm btn-danger" style="vertical-align: middle; margin-bottom:0px;" onclick="deleteCategory('${category}')"> X </button>
            </td>
        </tr>`
    )
    .join(""); // 將每個類別的 HTML 合併成一個字串

  // 將生成的 HTML 設定為表格的內容
  categoryList.innerHTML = rowsHtml;
}

// 刪除類別的函式
function deleteCategory(category) {
  const categories = JSON.parse(localStorage.getItem("categories")) || []; // 從 localStorage 中讀取現有的類別列表
  // 過濾掉要刪除的類別，保留其他類別
  const filteredCategories = categories.filter((c) => c !== category);
  // 將過濾後的類別列表儲存回 localStorage
  localStorage.setItem("categories", JSON.stringify(filteredCategories));
  // 更新顯示的類別列表
  updateCategoryList();
}

// 初始化時更新顯示類別列表
updateCategoryList();
