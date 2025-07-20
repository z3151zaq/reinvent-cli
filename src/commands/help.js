/**
 * Help command module for Reinvent CLI
 * Provides detailed usage information and examples for the CLI tool
 */

const logger = require('../core/logger.js').default;

/**
 * Display detailed help information for the Reinvent CLI
 * Shows usage patterns, available commands, and examples
 * @returns {void}
 */
function showHelp() {
  const helpText = `
Usage: reinvent [ ask | config | CMD ] [ options ]
       reinvent ask <natural language>
       reinvent CMD
       reinvent CMD <natural language>
       
Commands:
  ask <input>     Ask AI to do anything you want in your terminal
  interactive     Start interactive mode for continuous AI assistance
  proxy           Start proxy mode to intercept and enhance system commands
  help            Show this help message

Examples:
  reinvent ask "list all files in current directory"
  reinvent ask "create a new directory called projects"
  reinvent ls
  reinvent ls "show only text files"
  reinvent find "search for files containing 'test'"
  reinvent config --language

Features:
  • Natural language command generation
  • Interactive AI assistance mode
  • Command proxy for enhanced system commands
  • Script mode for reusable command templates
  • Conversation history for context-aware assistance

For more information, visit: https://2025hackathon-steel.vercel.app/
`;

  logger.system(helpText);
}

/**
 * Display brief help information
 * Shows quick usage summary
 * @returns {void}
 */
function showBriefHelp() {
  const briefHelp = `
Usage: reinvent [command] [options]

Commands:
  ask <input>     Ask AI to do anything
  interactive     Start interactive mode
  proxy           Start proxy mode
  help            Show detailed help

Examples:
  reinvent ask "list files"
  reinvent ls
  reinvent help
`;

  logger.system(briefHelp);
}

/**
 * Display help for a specific command
 * @param {string} command - The command to show help for
 * @returns {void}
 */
function showCommandHelp(command) {
  const commandHelps = {
    ask: `
reinvent ask <input>

Ask AI to do anything you want in your terminal.

Arguments:
  input    Natural language description of what you want to do

Examples:
  reinvent ask "list all files in current directory"
  reinvent ask "create a backup of my documents"
  reinvent ask "find all Python files and count them"
`,
    interactive: `
reinvent interactive

Start interactive mode for continuous AI assistance.

In interactive mode, you can:
  • Have continuous conversations with AI
  • Execute commands with context from previous interactions
  • Build complex workflows step by step
  • Save and reuse command sequences

Examples:
  reinvent interactive
`,
    proxy: `
reinvent proxy

Start proxy mode to intercept and enhance system commands.

Proxy mode allows you to:
  • Use natural language with any system command
  • Enhance existing commands with AI assistance
  • Get intelligent suggestions for command options
  • Maintain command history and context

Examples:
  reinvent ls "show only files modified today"
  reinvent find "search for files containing 'config'"
  reinvent git "show recent commits"
`
  };

  const help = commandHelps[command];
  if (help) {
    logger.system(help);
  } else {
    logger.warn(`No help available for command: ${command}`);
    showBriefHelp();
  }
}

module.exports = {
  showHelp,
  showBriefHelp,
  showCommandHelp
}; 