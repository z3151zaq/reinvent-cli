#!/usr/bin/env node
const path = require('path');
const { default: boxen } = require('boxen');
const gradientString = require('gradient-string');

const { Command } = require('commander');
const { default: saveAsScript } = require('../src/commands/ask-script');

const { handleAskCommand } = require(path.join(__dirname, '../src/commands/ask.js'));
const { interactive } = require(path.join(__dirname, '../src/commands/interactive.js'));
const { proxy } = require(path.join(__dirname, '../src/commands/proxy.js'));
const { hijackCommand } = require(path.join(__dirname, '../src/lib/hijackCommand.js'));
const { showHelp } = require(path.join(__dirname, '../src/commands/help.js'));


// Welcome message styling
const pkg = require(path.join(__dirname, '../package.json'));
const version = pkg.version;
const buildTime = new Date().toLocaleString();

const welcomeMessage = gradientString('#0087FF', 'magenta').multiline(
  `Welcome to Reinvent CLI!\nVersion: ${version}\nBuild Time: ${buildTime}\n\n🌐 Website: https://2025hackathon-steel.vercel.app/`
);

const boxenOptions = {
  borderColor: '#0087FF',
  borderStyle: 'round',
  margin: 2,
  padding: 1,
  title: `✨  Reinvent CLI  ✨ `,
  titleAlignment: 'center',
};

// Display welcome message
console.log(boxen(welcomeMessage, boxenOptions));

const program = new Command();

program
  .name('reinvent')
  .description('A commandline tool that allows you to reinvent every command on your computer.')
  .version('1.0.5');

// Custom help command
program
  .command('help')
  .description('Show detailed usage information')
  .action(() => {
    showHelp();
  });

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

if (!process.argv.slice(2).length) {
  interactive();
} else {
  // 只允许 ask 和 interactive 进入对应逻辑，其他都进入 proxy
  const firstArg = process.argv[2];
  if (firstArg === 'ask' || firstArg === 'interactive' || firstArg === 'help') {
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