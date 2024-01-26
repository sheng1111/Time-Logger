document.addEventListener('DOMContentLoaded', function() {
    const timeRecords = JSON.parse(localStorage.getItem('timeRecords')) || [];
    
    // get本週一日期
    function getMonday(d) {
        d = new Date(d);
        let day = d.getDay(),
            diff = d.getDate() - day + (day === 0 ? -6 : 1); // 當天是星期日的情形
        return new Date(d.setDate(diff));
    }

    const lastMonday = getMonday(new Date());


    let filteredRecords = [];
    if (timeRecords.length > 0 && Array.isArray(timeRecords[0])) {
        filteredRecords = timeRecords[0].filter(record => {
            const recordDate = new Date(record.date);
            return recordDate >= lastMonday;
        });
    }

    const timeSummary = filteredRecords.reduce((acc, record) => {
        if (!acc[record.item]) {
            acc[record.item] = 0;
        }
        acc[record.item] += record.minutes;
        return acc;
    }, {});

    const tableBody = document.getElementById('analyticsTable');
    Object.keys(timeSummary).forEach(item => {
        const row = tableBody.insertRow();
        const cellItem = row.insertCell(0);
        const cellMinutes = row.insertCell(1);
        cellItem.textContent = item;
        cellItem.style = "vertical-align: middle; width:70%; text-align:left; padding-left:2rem";
        cellMinutes.textContent = timeSummary[item];
    });
});
