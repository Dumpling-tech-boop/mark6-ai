// ========== 图表模块 ==========
// 此模块用于数据可视化和统计分析

/**
 * 统计号码出现频率
 * @returns {Object} 号码频率对象
 */
function getNumberFrequency() {
    const frequency = {};
    
    try {
        data.forEach(item => {
            const numbers = Array.isArray(item) ? item : item.numbers || [];
            numbers.forEach(num => {
                frequency[num] = (frequency[num] || 0) + 1;
            });
        });
    } catch (e) {
        console.error('获取号码频率异常:', e);
    }
    
    return frequency;
}

/**
 * 获取热号 (出现频率最高的号码)
 * @param {number} topN - 获取前N个
 * @returns {Array} 热号数组
 */
function getHotNumbers(topN = 10) {
    try {
        const frequency = getNumberFrequency();
        
        return Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, topN)
            .map(entry => ({
                number: parseInt(entry[0]),
                count: entry[1]
            }));
    } catch (e) {
        console.error('获取热号异常:', e);
        return [];
    }
}

/**
 * 获取冷号 (出现频率最低的号码)
 * @param {number} topN - 获取前N个
 * @returns {Array} 冷号数组
 */
function getColdNumbers(topN = 10) {
    try {
        const frequency = getNumberFrequency();
        
        return Object.entries(frequency)
            .sort((a, b) => a[1] - b[1])
            .slice(0, topN)
            .map(entry => ({
                number: parseInt(entry[0]),
                count: entry[1]
            }));
    } catch (e) {
        console.error('获取冷号异常:', e);
        return [];
    }
}

/**
 * 分析号码分布
 * @returns {Object} 分析结果对象
 */
function analyzeDistribution() {
    try {
        const frequency = getNumberFrequency();
        
        if (Object.keys(frequency).length === 0) {
            return {
                total: 0,
                uniqueNumbers: 0,
                average: 0,
                max: 0,
                min: 0
            };
        }
        
        const values = Object.values(frequency);
        const analysis = {
            total: data.length,
            uniqueNumbers: Object.keys(frequency).length,
            average: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
            max: Math.max(...values),
            min: Math.min(...values)
        };
        
        return analysis;
    } catch (e) {
        console.error('分析分布异常:', e);
        return { total: 0, uniqueNumbers: 0, average: 0, max: 0, min: 0 };
    }
}

/**
 * 显示详细统计
 * @returns {Object} 统计结果
 */
function showStatistics() {
    try {
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
    } catch (e) {
        console.error('显示统计异常:', e);
        return { analysis: {}, hot: [], cold: [] };
    }
}

/**
 * AI 推荐号码（基于热冷号混合）
 * @returns {Array} 推荐号码数组
 */
function generateAIRecommendation() {
    try {
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
    } catch (e) {
        console.error('生成AI推荐异常:', e);
        return generateNumbers();
    }
}

/**
 * 获取遗漏号码 (从未出现的号码)
 * @returns {Array} 遗漏号码数组
 */
function getMissingNumbers() {
    try {
        const frequency = getNumberFrequency();
        const missing = [];
        
        for (let i = 1; i <= 49; i++) {
            if (!frequency[i]) {
                missing.push(i);
            }
        }
        
        return missing;
    } catch (e) {
        console.error('获取遗漏号码异常:', e);
        return [];
    }
}

/**
 * 获取连续出现的号码对
 * @returns {Array} 连续号码对数组
 */
function getConsecutivePairs() {
    try {
        const pairs = [];
        const frequency = getNumberFrequency();
        
        for (let i = 1; i < 49; i++) {
            if (frequency[i] && frequency[i + 1]) {
                pairs.push({
                    pair: `${i}-${i + 1}`,
                    count: frequency[i] + frequency[i + 1]
                });
            }
        }
        
        return pairs.sort((a, b) => b.count - a.count);
    } catch (e) {
        console.error('获取连续对异常:', e);
        return [];
    }
}
