// ========== 图表模块 ==========
// 此模块用于数据可视化和统计分析

// ========== 统计号码出现频率 ==========
function getNumberFrequency() {
    const frequency = {};
    
    data.forEach(item => {
        const numbers = Array.isArray(item) ? item : item.numbers || [];
        numbers.forEach(num => {
            frequency[num] = (frequency[num] || 0) + 1;
        });
    });
    
    return frequency;
}

// ========== 获取热号 (出现频率最高的号码) ==========
function getHotNumbers(topN = 10) {
    const frequency = getNumberFrequency();
    
    return Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(entry => ({
            number: parseInt(entry[0]),
            count: entry[1]
        }));
}

// ========== 获取冷号 (出现频率最低的号码) ==========
function getColdNumbers(topN = 10) {
    const frequency = getNumberFrequency();
    
    return Object.entries(frequency)
        .sort((a, b) => a[1] - b[1])
        .slice(0, topN)
        .map(entry => ({
            number: parseInt(entry[0]),
            count: entry[1]
        }));
}

// ========== 分析号码分布 ==========
function analyzeDistribution() {
    const frequency = getNumberFrequency();
    
    const analysis = {
        total: data.length,
        uniqueNumbers: Object.keys(frequency).length,
        average: (Object.values(frequency).reduce((a, b) => a + b, 0) / Object.keys(frequency).length).toFixed(2),
        max: Math.max(...Object.values(frequency)),
        min: Math.min(...Object.values(frequency))
    };
    
    return analysis;
}

// ========== 显示详细统计 ==========
function showStatistics() {
    const analysis = analyzeDistribution();
    const hot = getHotNumbers(5);
    const cold = getColdNumbers(5);
    
    console.log("=== 数据统计分析 ===");
    console.log("总期数:", analysis.total);
    console.log("涵盖号码数:", analysis.uniqueNumbers);
    console.log("平均出现次数:", analysis.average);
    console.log("最高频率:", analysis.max);
    console.log("最低频率:", analysis.min);
    console.log("\n热号 (出现最频繁):");
    hot.forEach(h => console.log(`  号码 ${h.number}: 出现 ${h.count} 次`));
    console.log("\n冷号 (出现最少):");
    cold.forEach(c => console.log(`  号码 ${c.number}: 出现 ${c.count} 次`));
    
    return { analysis, hot, cold };
}

// ========== AI 推荐号码（基于热冷号混合） ==========
function generateAIRecommendation() {
    if (data.length === 0) {
        return generateNumbers();
    }
    
    const hot = getHotNumbers(3);
    const cold = getColdNumbers(3);
    const random = [];
    
    // 补充随机号码
    while (random.length < 1) {
        const n = Math.floor(Math.random() * 49) + 1;
        const allNums = [...hot.map(h => h.number), ...cold.map(c => c.number), ...random];
        if (!allNums.includes(n)) {
            random.push(n);
        }
    }
    
    const recommendation = [
        ...hot.map(h => h.number),
        ...cold.map(c => c.number),
        ...random
    ].sort((a, b) => a - b);
    
    const result = recommendation.slice(0, 7);
    
    const resultBox = document.getElementById("result");
    if (resultBox) {
        resultBox.innerHTML = `
            <div style="font-size:24px; color:#8b5cf6; font-weight:bold; padding:20px; background:#f3e8ff; border-radius:8px; text-align:center;">
                🧠 AI推荐：${result.join(" - ")}
            </div>
            <p style="color:#666; font-size:12px; text-align:center; margin-top:10px;">✨ 基于热冷号分析生成的推荐</p>
        `;
    }
    
    return result;
}
