import chalk from 'chalk';

const COMMAND_KEYWORDS = [
  'npm', 'npx', 'cd', 'rm', 'ls', 'yarn', 'git', 'mkdir', 'touch', 'cp', 'mv', 'cat', 'echo', 'node', 'pnpm', 'python', 'pip', 'docker', 'kill', 'ps', 'chmod', 'chown', 'find', 'grep', 'sed', 'awk', 'tar', 'zip', 'unzip', 'curl', 'wget', 'ssh', 'scp', 'service', 'systemctl', 'sudo'
];

function colorizeAIOutput(msg) {
  return msg.split('\n').map(line => {
    let colored = line;
    COMMAND_KEYWORDS.forEach(cmd => {
      colored = colored.replace(new RegExp(`\\b${cmd}\\b`, 'g'), chalk.red(cmd));
    });
    if (colored.includes('\u001b[31m')) {
      const parts = colored.split(/(\u001b\[31m.*?\u001b\[39m)/g);
      return parts.map(part => part.startsWith('\u001b[31m') ? part : chalk.yellowBright(part)).join('');
    } else {
      return chalk.yellowBright(colored);
    }
  }).join('\n');
}

const logger = {
  info: (msg) => {
    console.log(chalk.cyanBright('[INFO]'), chalk.cyanBright(msg));
  },
  warn: (msg) => {
    console.log(chalk.yellow('[WARN]'), chalk.yellow(msg));
  },
  error: (msg) => {
    console.log(chalk.redBright.bold('[ERROR]'), chalk.redBright.bold(msg));
  },
  success: (msg) => {
    console.log(chalk.green('[SUCCESS]'), chalk.green(msg));
  },
  ai: (msg) => {
    console.log(colorizeAIOutput(msg));
  },
  system: (msg) => {
    console.log(chalk.greenBright(msg));
  },
  // 返回格式化字符串的方法
  formatInfo: (msg) => {
    return `${chalk.blueBright.bold('[INFO]')} ${chalk.blueBright.bold(msg)}`;
  },
  formatWarn: (msg) => {
    return `${chalk.yellowBright('[WARN]')} ${chalk.yellowBright(msg)}`;
  },
  formatError: (msg) => {
    return `${chalk.red('[ERROR]')} ${chalk.red(msg)}`;
  },
  formatSuccess: (msg) => {
    return `${chalk.greenBright.bold('[SUCCESS]')} ${chalk.greenBright.bold(msg)}`;
  }
};

export default logger;
