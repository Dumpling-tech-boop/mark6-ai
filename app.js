// ========== 全局错误处理 ==========
window.addEventListener('error', (event) => {
    console.error('应用错误:', event.error);
    console.error('错误信息:', event.message);
    console.error('文件:', event.filename);
    console.error('行号:', event.lineno);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的Promise拒绝:', event.reason);
});

// ========== 数据 ==========
let data = [];
let timer = null;

// ========== 初始化 ==========
document.addEventListener("DOMContentLoaded", () => {
    console.log("Mark6 AI 已启动");

    loadData();
    // 注释：取消自动刷新，改为手动刷新
    // startAutoRefresh();
    loadSettings();
});

// ========== 页面导航 ==========
function showPage(pageId) {
    try {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const page = document.getElementById(pageId);
        if (page) {
            page.classList.add('active');
        }
    } catch (e) {
        console.error('页面导航错误:', e);
    }
}

// ========== 模拟数据加载 ==========
/**
 * 加载数据（仅从本地存储，不自动生成）
 */
function loadData() {
    try {
        // 从本地存储加载数据
        const savedData = localStorage.getItem("mark6_data");
        
        if (savedData) {
            try {
                data = JSON.parse(savedData);
                console.log("已加载本地数据：", data.length, "条");
            } catch (e) {
                console.error("数据加载失败:", e);
                data = [];
            }
        } else {
            // 不再自动生成数据
            console.log("本地存储为空，请导入数据或粘贴数据");
            data = [];
        }

        if (data.length > 100) {
            data = data.slice(0, 100);
        }

        updateDashboard();
        updateAnalysis();
    } catch (e) {
        console.error('加载数据异常:', e);
    }
}

// ========== 保存数据（手动） ==========
function saveData() {
    try {
        const textarea = document.getElementById("input");
        const inputData = textarea.value.trim();
        
        if (!inputData) {
            alert("请输入数据");
            return;
        }
        
        try {
            // 尝试解析 JSON 格式
            const parsed = JSON.parse(inputData);
            const dataArray = Array.isArray(parsed) ? parsed : [parsed];
            
            // 数据验证
            const validData = validateData(dataArray);
            if (validData.length === 0) {
                alert("没有有效的数据");
                return;
            }
            
            // 去重处理
            data = deduplicateData([...validData, ...data]);
            
            if (data.length > 100) {
                data = data.slice(0, 100);
            }
            
            localStorage.setItem("mark6_data", JSON.stringify(data));
            textarea.value = "";
            
            updateDashboard();
            updateAnalysis();
            alert("数据保存成功！共 " + data.length + " 条（已去重）");
        } catch (e) {
            alert("数据格式错误，请输入有效的 JSON 格式");
            console.error(e);
        }
    } catch (e) {
        console.error('保存数据异常:', e);
    }
}

// ========== 数据验证 ==========
function validateData(dataArray) {
    return dataArray.filter(item => {
        try {
            if (Array.isArray(item) && item.length === 7) {
                // 直接的7个号码数组
                return item.every(n => typeof n === 'number' && n >= 1 && n <= 49);
            }
            
            if (item && typeof item === 'object') {
                const numbers = item.numbers || [];
                const special = item.special;
                
                if (Array.isArray(numbers) && numbers.length === 6) {
                    const validNumbers = numbers.every(n => typeof n === 'number' && n >= 1 && n <= 49);
                    const validSpecial = typeof special === 'number' && special >= 1 && special <= 49;
                    return validNumbers && validSpecial;
                }
            }
            
            return false;
        } catch (e) {
            return false;
        }
    });
}

// ========== 数据去重 ==========
function deduplicateData(dataArray) {
    const seen = new Set();
    return dataArray.filter(item => {
        const key = Array.isArray(item) 
            ? item.join(',') 
            : (item.numbers || []).join(',') + '-' + (item.special || '');
        
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

// ========== CSV 上传处理 ==========
function handleUpload() {
    try {
        const file = document.getElementById('csvFile').files[0];
        if (!file) {
            alert("请选择文件");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert("文件过大，请选择小于10MB的文件");
            return;
        }

        const reader = new FileReader();

                reader.onload = function (e) {
            const text = e.target.result;

            const lines = text
                .split(/\r?\n/)
                .map(l => l.trim())
                .filter(Boolean);

            const result = [];

            for (let i = 0; i < lines.length; i++) {

                const cols = lines[i].split(",").map(x => x.trim());

                if (cols.length < 8) continue;

                const numbers = cols.slice(1, 7).map(n => parseInt(n));
                const special = parseInt(cols[7]);

                result.push({
                    issue: cols[0],
                    numbers: numbers,
                    special: special
                });
            }

            const validData = validateData(result);

            data = deduplicateData([...validData, ...data]);

            if (data.length > 100) {
                data = data.slice(0, 100);
            }

            localStorage.setItem("mark6_data", JSON.stringify(data));

            updateDashboard();
            updateAnalysis();

            alert("CSV导入成功，共 " + data.length + " 条");
        };

        reader.readAsText(file);

    } catch (e) {
        console.error("上传处理异常:", e);
    }
}
    

// ========== 生成7个号码（六合彩规则） ==========
function generateNumbers() {
    let nums = [];

    while (nums.length < 7) {
        let n = Math.floor(Math.random() * 49) + 1;
        if (!nums.includes(n)) {
            nums.push(n);
        }
    }

    return nums.sort((a, b) => a - b);
}

// ========== 更新仪表盘 ==========
function updateDashboard(importedData = null) {
    try {
        const statusEl = document.querySelector(".data-status");
        const countEl = document.querySelector(".record-count");
        const modelEl = document.querySelector(".ai-model");
        
        if (statusEl) statusEl.innerText = data.length > 0 ? "已加载" : "未加载";
        if (countEl) countEl.innerText = data.length;
        if (modelEl) modelEl.innerText = "就绪";
    } catch (e) {
        console.error('更新仪表盘异常:', e);
    }
}

// ========== 更新分析 ==========
function updateAnalysis() {
    try {
        const box = document.getElementById("analysisBox");

        if (!box) return;

        if (data.length === 0) {
            box.innerText = "暂无数据";
            return;
        }

        const html = data
            .slice(0, 10)
            .map((item, index) => {
                const nums = Array.isArray(item) ? item : item.numbers || [];
                return `<div style="padding: 8px; border-bottom: 1px solid #eee;">第 ${index + 1} 期: ${nums.join(" - ")}</div>`;
            })
            .join("");
        
        box.innerHTML = html;
    } catch (e) {
        console.error('更新分析异常:', e);
    }
}

// ========== 显示详细分析 ==========
function showDetailAnalysis() {
    try {
        if (data.length === 0) {
            alert("没有数据可分析");
            return;
        }
        
        showPage('analysis');
        
        const stats = showStatistics();
        const box = document.getElementById("analysisBox");
        
        let html = `
            <div style="padding: 15px; background: #f0f9ff; border-radius: 8px; margin-bottom: 15px;">
                <h4>📊 数据统计</h4>
                <p>总期数: <strong>${stats.analysis.total}</strong></p>
                <p>涵盖号码: <strong>${stats.analysis.uniqueNumbers}</strong></p>
                <p>平均出现次数: <strong>${stats.analysis.average}</strong></p>
                <p>最高频率: <strong>${stats.analysis.max}</strong></p>
                <p>最低频率: <strong>${stats.analysis.min}</strong></p>
            </div>
            
            <div style="padding: 15px; background: #fef3c7; border-radius: 8px; margin-bottom: 15px;">
                <h4>🔥 热号 (出现最频繁)</h4>
                ${stats.hot.map(h => `<span style="display: inline-block; background: #e91e63; color: white; padding: 5px 10px; margin: 3px; border-radius: 4px;">号码 ${h.number} (${h.count}次)</span>`).join('')}
            </div>
            
            <div style="padding: 15px; background: #cffafe; border-radius: 8px;">
                <h4>❄️ 冷号 (出现最少)</h4>
                ${stats.cold.map(c => `<span style="display: inline-block; background: #06b6d4; color: white; padding: 5px 10px; margin: 3px; border-radius: 4px;">号码 ${c.number} (${c.count}次)</span>`).join('')}
            </div>
        `;
        
        box.innerHTML = html;
    } catch (e) {
        console.error('详细分析异常:', e);
    }
}

// ========== 手动刷新数据 ==========
/**
 * 手动刷新数据（用户主动点击刷新按钮时调用）
 */
function refreshData() {
    try {
        console.log("用户手动刷新数据");
        loadData();
        alert("数据已刷新");
    } catch (e) {
        console.error('手动刷新异常:', e);
    }
}

// ========== 启用自动刷新（可选） ==========
/**
 * 启用自动刷新（需要用户主动调用）
 * @param {number} intervalSeconds - 刷新间隔（秒）
 */
function startAutoRefresh(intervalSeconds = 30) {
    try {
        if (timer) {
            console.warn("自动刷新已启用，请勿重复启用");
            return;
        }
        
        timer = setInterval(() => {
            try {
                console.log("自动刷新数据...");
                loadData();
            } catch (e) {
                console.error('自动刷新异常:', e);
            }
        }, intervalSeconds * 1000);
        
        console.log(`自动刷新已启用，间隔: ${intervalSeconds}秒`);
    } catch (e) {
        console.error('启用自动刷新异常:', e);
    }
}

// ========== 停止自动刷新 ==========
/**
 * 停止自动刷新
 */
function stopAutoRefresh() {
    try {
        if (timer) {
            clearInterval(timer);
            timer = null;
            console.log("自动刷新已停止");
        }
    } catch (e) {
        console.error('停止自动刷新异常:', e);
    }
}

// ========== AI选号 ==========
function generate() {
    try {
        const resultBox = document.getElementById("result");

        const result = generateNumbers();

        resultBox.innerHTML = `
            <div style="font-size:24px; color:#e91e63; font-weight:bold; padding:20px; background:#fff3e0; border-radius:8px; text-align:center;">
                🎰 推荐号码：${result.join(" - ")}
            </div>
            <p style="color:#666; font-size:12px; text-align:center; margin-top:10px;">⚠️ 仅供参考，不保证准确性</p>
        `;
    } catch (e) {
        console.error('生成推荐异常:', e);
    }
}

// ========== 保存设置 ==========
function saveSettings() {
    try {
        const apiUrl = document.getElementById('apiUrl')?.value.trim() || '';
        
        if (apiUrl) {
            localStorage.setItem("mark6_api_url", apiUrl);
            setAPIBaseURL(apiUrl);
            alert("API 地址已保存");
        } else {
            localStorage.removeItem("mark6_api_url");
            alert("设置已清除");
        }
    } catch (e) {
        console.error('保存设置异���:', e);
    }
}

// ========== 加载设置 ==========
function loadSettings() {
    try {
        const apiUrl = localStorage.getItem("mark6_api_url");
        
        if (apiUrl) {
            const input = document.getElementById('apiUrl');
            if (input) {
                input.value = apiUrl;
            }
            setAPIBaseURL(apiUrl);
        }
    } catch (e) {
        console.error('加载设置异常:', e);
    }
}
