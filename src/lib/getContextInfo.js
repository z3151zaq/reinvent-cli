const os = require('os');
const commonDirs = require('./excludedDirs.json');
const fs = require('fs');
const path = require('path');


/**
 * Get system information
 * @returns {Object} System information object
 */
function getSystemInfo() {
  try {
    const systemInfo = {
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname(),
      type: os.type(),
      release: os.release(),
      uptime: os.uptime(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpus: os.cpus().length,
      userInfo: os.userInfo(),
      networkInterfaces: os.networkInterfaces()
    };

    return systemInfo;
  } catch (error) {
    console.error('Error getting system info:', error);
    throw new Error('Failed to get system information');
  }
}


/**
 * 获取当前路径下所有文件路径和文件名，过滤常见依赖包
 * @param {string} dir 当前目录，默认 process.cwd()
 * @param {Array<string>} excludeDirs 要排除的目录
 * @returns {Array<{ path: string, name: string }>} 文件列表
 */
function getDirectoryFiles(dir = process.cwd(), excludeDirs) {
    // 默认排除常见依赖包和无关文件夹
    excludeDirs = excludeDirs || commonDirs;
    let results = [];
    function walk(currentDir) {
        const list = fs.readdirSync(currentDir);
        for (const file of list) {
            // 排除目录和文件
            if (excludeDirs.includes(file)) continue;
            const filePath = path.join(currentDir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                walk(filePath);
            } else {
                results.push(file);
            }
        }
    }
    walk(dir);
    return results;
}


module.exports = { getDirectoryFiles, getSystemInfo };