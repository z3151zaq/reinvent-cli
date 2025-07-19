#!/usr/bin/env node

const [,, ...args] = process.argv;
const path = require('path');
const logger = require(path.join(__dirname, '../src/core/logger.js')).default;
const { handleAskCommand, startConversationMode } = require(path.join(__dirname, '../src/commands/ask.js'));

async function main() {
  if (args.length === 0) {
    logger.system('Usage: reinvent <command> [options]');
    logger.system('Commands:');
    logger.system('  ask <question>  - Ask AI a question and get commands');
    logger.system('  chat            - Start interactive conversation mode');
    logger.system('Press Ctrl+C to exit.');
    process.exit(1);
  }

  const command = args[0];
  
  if (command === 'ask') {
    if (args.length < 2) {
      logger.system('Usage: reinvent ask "<question>"');
      logger.system('Example: reinvent ask "create a new React app"');
      process.exit(1);
    }
    
    // Extract the question (everything after "ask")
    const question = args.slice(1).join(' ');
    await handleAskCommand(question);
    
    // After asking, start conversation mode
    await startConversationMode();
  } else if (command === 'chat') {
    // Start conversation mode directly
    await startConversationMode();
  } else {
    // For any other command, just show usage without calling AI
    logger.system('Usage: reinvent <command> [options]');
    logger.system('Commands:');
    logger.system('  ask <question>  - Ask AI a question and get commands');
    logger.system('  chat            - Start interactive conversation mode');
    logger.system('Press Ctrl+C to exit.');
    process.exit(1);
  }
}

main();
