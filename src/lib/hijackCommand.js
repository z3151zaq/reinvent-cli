const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

async function hijackCommand(cmd) {
  // 1. 检查命令是否存在
  let checkCmd;
  const platform = process.platform;

  if (platform === 'win32') {
    // Windows 用 where
    checkCmd = spawnSync('where', [cmd], { encoding: 'utf-8' });
  } else {
    // Linux/macOS 用 which
    checkCmd = spawnSync('which', [cmd], { encoding: 'utf-8' });
  }

  if (checkCmd.status !== 0 || !checkCmd.stdout.trim()) {
    console.error(`❌ There is no "${cmd}" command on your computer.`);
    return;
  }

  console.log(`✅ Found "${cmd}" path: ${checkCmd.stdout.trim().split('\n')[0]}`);

  // 2. 识别用户 shell 和配置文件路径
  const shellPath = process.env.SHELL || '';
  const home = os.homedir();

  let shellConfigPath;
  let aliasLine;

  if (platform === 'win32') {
    // Windows PowerShell 配置文件
    // TODO: windows 各种shell适配
    const userProfile = process.env.USERPROFILE || home;
    shellConfigPath = path.join(userProfile, 'Documents', 'WindowsPowerShell', 'Microsoft.PowerShell_profile.ps1');
    aliasLine = `function ${cmd} { reinvent ${cmd} $Args }`;
  } else {
    // Unix 系统：bash 或 zsh
    if (shellPath.includes('zsh')) {
      shellConfigPath = path.join(home, '.zshrc');
      aliasLine = `alias ${cmd}="reinvent ${cmd}"`;
    } else if (shellPath.includes('bash')) {
      shellConfigPath = path.join(home, '.bashrc');
      aliasLine = `alias ${cmd}="reinvent ${cmd}"`;
    } else {
      // 兼容 .profile
      shellConfigPath = path.join(home, '.profile');
      aliasLine = `alias ${cmd}="reinvent ${cmd}"`;
    }
  }

  // 3. 读取配置文件内容
  let configContent = '';
  try {
    configContent = fs.readFileSync(shellConfigPath, { encoding: 'utf-8' });
  } catch (e) {
    console.warn(`⚠️ There is no shell config file, ready to create new: ${shellConfigPath}`);
  }

  // 4. 检查是否已存在 alias 劫持
  if (configContent.includes(aliasLine)) {
    console.log(`ℹ️ "${cmd}" is already hijacked in ${shellConfigPath}`);
    return;
  }

  // 5. 追加 alias 到配置文件
  try {
    fs.appendFileSync(shellConfigPath, `\n# Added by reinvent to hijack ${cmd}\n${aliasLine}\n`);
    console.log(`✅ command ${cmd} ${shellConfigPath}`);
    console.log(`👉 Please reopen your terminal or execute: source ${shellConfigPath}`);
  } catch (e) {
    console.error(`❌ Write in config failed:`, e);
  }
}

module.exports = { hijackCommand };
