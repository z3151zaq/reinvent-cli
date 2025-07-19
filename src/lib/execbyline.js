
const { spawn } = require('child_process');
const inquirer = require('inquirer');

/**
 * 交互式逐行执行命令
 * @param {string} commandsStr - 多行命令字符串
 */
async function execByLine(commandsStr) {
    const commands = commandsStr.split('\n').map(cmd => cmd.trim()).filter(Boolean);
    const prompt = inquirer.createPromptModule();
    for (let i = 0; i < commands.length; i++) {
        const cmd = commands[i];
        const { run } = await prompt([
            {
                type: 'confirm',
                name: 'run',
                message: `About to execute command #${i + 1}: ${cmd}\nExecute this command?`,
                default: true
            }
        ]);
        if (run) {
            await new Promise((resolve) => {
                // 拆分命令和参数
                const parts = cmd.split(' ');
                const mainCmd = parts[0];
                const args = parts.slice(1);
                const child = spawn(mainCmd, args, { stdio: 'inherit', shell: true });
                child.on('close', () => {
                    resolve();
                });
            });
        } else {
            const { stop } = await prompt([
                {
                    type: 'confirm',
                    name: 'stop',
                    message: 'Do you want to stop all commands?',
                    default: false
                }
            ]);
            if (stop) {
                console.log('All commands stopped.');
                break;
            }
        }
    }
    console.log('All commands finished.');
}

module.exports = { execByLine };
