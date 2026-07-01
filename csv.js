// CSV导入 + 数据处理 + 存储

function importCSV(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
        const text = e.target.result;
        const data = parseCSV(text);

        saveData(data);
        updateUI(data);
    };

    reader.readAsText(file);
}

// 解析CSV
function parseCSV(text) {
    const lines = text.split('\n').filter(l => l.trim() !== '');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',');

        if (cols.length < 8) continue;

        result.push({
            issue: cols[0],
            numbers: [
                parseInt(cols[1]),
                parseInt(cols[2]),
                parseInt(cols[3]),
                parseInt(cols[4]),
                parseInt(cols[5]),
                parseInt(cols[6])
            ],
            special: parseInt(cols[7])
        });
    }

    return result;
}

// 保存数据（本地）
function saveData(data) {
    localStorage.setItem("mark6_data", JSON.stringify(data));
}

// 更新界面
function updateUI(data) {
    if (window.updateDashboard) {
        window.updateDashboard(data);
    }

    alert("导入成功：" + data.length + "期数据");
}
