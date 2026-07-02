// ========== CSV导入 + 数据处理 + 存储 ==========

/**
 * 导入 CSV 文件
 * @param {File} file - CSV 文件
 */
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
            
            // 去重处理
            data = deduplicateData(data);
            
            if (data.length > 100) {
                data = data.slice(0, 100);
            }
            
            saveDataToStorage(data);
            updateDashboard();
            updateAnalysis();
            
            document.getElementById('csvFile').value = '';
            alert("导入成功：" + parsedData.length + " 条数据（已去重）");
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

/**
 * 解析 CSV 文本
 * @param {string} text - CSV 文本内容
 * @returns {Array} 解析后的数据数组
 */
function parseCSV(text) {
    const lines = text.split('\n').filter(l => l.trim() !== '');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const cols = line.split(',').map(c => c.trim());

        // 检查格���：期数, 6个号码, 特码 = 至少8列
        if (cols.length < 9) {
            console.warn("跳过行 " + i + "：列数不足");
            continue;
        }

        try {
            const issue = cols[1];
            const numbers = [
                parseInt(cols[2]),
                parseInt(cols[3]),
                parseInt(cols[4]),
                parseInt(cols[5]),
                parseInt(cols[6]),
                parseInt(cols[7])
            ];
            const special = parseInt(cols[8]);
            
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

/**
 * 保存数据到本地存储
 * @param {Array} dataArray - 数据数组
 */
function saveDataToStorage(dataArray) {
    try {
        const dataStr = JSON.stringify(dataArray);
        
        // 检查存储容量
        const estimatedSize = new Blob([dataStr]).size;
        const availableSpace = 5 * 1024 * 1024; // 5MB
        
        if (estimatedSize > availableSpace) {
            console.warn("数据大小过大，自动删除旧数据");
            // 保留最新的50条数据
            dataArray = dataArray.slice(0, 50);
        }
        
        localStorage.setItem("mark6_data", JSON.stringify(dataArray));
        console.log("数据已保存到本地存储");
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            alert("本地存储已满，部分数据可能无法保存");
        }
        console.error(e);
    }
}

/**
 * 导出数据为 CSV
 */
function exportCSV() {
    try {
        if (data.length === 0) {
            alert("没有数据可导出");
            return;
        }

        let csv = "期数,号码1,号码2,号码3,号码4,号码5,号码6,特码\n";
        
        data.forEach(item => {
            try {
                const issue = item.issue || "未知";
                const numbers = item.numbers ? item.numbers.join(",") : "";
                const special = item.special || "";
                csv += `${issue},${numbers},${special}\n`;
            } catch (e) {
                console.warn("导出行出错", e);
            }
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
        
        alert("数据导出成功");
    } catch (e) {
        alert("导出失败: " + e.message);
        console.error(e);
    }
}

/**
 * 清空本地数据
 */
function clearData() {
    try {
        if (confirm("确定要清空所有数据吗？此操作无法撤销。")) {
            localStorage.removeItem("mark6_data");
            data = [];
            updateDashboard();
            updateAnalysis();
            alert("数据已清空");
        }
    } catch (e) {
        console.error('清空数据异常:', e);
    }
}

/**
 * 获取本地存储信息
 */
function getStorageInfo() {
    try {
        const dataStr = localStorage.getItem("mark6_data");
        const size = dataStr ? new Blob([dataStr]).size : 0;
        const sizeKB = (size / 1024).toFixed(2);
        
        console.log(`本地存储大小: ${sizeKB} KB`);
        console.log(`数据条数: ${data.length}`);
        
        return { sizeKB, count: data.length };
    } catch (e) {
        console.error('获取存储信息异常:', e);
        return { sizeKB: 0, count: 0 };
    }
}
