// ========== CSV导入 + 数据处理 + 存储 ==========

function importCSV(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const text = e.target.result;
            const parsedData = parseCSV(text);
            
            if (parsedData.length === 0) {
                alert("CSV 文件为空或格式错误");
                return;
            }
            
            // 新数据添加到最前面
            data = [...parsedData, ...data];
            
            if (data.length > 20) {
                data = data.slice(0, 20);
            }
            
            saveDataToStorage(data);
            updateDashboard();
            updateAnalysis();
            
            document.getElementById('csvFile').value = '';
            alert("导入成功：" + parsedData.length + " 条数据");
        } catch (error) {
            alert("导入失败: " + error.message);
            console.error(error);
        }
    };

    reader.onerror = function () {
        alert("文件读取失败");
    };

    reader.readAsText(file, 'UTF-8');
}

// ========== 解析 CSV ==========
function parseCSV(text) {
    const lines = text.split('\n').filter(l => l.trim() !== '');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const cols = line.split(',').map(c => c.trim());

        // 检查格式：期数, 6个号码, 特码 = 至少8列
        if (cols.length < 8) {
            console.warn("跳过行 " + i + "：列数不足");
            continue;
        }

        try {
            const issue = cols[0];
            const numbers = [
                parseInt(cols[1]),
                parseInt(cols[2]),
                parseInt(cols[3]),
                parseInt(cols[4]),
                parseInt(cols[5]),
                parseInt(cols[6])
            ];
            const special = parseInt(cols[7]);
            
            // 验证号码有效性
            if (numbers.some(n => isNaN(n) || n < 1 || n > 49) || isNaN(special)) {
                console.warn("跳过行 " + i + "：号码无效");
                continue;
            }

            result.push({
                issue: issue,
                numbers: numbers,
                special: special
            });
        } catch (e) {
            console.warn("跳过行 " + i + "：解析错误", e);
            continue;
        }
    }

    return result;
}

// ========== 保存数据到本地存储 ==========
function saveDataToStorage(dataArray) {
    try {
        localStorage.setItem("mark6_data", JSON.stringify(dataArray));
        console.log("数据已保存到本地存储");
    } catch (e) {
        alert("本地存储满，无法保存数据");
        console.error(e);
    }
}

// ========== 导出数据为 CSV ==========
function exportCSV() {
    if (data.length === 0) {
        alert("没有数据可导出");
        return;
    }

    let csv = "期数,号码1,号码2,号码3,号码4,号码5,号码6,特码\n";
    
    data.forEach(item => {
        const issue = item.issue || "未知";
        const numbers = item.numbers ? item.numbers.join(",") : "";
        const special = item.special || "";
        csv += `${issue},${numbers},${special}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", "mark6_data_" + new Date().getTime() + ".csv");
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ========== 清空本地数据 ==========
function clearData() {
    if (confirm("确定要清空所有数据吗？此操作无法撤销。")) {
        localStorage.removeItem("mark6_data");
        data = [];
        updateDashboard();
        updateAnalysis();
        alert("数据已清空");
    }
}
