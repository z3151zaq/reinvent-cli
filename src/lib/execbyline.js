
const { spawn } = require('child_process');
const inquirer = require('inquirer');
const logger = require('../core/logger.js').default;

/**
 * 交互式逐行执行命令
 * @param {string} commandsStr - 多行命令字符串
 */
async function execByLine(commandsStr) {
    const commands = commandsStr.split('\n').map(cmd => cmd.trim()).filter(Boolean);
    const prompt = inquirer.createPromptModule();
    
    for (let i = 0; i < commands.length; i++) {
        const cmd = commands[i];
        
        logger.info(`Command ${i + 1}/${commands.length}: ${cmd}`);
        
        const { run } = await prompt([
            {
                type: 'confirm',
                name: 'run',
                message: logger.formatWarn(`About to execute command #${i + 1}: ${cmd}\nExecute this command?`),
                default: true
            }
        ]);
        
        if (run) {
            logger.info('Executing command...');
            await new Promise((resolve) => {
                // 拆分命令和参数
                const parts = cmd.split(' ');
                const mainCmd = parts[0];
                const args = parts.slice(1);
                const child = spawn(mainCmd, args, { stdio: 'inherit', shell: true });
                child.on('close', (code) => {
                    if (code === 0) {
                        logger.success('Command completed successfully');
                    } else {
                        logger.error(`Command failed with exit code ${code}`);
                    }
                    resolve();
                });
            });
        } else {
            logger.warn('Command skipped');
            const { stop } = await prompt([
                {
                    type: 'confirm',
                    name: 'stop',
                    message: logger.formatWarn('Do you want to stop all remaining commands?'),
                    default: false
                }
            ]);
            if (stop) {
                logger.error('All remaining commands stopped.');
                break;
            }
        }
    }
    logger.success('All commands finished.');
}

module.exports = { execByLine };
