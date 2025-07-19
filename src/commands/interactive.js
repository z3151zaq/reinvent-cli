const inquirer = require('inquirer');
const chalk = require('chalk');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function interactive() {
    console.log(chalk.blue.bold('\n🚀 Welcome to Reinvent CLI!\n'));
    console.log(chalk.gray('A commandline tool that allows you to reinvent every command on your computer.\n'));

    while (true) {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: chalk.cyan('What would you like to do?'),
                choices: [
                    {
                        name: chalk.green('🤖 Ask AI for help'),
                        value: 'ask'
                    },
                    {
                        name: chalk.yellow('💬 Start conversation mode'),
                        value: 'conversation'
                    },
                    {
                        name: chalk.blue('🔧 Run a custom command'),
                        value: 'custom'
                    },
                    {
                        name: chalk.magenta('📊 Show system info'),
                        value: 'system'
                    },
                    {
                        name: chalk.red('❌ Exit'),
                        value: 'exit'
                    }
                ]
            }
        ]);

        switch (action) {
            case 'ask':
                await handleAskMode();
                break;
            case 'conversation':
                await handleConversationMode();
                break;
            case 'custom':
                await handleCustomCommand();
                break;
            case 'system':
                await handleSystemInfo();
                break;
            case 'exit':
                console.log(chalk.green('\n👋 Goodbye! Thanks for using Reinvent CLI!\n'));
                process.exit(0);
        }
    }
}

async function handleAskMode() {
    console.log(chalk.blue('\n🤖 AI Assistant Mode\n'));
    
    const { question } = await inquirer.prompt([
        {
            type: 'input',
            name: 'question',
            message: chalk.cyan('What would you like to ask?'),
            validate: (input) => {
                if (input.trim().length === 0) {
                    return 'Please enter a question';
                }
                return true;
            }
        }
    ]);

    console.log(chalk.yellow(`\nProcessing: "${question}"`));
    
    // Simulate AI processing
    console.log(chalk.gray('🤔 Thinking...'));
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(chalk.green('✅ Here\'s what I can help you with:'));
    console.log(chalk.white(`- ${question}`));
    console.log(chalk.gray('(This would integrate with your actual AI service)\n'));
}

async function handleConversationMode() {
    console.log(chalk.blue('\n💬 Conversation Mode\n'));
    console.log(chalk.gray('Start a continuous conversation with the AI assistant.\n'));
    
    const { startConversation } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'startConversation',
            message: chalk.cyan('Would you like to start a conversation?'),
            default: true
        }
    ]);

    if (startConversation) {
        console.log(chalk.green('🎉 Starting conversation mode...'));
        console.log(chalk.gray('(This would integrate with your conversation functionality)\n'));
    }
}

async function handleCustomCommand() {
    console.log(chalk.blue('\n🔧 Custom Command Mode\n'));
    
    const { command } = await inquirer.prompt([
        {
            type: 'input',
            name: 'command',
            message: chalk.cyan('Enter the command you want to run:'),
            validate: (input) => {
                if (input.trim().length === 0) {
                    return 'Please enter a command';
                }
                return true;
            }
        }
    ]);

    console.log(chalk.yellow(`\nExecuting: ${command}`));
    
    try {
        const { stdout, stderr } = await execAsync(command);
        
        if (stdout) {
            console.log(chalk.green('✅ Output:'));
            console.log(chalk.white(stdout));
        }
        
        if (stderr) {
            console.log(chalk.yellow('⚠️  Warnings/Errors:'));
            console.log(chalk.white(stderr));
        }
    } catch (error) {
        console.log(chalk.red('❌ Error executing command:'));
        console.log(chalk.white(error.message));
    }
    
    console.log('');
}

async function handleSystemInfo() {
    console.log(chalk.blue('\n📊 System Information\n'));
    
    try {
        const [nodeVersion, npmVersion, platform, arch] = await Promise.all([
            execAsync('node --version'),
            execAsync('npm --version'),
            execAsync('echo $env:OS'),
            execAsync('echo $env:PROCESSOR_ARCHITECTURE')
        ]);

        console.log(chalk.green('✅ System Details:'));
        console.log(chalk.white(`Node.js: ${nodeVersion.stdout.trim()}`));
        console.log(chalk.white(`npm: ${npmVersion.stdout.trim()}`));
        console.log(chalk.white(`Platform: ${platform.stdout.trim()}`));
        console.log(chalk.white(`Architecture: ${arch.stdout.trim()}`));
        
        // Show current directory
        console.log(chalk.white(`Current Directory: ${process.cwd()}`));
        
    } catch (error) {
        console.log(chalk.red('❌ Error getting system info:'));
        console.log(chalk.white(error.message));
    }
    
    console.log('');
}

module.exports = {
    interactive
};