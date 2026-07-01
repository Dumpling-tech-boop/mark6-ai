// ========== API 模块 ==========
// 此模块用于与后端服务通信

let API_BASE_URL = ""; // 设置后端 API 地址，例如: https://api.example.com

/**
 * 获取最新开奖数据
 * @returns {Promise<Object|null>} 最新数据或null
 */
async function fetchLatestDrawResults() {
    try {
        if (!API_BASE_URL) {
            throw new Error("API 地址未配置");
        }
        
        const response = await fetch(`${API_BASE_URL}/api/draws/latest`, {
            method: 'GET',
            timeout: 5000
        });
        
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

/**
 * 获取历史数据
 * @param {number} limit - 获取数量限制
 * @returns {Promise<Object|null>} 历史数据或null
 */
async function fetchHistoryData(limit = 20) {
    try {
        if (!API_BASE_URL) {
            throw new Error("API 地址未配置");
        }
        
        const response = await fetch(`${API_BASE_URL}/api/draws/history?limit=${limit}`, {
            method: 'GET',
            timeout: 5000
        });
        
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

/**
 * 上传用户数据
 * @param {Object} userData - 用户数据
 * @returns {Promise<Object|null>} 上传结果或null
 */
async function uploadUserData(userData) {
    try {
        if (!API_BASE_URL) {
            throw new Error("API 地址未配置");
        }
        
        // 验证数据
        if (!userData || typeof userData !== 'object') {
            throw new Error("无效的数据格式");
        }
        
        const response = await fetch(`${API_BASE_URL}/api/user/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
            timeout: 5000
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

/**
 * 获取 AI 推荐
 * @returns {Promise<Object>} 推荐结果（包含本地和远程方案）
 */
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
                historicalData: data,
                timestamp: new Date().toISOString()
            }),
            timeout: 5000
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

/**
 * 获取统计数据
 * @returns {Promise<Object|null>} 统计数据或null
 */
async function fetchStatistics() {
    try {
        if (!API_BASE_URL) {
            throw new Error("API 地址未配置");
        }
        
        const response = await fetch(`${API_BASE_URL}/api/statistics`, {
            method: 'GET',
            timeout: 5000
        });
        
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

/**
 * 健康检查
 * @returns {Promise<boolean>} API是否可用
 */
async function healthCheck() {
    try {
        if (!API_BASE_URL) {
            return false;
        }
        
        const response = await fetch(`${API_BASE_URL}/api/health`, {
            method: 'GET',
            timeout: 3000
        });
        
        const isHealthy = response.ok;
        console.log("API 服务状态:", isHealthy ? "正常" : "异常");
        return isHealthy;
    } catch (error) {
        console.warn("API 服务不可用");
        return false;
    }
}

/**
 * 设置 API 基础 URL
 * @param {string} url - API 基础地址
 */
function setAPIBaseURL(url) {
    try {
        if (!url) {
            API_BASE_URL = "";
            return;
        }
        
        // 验证URL格式
        const urlObj = new URL(url);
        // 移除末尾的斜杠
        API_BASE_URL = url.replace(/\/$/, '');
        console.log("API 基础 URL 已设置:", API_BASE_URL);
    } catch (e) {
        console.error("无效的 API 地址:", e);
        API_BASE_URL = "";
    }
}

/**
 * 初始化API配置
 */
function initializeAPI() {
    try {
        const savedUrl = localStorage.getItem("mark6_api_url");
        if (savedUrl) {
            setAPIBaseURL(savedUrl);
            healthCheck(); // 异步检查
        }
    } catch (e) {
        console.error('初始化API异常:', e);
    }
}

// 页面加载时初始化API
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAPI);
} else {
    initializeAPI();
}
