// 假的 HTTP 请求方法，返回固定字符串
async function getAICommands(url, options) {
//   console.log('@@@getAICommands');


  return new Promise(res => {
    res(`echo "@@@@hello world"
echo "!!!!hello world"`);
  });
}

// 真实的 HTTP 请求方法，使用 fetch
// async function httpRequest(url, options = {}) {
//   const fetch = global.fetch || (await import('node-fetch')).default;
//   const response = await fetch(url, options);
//   const text = await response.json();
//   return text;
// }

module.exports = {
//   httpRequest,
  getAICommands,
};
