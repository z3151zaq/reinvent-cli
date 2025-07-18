import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const generateFromAI = async (input) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({
    model: process.env.AI_MODEL_TEXT || ""
  });

  const prompt = `
You are a command line assistant for Node.js developers.  
Below is the user's requirement: ${JSON.stringify(input)}  
Your job is to convert this requirement into valid **Node.js related terminal commands**.  
Output the commands in plain text only.  
**Do not output any explanation, description, or code blocks.**  
Each command must be on its own line.
  `.trim();
  const result = await model.generateContent(prompt);
  const text = (await result.response.text()) || "No response text";
  return { output: text };
};
