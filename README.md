# Reinvent CLI

A commandline tool that allows you to reinvent every command on your computer with AI-powered conversation memory.

## Features

- **AI-powered command generation**: Convert natural language requirements into valid terminal commands
- **Conversation memory**: Maintains conversation history across multiple commands in the same terminal session
- **Command execution**: Execute generated commands with confirmation

## Installation

```bash
npm install -g reinvent-cli
```

## Usage

### Basic Usage

```bash
reinvent "install express"
reinvent "add cors middleware"  # AI remembers the previous context
reinvent "create a simple server"  # AI knows you're building an Express app
```

The AI will automatically remember your previous commands and provide more contextual responses based on your conversation history.

## Examples

```bash
# First command
reinvent "install express"

# Second command - AI remembers you're working with Express
reinvent "add cors middleware"

# Third command - AI knows you're building a web server
reinvent "create a simple server with routes"

# Fourth command - AI understands your project structure
reinvent "add authentication middleware"
```

## Environment Setup

Create a `.env` file in the project root:

```
GEMINI_API_KEY=your_gemini_api_key_here
AI_MODEL_TEXT=gemini-pro
```

## How Conversation Memory Works

1. **Session-based**: Each terminal session maintains its own conversation history
2. **Context preservation**: AI remembers previous commands and their context
3. **Automatic history**: All user inputs and AI responses are automatically saved
4. **Session isolation**: Different terminal windows have separate conversation histories

The AI will use the conversation history to provide more contextual and relevant commands based on your previous interactions.
