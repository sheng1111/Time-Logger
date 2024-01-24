if (!localStorage.getItem('categories')) {
    localStorage.setItem('categories', JSON.stringify(['公務', '吃飯', '閱讀', '專案', '邊專案']));
}

function addCategory() {
    const displayCategory = document.getElementById('newCategory');
    const newCategory = displayCategory.value.trim();

    if (newCategory !== '') {
        const existingCategories = JSON.parse(localStorage.getItem('categories')) || [];
        if (!existingCategories.includes(newCategory)) {
            existingCategories.push(newCategory);
            localStorage.setItem('categories', JSON.stringify(existingCategories));

            updateCategoryList();
        }
    }

    displayCategory.value = '';
}

function updateCategoryList() {
    const categoryList = document.getElementById('categoryList');
    const existingCategories = JSON.parse(localStorage.getItem('categories')) || [];
    let rowsHtml = existingCategories.map(category =>
        `<tr>
            <td style="vertical-align: middle; width:80%; text-align:left; padding-left:2rem">${category}</td>
            <td>
                <button type="button" class="btn btn-sm btn-danger" style="vertical-align: middle; margin-bottom:0px; text-align" onclick="deleteCategory('${category}')"> X </button>
            </td>
        </tr>`
    ).join('');
    categoryList.innerHTML = rowsHtml;
}

function deleteCategory(category) {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const filteredCategories = categories.filter(c => c !== category);
    localStorage.setItem('categories', JSON.stringify(filteredCategories));
    updateCategoryList(); // 更新列表
}


updateCategoryList();