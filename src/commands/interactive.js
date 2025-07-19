const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const { exec } = require('child_process');
const { promisify } = require('util');
const { getAICommands, initializeConversationId } = require('../lib/request.js');
const execAsync = promisify(exec);

async function interactive() {
    const chalk = (await import('chalk')).default;
    console.log(chalk.blue.bold('\n🚀 Welcome to Reinvent CLI!\n'));
    console.log(chalk.gray('A commandline tool that allows you to reinvent every command on your computer.\n'));

    await handleAskMode();
}

async function handleAskMode() {
    const chalk = (await import('chalk')).default;
    console.log(chalk.blue('\n🤖 AI Assistant Mode\n'));
    console.log(chalk.gray('Start a session with AI to get command recommendations.\n'));
    
    // Initialize conversation ID

    const conversationId = await initializeConversationId();
    // Start AI session
    while (true) {
        // First, ask for language preference
        const language = 'en';

        const { question } = await prompt([
            {
                type: 'input',
                name: 'question',
                message: chalk.cyan('What would you like to do? '),
                validate: (input) => {
                    if (input.trim().length === 0) {
                        return 'Please enter a question';
                    }
                    return true;
                }
            }
        ]);

        console.log(chalk.yellow(`\n🤔 Processing: "${question}"`));
        
        try {
            // Get AI recommendations using getAICommands with language parameter
            const aiResponse = await getAICommands(conversationId,question);
            
            // Parse the AI response to extract commands
            const commands = aiResponse.split('\n').filter(line => line.trim().length > 0);
            
            if (commands.length === 0) {
                console.log(chalk.red('❌ No commands received from AI.'));
                continue;
            }
            
            const isCommand = commands.shift().startsWith('#command');

            // Display the AI response
            if (isCommand) {
                console.log(chalk.green('\n✅ AI Recommended Commands:'));
                commands.forEach((cmd) => {
                    console.log(chalk.white(` ${cmd}`));
                });
                
                // Only ask for confirmation if the first command starts with '#command'
                const { confirm } = await prompt([
                    {
                        type: 'list',
                        name: 'confirm',
                        message: chalk.cyan('Would you like to execute these commands by line?'),
                        choices: [
                            {
                                name: chalk.green('✅ Yes, execute the commands'),
                                value: 'yes'
                            },
                            {
                                name: chalk.yellow('🔄 No, ask AI for different advice'),
                                value: 'no'
                            }
                        ]
                    }
                ]);

                switch (confirm) {
                  case 'yes':
                      console.log(chalk.blue('\n🚀 Executing commands...\n'));
                      for (const cmd of commands) {
                          try {
                              console.log(chalk.yellow(`> ${cmd}`));
                              const { stdout, stderr } = await execAsync(cmd);
                              
                              if (stdout) {
                                  console.log(chalk.green('✅ Output:'));
                                  console.log(chalk.white(stdout));
                              }
                              
                              if (stderr) {
                                  console.log(chalk.yellow('⚠️  Warnings:'));
                                  console.log(chalk.white(stderr));
                              }
                          } catch (error) {
                              console.log(chalk.red(`❌ Error executing: ${cmd}`));
                              console.log(chalk.white(error.message));
                          }
                      }
                      console.log(chalk.green('\n✅ Commands executed successfully!\n'));
                      break;
                      
                  case 'no':
                      console.log(chalk.yellow('\n🔄 Asking AI for different advice...\n'));
                      continue;
              }
              
            } else {
                console.log(chalk.green('\n✅ AI Advice:'));
                commands.forEach((cmd) => {
                    console.log(chalk.white(` ${cmd}`));
                });
                
                // For advice, just continue to next question
                continue;
            }
            
            
            
        } catch (error) {
            console.log(chalk.red('❌ Error getting AI recommendations:'));
            console.log(chalk.white(error.message));
            
            const { retry } = await prompt([
                {
                    type: 'confirm',
                    name: 'retry',
                    message: chalk.cyan('Would you like to try again?'),
                    default: true
                }
            ]);
            
            if (!retry) {
                console.log(chalk.gray('\n👋 Exiting AI session.\n'));
                return;
            }
        }
    }
}


module.exports = {
    interactive
};