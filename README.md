# Reinvent CLI

A powerful command-line tool that revolutionizes how you interact with your terminal by providing AI-powered command generation, interactive assistance, and command hijacking capabilities.

## 🌟 Features

- **AI-Powered Command Generation**: Convert natural language into executable terminal commands
- **Interactive Mode**: Continuous AI assistance with conversation memory
- **Command Hijacking**: Seamlessly enhance existing system commands with AI capabilities
- **Proxy Mode**: Intercept and enhance any command with natural language parameters
- **Script Mode**: Save and reuse command templates
- **Cross-Platform Support**: Works on Windows, macOS, and Linux
- **Conversation Memory**: Maintains context across multiple interactions

## 🚀 Installation

```bash
npm install -g reinvent-cli
```

## 📖 Usage

### 1. Ask Mode - Direct AI Commands

```bash
# Ask AI to perform any task
reinvent ask "list all files in current directory"
reinvent ask "create a backup of my documents"
reinvent ask "find all Python files and count them"
```

### 2. Interactive Mode - Continuous AI Assistant

```bash
# Start an interactive AI session
reinvent interactive
```

In interactive mode, you can:
- Have continuous conversations with AI
- Execute commands with context from previous interactions
- Build complex workflows step by step
- Get real-time command recommendations

### 3. Command Hijacking - Enhance System Commands

```bash
# Hijack any system command to add AI capabilities
reinvent ls
reinvent find
reinvent git
```

After hijacking, the original command becomes AI-enhanced:
```bash
ls "show only files modified today"
find "search for files containing 'config'"
git "show recent commits"
```

### 4. Proxy Mode - Advanced Command Interception

```bash
# Use proxy mode for complex command scenarios
reinvent proxy
```

### 5. Help and Documentation

```bash
# Get detailed help information
reinvent help
```

## 🎯 Examples

### Basic Usage Examples

```bash
# File operations
reinvent ask "create a new directory called projects"
reinvent ask "list all text files in current directory"
reinvent ask "find files larger than 1MB"

# System operations
reinvent ask "check disk space usage"
reinvent ask "show running processes"
reinvent ask "install a package"

# Development tasks
reinvent ask "initialize a new Node.js project"
reinvent ask "create a Python virtual environment"
reinvent ask "clone a repository from GitHub"
```

### Interactive Session Example

```bash
reinvent interactive

# Session flow:
# 1. "I want to set up a new web project"
# 2. AI suggests: mkdir my-project && cd my-project && npm init -y
# 3. "Add Express framework"
# 4. AI suggests: npm install express
# 5. "Create a basic server file"
# 6. AI suggests: touch server.js && echo "const express = require('express');..." > server.js
```

### Command Hijacking Examples

```bash
# Hijack ls command
reinvent ls

# Now you can use enhanced ls:
ls "show only directories"
ls "files modified in last 24 hours"
ls "sort by size, largest first"

# Hijack git command
reinvent git

# Enhanced git commands:
git "show recent commits"
git "check status of all branches"
git "create a new feature branch"
```

## ⚙️ Configuration


### Shell Configuration

The tool automatically configures your shell for command hijacking:

- **Windows**: PowerShell profile (`Microsoft.PowerShell_profile.ps1`)
- **macOS/Linux**: `.zshrc` (Zsh) or `.bashrc` (Bash)

## 🔧 How It Works

### 1. AI Integration
- Connects to AI services for natural language processing
- Maintains conversation context across sessions
- Provides intelligent command suggestions

### 2. Command Execution
- Validates commands before execution
- Provides confirmation prompts for safety
- Executes commands line by line with real-time feedback

### 3. Context Awareness
- Analyzes current directory structure
- Considers system information and available files
- Maintains conversation history for contextual responses

### 4. Safety Features
- Command validation before execution
- User confirmation for potentially destructive operations
- Error handling and graceful failure recovery

## 🛠️ Architecture

```
reinvent-cli/
├── bin/
│   └── reinvent.js          # Main CLI entry point
├── src/
│   ├── commands/
│   │   ├── ask.js          # Direct AI command handling
│   │   ├── interactive.js  # Interactive mode
│   │   ├── proxy.js        # Proxy mode
│   │   ├── help.js         # Help system
│   │   └── ask-script.js   # Script mode
│   ├── core/
│   │   └── logger.js       # Logging system
│   └── lib/
│       ├── request.js      # AI API communication
│       ├── hijackCommand.js # Command hijacking
│       ├── execbyline.js   # Command execution
│       └── getContextInfo.js # System context gathering
```

## 🌐 API Integration

The tool integrates with AI services through the API endpoint:
- **Endpoint**: `https://2025hackathon-steel.vercel.app/api/ask`
- **Features**: Conversation memory, context awareness, multi-language support

## 📚 Advanced Features

### Conversation Memory
- Maintains context across multiple commands
- Remembers previous interactions and file states
- Provides contextual command suggestions

### Multi-Language Support
- Supports multiple languages for AI responses
- Configurable language preferences
- Localized command suggestions

### Script Mode
- Save frequently used command sequences
- Reusable command templates
- Batch command execution

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

ISC License - see LICENSE file for details

## 🌟 Project Website

For more information, visit: https://2025hackathon-steel.vercel.app/

---

**Transform your terminal experience with AI-powered command generation and intelligent assistance!**
