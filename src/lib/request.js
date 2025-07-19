// 假的 HTTP 请求方法，返回固定字符串
// DO NOT DELETE, TESTING ONLY !!!
async function getAICommands(url, options) {
  console.log('@@@getAICommands');
  return new Promise(res => {
    res(`echo "@@@@hello world"
echo "!!!!hello world"`);
  });
}

// 真实的 HTTP 请求方法，使用 fetch
async function httpRequest(url, options = {}) {
  const fetch = global.fetch || (await import('node-fetch')).default;
  const response = await fetch(url, options);
  const text = await response.json();
  return text;
}

// Fetch API key from external service
async function getApiKey() {
  try {
    const response = await httpRequest('http://localhost:3000/api/ask');
    return response.apiKey;
  } catch (error) {
    console.error('Failed to fetch API key:', error.message);
    throw new Error('Unable to fetch API key from external service');
  }
}

module.exports = {
  getAICommands,
  httpRequest,
  getApiKey
};
