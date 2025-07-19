const { generateFromAI } = require('../core/ai.js');
const logger = require('../core/logger.js').default;
const readline = require('readline');
const { execSync } = require('child_process');

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
  logger.system('Commands executed. Continuing conversation...');
}

/**
 * Handle user choice (y/n/r)
 * @param {string} answer - User input
 * @param {string} output - AI generated output
 * @param {string} originalInput - Original user input
 * @returns {Promise<boolean>} - Whether to continue conversation
 */
async function handleUserChoice(answer, output, originalInput) {
  const choice = answer.trim().toLowerCase();
  
  if (choice === 'y') {
    const commands = output.split('\n').filter(Boolean);
    executeCommands(commands);
    return true;
  } else if (choice === 'n') {
    logger.system('Skipped. Continuing conversation...');
    return true;
  } else if (choice === 'r') {
    logger.system('Regenerating command(s)...');
    return false; // Need to regenerate
  } else {
    logger.warn('Invalid input. Please enter y, n, or r.');
    return false; // Need to re-enter
  }
}

/**
 * Handle regeneration case
 * @param {string} input - User input
 * @param {readline.Interface} rl - Readline interface
 * @returns {Promise<void>}
 */
async function handleRegeneration(input, rl) {
  try {
    const { output: newOutput } = await generateFromAI(input.trim());
    logger.ai(newOutput);
    logger.system('Execute the commands? (y = execute, n = skip, r = regenerate): ');
    
    const newAnswer = await new Promise(resolve => {
      rl.question('', resolve);
    });
    
    const choice = newAnswer.trim().toLowerCase();
    
    if (choice === 'y') {
      const commands = newOutput.split('\n').filter(Boolean);
      executeCommands(commands);
    } else if (choice === 'n') {
      logger.system('Skipped. Continuing conversation...');
    } else {
      logger.warn('Invalid input. Continuing conversation...');
    }
  } catch (err) {
    logger.error('Error during regeneration: ' + (err.message || err));
  }
}

/**
 * Handle single AI interaction
 * @param {string} input - User input
 * @param {readline.Interface} rl - Readline interface
 * @returns {Promise<void>}
 */
async function handleAIInteraction(input, rl) {
  try {
    const { output } = await generateFromAI(input.trim());
    logger.ai(output);
    logger.system('Execute the commands? (y = execute, n = skip, r = regenerate): ');
    
    const answer = await new Promise(resolve => {
      rl.question('', resolve);
    });
    
    const shouldContinue = await handleUserChoice(answer, output, input);
    
    if (!shouldContinue) {
      if (answer.trim().toLowerCase() === 'r') {
        await handleRegeneration(input, rl);
      }
    }
  } catch (err) {
    logger.error('Error: ' + (err.message || err));
  }
}

/**
 * Start continuous conversation mode
 * @returns {Promise<void>}
 */
async function startConversationMode() {
  logger.system('\nEnter your next command (or press Ctrl+C to exit):');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.on('line', async (input) => {
    if (input.trim() === '') {
      return;
    }
    
    await handleAIInteraction(input, rl);
    logger.system('\nEnter your next command (or press Ctrl+C to exit):');
  });
  
  rl.on('close', () => {
    logger.system('\nConversation ended.');
    process.exit(0);
  });
}

/**
 * Handle ask command with question
 * @param {string} question - The question to ask AI
 * @returns {Promise<void>}
 */
async function handleAskCommand(question) {
  while (true) {
    try {
      const { output } = await generateFromAI(question);
      logger.ai(output);
      logger.system('Execute the commands? (y = execute, n = skip, r = regenerate): ');
      
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        rl.question('', resolve);
      });
      rl.close();
      
      const shouldContinue = await handleUserChoice(answer, output, question);
      
      if (shouldContinue) {
        break;
      }
    } catch (err) {
      logger.error('Error: ' + (err.message || err));
      process.exit(1);
    }
  }
}

module.exports = {
  executeCommands,
  handleUserChoice,
  handleRegeneration,
  handleAIInteraction,
  startConversationMode,
  handleAskCommand
}; 