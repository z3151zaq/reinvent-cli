import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({
    model: process.env.AI_MODEL_TEXT || ""
  });

  // Build prompt with conversation history
  let fullPrompt = `You are a command line assistant for Node.js developers.`;
  
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
