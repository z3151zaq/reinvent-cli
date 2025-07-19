const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const { spawn } = require('child_process');
const { getAICommands, initializeConversationId } = require('../lib/request.js');

async function interactive() {
    const chalk = (await import('chalk')).default;
    console.log(chalk.blue.bold('\n🚀 Welcome to Reinvent CLI!\n'));
    console.log(chalk.gray('A commandline tool that allows you to reinvent every command on your computer.\n'));

    await handleAskMode();
}

async function handleAskMode() {
    const chalk = (await import('chalk')).default;
    console.log(chalk.bgBlue.white.bold('\n🤖 AI Assistant Mode\n'));
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

        console.log(chalk.bgYellow.black(`\n🤔 Processing: "${question}"`));
        
        try {
            // Get AI recommendations using getAICommands with language parameter
            const aiResponse = await getAICommands(conversationId,question);
            
            // Parse the AI response to extract commands
            const commands = aiResponse.split('\n').filter(line => line.trim().length > 0);
            
            if (commands.length === 0) {
                console.log(chalk.bgRed.white('❌ No commands received from AI.'));
                continue;
            }
            
            const isCommand = commands.shift().startsWith('#command');

            // Display the AI response
            if (isCommand) {
                console.log(chalk.bgGreen.black('\n✅ AI Recommended Commands:'));
                commands.forEach((cmd, idx) => {
                    console.log(chalk.whiteBright(`  ${chalk.bold(idx + 1)}. ${cmd}`));
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
                              console.log(chalk.bgMagenta.whiteBright(`> ${cmd}`));
                              // 拆分命令和参数
                              const parts = cmd.split(' ');
                              const mainCmd = parts[0];
                              const args = parts.slice(1);
                              await new Promise((resolve, reject) => {
                                  const child = spawn(mainCmd, args, { stdio: 'inherit', shell: true });
                                  child.on('close', (code) => {
                                      if (code === 0) {
                                          resolve();
                                      } else {
                                          reject(new Error(`Process exited with code ${code}`));
                                      }
                                  });
                                  child.on('error', (err) => {
                                      reject(err);
                                  });
                              });
                          } catch (error) {
                              console.log(chalk.bgRed.whiteBright(`❌ Error executing: ${cmd}`));
                              console.log(chalk.redBright(error.message));
                          }
                      }
                      console.log(chalk.bgGreen.white.bold('\n✅ Commands executed successfully!\n'));
                      break;
                      
                  case 'no':
                      console.log(chalk.bgYellow.black('\n🔄 Asking AI for different advice...\n'));
                      continue;
              }
              
            } else {
                console.log(chalk.bgCyan.black('\n✅ AI Advice:'));
                commands.forEach((cmd, idx) => {
                    console.log(chalk.cyanBright(`${cmd}`));
                });
                continue;
            }
            
            
            
        } catch (error) {
            console.log(chalk.bgRed.white('❌ Error getting AI recommendations:'));
            console.log(chalk.redBright(error.message));
            
            const { retry } = await prompt([
                {
                    type: 'confirm',
                    name: 'retry',
                    message: chalk.cyan('Would you like to try again?'),
                    default: true
                }
            ]);
            
            if (!retry) {
                console.log(chalk.bgGray.white.bold('\n👋 Exiting AI session.\n'));
                return;
            }
        }
    }
}


module.exports = {
    interactive
};