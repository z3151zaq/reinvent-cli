const { execByLine } = require('../lib/execbyline');
const { checkValidCmd, getValidCmd } = require('../lib/request');

const { exec,spawn } = require('child_process');

async function proxy(args) {
    const chalk = (await import('chalk')).default;
    console.log(chalk.blue('Received command:'), chalk.gray(args.join(' ')));
    const validResult = await checkValidCmd(args.slice(2));
    console.log(chalk.yellow('Origin Command:'), chalk.white(args.slice(2).join(' ')));
    console.log(chalk.cyan('Valid Result:'), chalk.white(validResult));
    let execCmd;
    if (validResult.includes('true')) {
        execCmd = args.slice(2);
        console.log(chalk.green('Executing:'), chalk.white(execCmd.join(' ')));
        spawn(execCmd[0], execCmd.slice(1), { stdio: 'inherit' });
    } else {
        console.log(chalk.red('Command is not valid, trying to get a valid command...'));
        execCmd = await getValidCmd(args.slice(2));
        console.log(chalk.green('Executing:'), chalk.white(execCmd));
        execByLine(execCmd);
        console.log(chalk.magenta('Got valid command:'), chalk.white(execCmd));
    }
}

module.exports = {
  proxy
};