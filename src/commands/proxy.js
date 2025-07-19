const { execByLine } = require('../lib/execbyline');
const { checkValidCmd, getValidCmd } = require('../lib/request');

const { exec,spawn } = require('child_process');

async function proxy(args) {
    console.log('Received command:', args);
    const validResult = await checkValidCmd(args.slice(2));
    console.log('Origin Command:', args.slice(2));
    console.log('Valid Result:', validResult);
    let execCmd;
    if (validResult.includes('true')) {
        execCmd = args.slice(2);
        console.log('Executing:', execCmd.join(' '));
        spawn(execCmd[0], execCmd.slice(1), { stdio: 'inherit' })
    } else {
        console.log('Command is not valid, trying to get a valid command...');
        execCmd = await getValidCmd(args.slice(2));
        console.log('Executing:', execCmd);
        execByLine(execCmd)
        console.log('Got valid command:', execCmd);
    }
}

module.exports = {
  proxy
};