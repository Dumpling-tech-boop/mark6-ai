// ========== 数据 ==========
let data = [];
let timer = null;

// ========== 初始化 ==========
document.addEventListener("DOMContentLoaded", () => {
    console.log("Mark6 AI 已启动");

    loadData();
    startAutoRefresh();
});

// ========== 模拟数据加载 ==========
function loadData() {
    // 模拟“开奖数据”
    const newNumbers = generateNumbers();

    data.unshift(newNumbers);

    if (data.length > 20) {
        data.pop();
    }

    updateDashboard();
    updateAnalysis();
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
function updateDashboard() {
    document.querySelector(".data-status").innerText = "已加载";
    document.querySelector(".record-count").innerText = data.length;
}

// ========== 更新分析 ==========
function updateAnalysis() {
    const box = document.getElementById("analysisBox");

    if (!box) return;

    if (data.length === 0) {
        box.innerText = "暂无数据";
        return;
    }

    box.innerHTML = data
        .slice(0, 10)
        .map(item => item.join(" - "))
        .join("<br>");
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
        <div style="font-size:20px;color:#e91e63;">
            ${result.join(" - ")}
        </div>
    `;
}
// Page navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// CSV upload handler
function handleUpload() {
    const file = document.getElementById('csvFile').files[0];
    if (!file) return alert("请选择文件");
    importCSV(file);
}

// Fix dashboard update to match HTML
function updateDashboard() {
    const statusEl = document.querySelector(".data-status");
    const countEl = document.querySelector(".record-count");
    if (statusEl) statusEl.innerText = "已加载";
    if (countEl) countEl.innerText = data.length;
}

// CSV import function (skeleton)
function importCSV(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        // Parse CSV and load data
        console.log("CSV imported:", e.target.result);
    };
    reader.readAsText(file);
}
