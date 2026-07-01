// ========== API 模块 ==========
// 此模块用于与后端服务通信

let API_BASE_URL = ""; // 设置后端 API 地址，例如: https://api.example.com

// ========== 获取最新开奖数据 ==========
async function fetchLatestDrawResults() {
    try {
        if (!API_BASE_URL) {
            throw new Error("API 地址未配置");
        }
        
        const response = await fetch(`${API_BASE_URL}/api/draws/latest`);
        
        if (!response.ok) {
            throw new Error(`API 错误: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("获取最新数据成功:", result);
        return result;
    } catch (error) {
        console.error("获取数据失败:", error);
        return null;
    }
}

// ========== 获取历史数据 ==========
async function fetchHistoryData(limit = 20) {
    try {
        if (!API_BASE_URL) {
            throw new Error("API 地址未配置");
        }
        
        const response = await fetch(`${API_BASE_URL}/api/draws/history?limit=${limit}`);
        
        if (!response.ok) {
            throw new Error(`API 错误: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("获取历史数据成功:", result);
        return result;
    } catch (error) {
        console.error("获取历史数据失败:", error);
        return null;
    }
}

// ========== 上传用户数据 ==========
async function uploadUserData(userData) {
    try {
        if (!API_BASE_URL) {
            throw new Error("API 地址未配置");
        }
        
        const response = await fetch(`${API_BASE_URL}/api/user/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            throw new Error(`API 错误: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("数据上传成功:", result);
        return result;
    } catch (error) {
        console.error("数据上传失败:", error);
        return null;
    }
}

// ========== 获取 AI 推荐 ==========
async function getAIRecommendationFromServer() {
    try {
        if (!API_BASE_URL) {
            throw new Error("API 地址未配置");
        }
        
        const response = await fetch(`${API_BASE_URL}/api/ai/recommend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                historicalData: data
            })
        });
        
        if (!response.ok) {
            throw new Error(`API 错误: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("AI 推荐成功:", result);
        return result;
    } catch (error) {
        console.error("获取 AI 推荐失败:", error);
        // 降级方案：使用本地算法
        console.log("使用本地 AI 推荐");
        return { numbers: generateAIRecommendation() };
    }
}

// ========== 获取统计数据 ==========
async function fetchStatistics() {
    try {
        if (!API_BASE_URL) {
            throw new Error("API 地址未配置");
        }
        
        const response = await fetch(`${API_BASE_URL}/api/statistics`);
        
        if (!response.ok) {
            throw new Error(`API 错误: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("获取统计数据成功:", result);
        return result;
    } catch (error) {
        console.error("获取统计数据失败:", error);
        return null;
    }
}

// ========== 健康检查 ==========
async function healthCheck() {
    try {
        if (!API_BASE_URL) {
            return false;
        }
        
        const response = await fetch(`${API_BASE_URL}/api/health`);
        return response.ok;
    } catch (error) {
        console.warn("API 服务不可用");
        return false;
    }
}

// ========== 设置 API 基础 URL ==========
function setAPIBaseURL(url) {
    if (!url) {
        API_BASE_URL = "";
        return;
    }
    
    // 移除末尾的斜杠
    API_BASE_URL = url.replace(/\/$/, '');
    console.log("API 基础 URL 已设置:", API_BASE_URL);
}
