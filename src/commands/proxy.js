const { getAICommands } = require('../lib/request');
const { execByLine } = require('../lib/execbyline');
const { checkValidCmd } = require('../lib/request');

const { exec } = require('child_process');
const { get } = require('http');

async function proxy(args) {
    const originCmd = args[2];
    const userCmd = args.slice(3).join(' ');
    const validResult = await checkValidCmd(args.slice(2));
    console.log('Origin Command:', args.slice(2));
    console.log('Valid Result:', validResult);
    let execCmd;
    if (validResult.includes('true')  || validResult === true) {
        execCmd = args.slice(2).join(' ');
    } else {
        execCmd = typeof validResult === 'string' ? validResult : `${originCmd} ${userCmd}`;
    }
    console.log('Executing:', execCmd);
    exec(execCmd, (error, stdout, stderr) => {
        if (error) {
            console.error('Error:', error.message);
        } else {
            console.log('Output:', stdout);
            if (stderr) console.log('stderr:', stderr);
        }
    });
}

module.exports = {
  proxy
};