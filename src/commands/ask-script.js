import {getAICommands} from '../lib/request.js';

async function saveAsScript(fileName) {
    const commands = await getAICommands();
    // TODO: 获取回命令并保存为一个脚本，接着问用户是否需要帮他执行这个脚本
}
    