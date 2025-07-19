
const fs = require('fs');
const path = require('path');

const commonDirs = require('./excludedDirs.json');
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

module.exports = { getDirectoryFiles };
