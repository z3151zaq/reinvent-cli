#!/usr/bin/env node
const path = require('path');

const { Command } = require('commander');

const { handleAskCommand, startConversationMode } = require(path.join(__dirname, '../src/commands/ask.js'));
const { interactive } = require(path.join(__dirname, '../src/commands/interactive.js'));
const { proxy } = require(path.join(__dirname, '../src/commands/proxy.js'));

const program = new Command();

program
  .name('reinvent')
  .description('A commandline tool that allows you to reinvent every command on your computer.')
  .version('1.0.2');

program
  .command('ask <question...>')
  .description('Ask a question and start conversation mode')
  .action(async (questionArr) => {
    const question = questionArr.join(' ');
    await handleAskCommand(question);
    await startConversationMode();
  });

program
  .command('interactive')
  .description('Start interactive mode')
  .action(() => {
    interactive();
  });

program
  .command('proxy')
  .description('Start proxy mode')
  .action(async () => {
    await proxy();
  });


if (!process.argv.slice(2).length) {
  interactive();
} else {
  // 只允许 ask 和 interactive 进入对应逻辑，其他都进入 proxy
  const firstArg = process.argv[2];
  if (firstArg === 'ask' || firstArg === 'interactive') {
    program.parseAsync(process.argv);
  } else {
    proxy();
  }
}
