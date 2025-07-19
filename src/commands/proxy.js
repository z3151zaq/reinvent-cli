const { getAICommands } = require('../lib/request');
const { execByLine } = require('../lib/execbyline');

async function proxy() {
    const commands = await getAICommands();
    execByLine(commands);
}

module.exports = {
  proxy
};