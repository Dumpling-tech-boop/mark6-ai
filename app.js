// ========== 数据 ==========
let data = [];
let timer = null;

// ========== 初始化 ==========
document.addEventListener("DOMContentLoaded", () => {
    console.log("Mark6 AI 已启动");

    loadData();
    startAutoRefresh();
    loadSettings();
});

// ========== 页面导航 ==========
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active');
    }
}

// ========== 模拟数据加载 ==========
function loadData() {
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
        // 模拟初始数据
        const newNumbers = generateNumbers();
        data.unshift(newNumbers);
    }

    if (data.length > 20) {
        data = data.slice(0, 20);
    }

    updateDashboard();
    updateAnalysis();
}

// ========== 保存数据（手动） ==========
function saveData() {
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
        
        data = [...dataArray, ...data];
        
        if (data.length > 20) {
            data = data.slice(0, 20);
        }
        
        localStorage.setItem("mark6_data", JSON.stringify(data));
        textarea.value = "";
        
        updateDashboard();
        updateAnalysis();
        alert("数据保存成功！共 " + data.length + " 条");
    } catch (e) {
        alert("数据格式错误，请输入有效的 JSON 或 CSV 数据");
        console.error(e);
    }
}

// ========== CSV 上传处理 ==========
function handleUpload() {
    const file = document.getElementById('csvFile').files[0];
    if (!file) {
        alert("请选择文件");
        return;
    }
    
    importCSV(file);
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
    const statusEl = document.querySelector(".data-status");
    const countEl = document.querySelector(".record-count");
    const modelEl = document.querySelector(".ai-model");
    
    if (statusEl) statusEl.innerText = data.length > 0 ? "已加载" : "未加载";
    if (countEl) countEl.innerText = data.length;
    if (modelEl) modelEl.innerText = "就绪";
}

// ========== 更新分析 ==========
function updateAnalysis() {
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
}

// ========== 显示详细分析 ==========
function showDetailAnalysis() {
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
}

// ========== 自动刷新 ==========
function startAutoRefresh() {
    timer = setInterval(() => {
        loadData();
    }, 5000); // 每5秒更新一次
}

// ========== AI选号 ==========
function generate() {
    const resultBox = document.getElementById("result");

    const result = generateNumbers();

    resultBox.innerHTML = `
        <div style="font-size:24px; color:#e91e63; font-weight:bold; padding:20px; background:#fff3e0; border-radius:8px; text-align:center;">
            🎰 推荐号码：${result.join(" - ")}
        </div>
        <p style="color:#666; font-size:12px; text-align:center; margin-top:10px;">⚠️ 仅供参考，不保证准确性</p>
    `;
}

// ========== 保存设置 ==========
function saveSettings() {
    const apiUrl = document.getElementById('apiUrl').value.trim();
    
    if (apiUrl) {
        localStorage.setItem("mark6_api_url", apiUrl);
        setAPIBaseURL(apiUrl);
        alert("API 地址已保存");
    } else {
        localStorage.removeItem("mark6_api_url");
        alert("设置已清除");
    }
}

// ========== 加载设置 ==========
function loadSettings() {
    const apiUrl = localStorage.getItem("mark6_api_url");
    
    if (apiUrl) {
        const input = document.getElementById('apiUrl');
        if (input) {
            input.value = apiUrl;
        }
        setAPIBaseURL(apiUrl);
    }
}
