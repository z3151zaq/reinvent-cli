#!/usr/bin/env node
const path = require('path');

const { Command } = require('commander');
const { default: saveAsScript } = require('../src/commands/ask-script');

const { handleAskCommand } = require(path.join(__dirname, '../src/commands/ask.js'));
const { interactive } = require(path.join(__dirname, '../src/commands/interactive.js'));
const { proxy } = require(path.join(__dirname, '../src/commands/proxy.js'));
const { hijackCommand } = require(path.join(__dirname, '../src/lib/hijackCommand.js'));
const program = new Command();

program
  .name('reinvent')
  .description('A commandline tool that allows you to reinvent every command on your computer.')
  .version('1.0.5');

program
  .command('ask <input>')
  .description('Ask AI to do anything you want in your terminal')
  .option('--script <scriptName>', 'Run with script mode')
  .action((input, options) => {
    if (options.script) {
      saveAsScript(options.script, input);
    } else {
      handleAskCommand(input);
    }
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

console.log('processing:', process.argv);

if (!process.argv.slice(2).length) {
  interactive();
} else {
  // 只允许 ask 和 interactive 进入对应逻辑，其他都进入 proxy
  const firstArg = process.argv[2];
  if (firstArg === 'ask' || firstArg === 'interactive') {
    program.parseAsync(process.argv);
  } else {
    // 判断参数个数，多个参数调用 proxy(arg)，否则调用 hijack()
    if (process.argv.length > 3) {
      proxy(process.argv);
    } else {
      hijackCommand(process.argv[2]);
    }
  }
}
