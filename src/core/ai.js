import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import getSystemInfo from '../lib/getSystemInfo.js';
import { getDirectoryFiles } from '../lib/getDirectory.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Conversation history storage - using simple array, one session per process
let conversationHistory = [];

// Add message to conversation history
const addToConversationHistory = (role, content) => {
  conversationHistory.push({ role, content, timestamp: new Date() });
};

// Get conversation history
const getConversationHistory = () => {
  return conversationHistory;
};

// Clear conversation history
const clearConversationHistory = () => {
  conversationHistory = [];
};

export const generateFromAI = async (input) => {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.AI_MODEL_TEXT || "gemini-1.5-flash"
  });

  // Get system and directory context
  const systemInfo = getSystemInfo();
  const directoryFiles = getDirectoryFiles();
  const currentDir = process.cwd();

  // Build prompt with conversation history and context
  let fullPrompt = `You are a command line assistant for Node.js developers.`;
  
  // Add system context
  fullPrompt += `\n\nSystem Information:
- Platform: ${systemInfo.platform}
- Architecture: ${systemInfo.arch}
- Hostname: ${systemInfo.hostname}
- OS Type: ${systemInfo.type}
- OS Release: ${systemInfo.release}
- Current Directory: ${currentDir}
- Available Files: ${directoryFiles.slice(0, 20).join(', ')}${directoryFiles.length > 20 ? '...' : ''}`;
  
  // If there's conversation history, add it to the prompt
  if (conversationHistory.length > 0) {
    fullPrompt += `\n\nPrevious conversation context:\n`;
    conversationHistory.forEach((msg) => {
      fullPrompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
    });
    fullPrompt += `\nBased on the conversation history above, please continue to help the user.`;
  }

  fullPrompt += `\n\nCurrent user requirement: ${JSON.stringify(input)}\nYour job is to convert this requirement into valid **Node.js related terminal commands**.\nOutput the commands in plain text only.\n**Do not output any explanation, description, or code blocks.**\nEach command must be on its own line.`.trim();

  const result = await model.generateContent(fullPrompt);
  const text = (await result.response.text()) || "No response text";
  
  // Save to conversation history
  addToConversationHistory('user', input);
  addToConversationHistory('assistant', text);
  
  return { 
    output: text,
    historyLength: conversationHistory.length
  };
};
