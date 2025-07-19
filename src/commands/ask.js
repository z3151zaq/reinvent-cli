const readline = require('readline');
const { execSync } = require('child_process');
const logger = require('../core/logger.js').default;
const { fetchUrl } = require('../lib/request.js');
// Conversation history storage - using simple array, one session per process
let conversationHistory = [];

function addToConversationHistory(role, content) {
  conversationHistory.push({ role, content, timestamp: new Date() });
}

function buildPrompt(userInput) {
  // const systemInfo = getSystemInfo();
  // const directoryFiles = getDirectoryFiles();
  // const currentDir = process.cwd();

  let prompt = `You are a command line assistant for Node.js developers.`;
  
//   prompt += `
//   \n\nSystem Information:
// - Platform: ${systemInfo.platform}
// - Architecture: ${systemInfo.arch}
// - Hostname: ${systemInfo.hostname}
// - OS Type: ${systemInfo.type}
// - OS Release: ${systemInfo.release}
// - Current Directory: ${currentDir}
// - Available Files: ${directoryFiles.slice(0, 20).join(', ')}${directoryFiles.length > 20 ? '...' : ''}`;
  if (conversationHistory.length > 0) {
    prompt += `\n\nPrevious conversation context:\n`;
    conversationHistory.forEach((msg) => {
      prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
    });
    prompt += `\nBased on the conversation history above, please continue to help the user.`;
  }

  prompt += `\n\nCurrent user requirement: ${JSON.stringify(userInput)}\nYour job is to convert this requirement into valid **Node.js related terminal commands**.\nOutput the commands in plain text only.\n**Do not output any explanation, description, or code blocks.**\nEach command must be on its own line.`;

  return prompt;
}

/**
 * Execute commands list
 * @param {string[]} commands - Array of commands to execute
 */
function executeCommands(commands) {
  for (const cmd of commands) {
    try {
      logger.info(`\n> ${cmd}`);
      execSync(cmd, { stdio: 'inherit', shell: true });
    } catch (err) {
      logger.error('Error executing command: ' + (err.message || err));
    }
  }
  logger.system('Commands executed.');
}

/**
 * Send user input to remote AI API and get commands
 * @param {string} input
 * @returns {Promise<string>} AI generated commands
 */
async function postToAI(input) {
  try {
    const fetch = (await import('node-fetch')).default;
    const prompt = buildPrompt(input);
    addToConversationHistory('user', input);
    const data = await fetchUrl({ input: prompt, uuid: null });
    // const response = await fetch('http://2025hackathon-steel.vercel.app/api/ask', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ input: prompt })
    // });
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // const data = await response.json();
    // 只输出 response 字段
    addToConversationHistory('assistant', data.response || '');
    return data.response || '';
  } catch (err) {
    logger.error('Failed to get AI response: ' + err.message);
    return '';
  }
}

/**
 * Handle ask command with question (single AI call, y/n only)
 * @param {string} question - The question to ask AI
 * @returns {Promise<void>}
 */
async function handleAskCommand(question) {
  try {
    const output = await postToAI(question);
    logger.ai(output);
    logger.system('Execute the commands? (y = execute, n = skip): ');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise(resolve => {
      rl.question('', resolve);
    });
    rl.close();

    const choice = answer.trim().toLowerCase();
    if (choice === 'y') {
      const commands = output.split('\n').filter(Boolean);
      executeCommands(commands);
    } else if (choice === 'n') {
      logger.system('Skipped.');
    } else {
      logger.warn('Invalid input. Exiting.');
    }
  } catch (err) {
    logger.error('Error: ' + (err.message || err));
    process.exit(1);
  }
}

module.exports = {
  handleAskCommand
}; 