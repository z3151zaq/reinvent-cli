import { getAICommands } from "../lib/request.js";
import fs from "fs";
import readline from "readline";
import { spawn } from "child_process";
import os from "os";
import path from "path";


const promptYesNo = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${question} (Y/n): `, (answer) => {
      rl.close();
      const normalized = answer.trim().toLowerCase();
      resolve(normalized === "" || normalized.startsWith("y"));
    });
  });
};

async function saveAsScript(fileName, question) {
  const platform = os.platform();
  const restrictedPrompt = `
Please notice that only use the commands on user's current OS.
Do NOT include explanations, descriptions, or any extra text.
Task: ${question}
`.trim();

  const commands = await getAICommands(null, restrictedPrompt);

  if (!commands || commands.length === 0) {
    console.error("No commands received from AI.");
    return;
  }

  const commandLines = Array.isArray(commands)
    ? commands
    : commands.split("\n");
  const isShell = platform === "linux" || platform === "darwin";
  const ext = isShell ? "sh" : "bat";
  const scriptPath = `${fileName}.${ext}`;

  const scriptContent = isShell
    ? `#!/bin/bash\n\n${commandLines.join("\n")}\n`
    : commandLines.join("\r\n");

  fs.writeFileSync(scriptPath, scriptContent, { mode: 0o755 });

  console.log(`Script saved as ${scriptPath}`);
  console.log("───────────────────────────────");
  console.log(scriptContent);
  console.log("───────────────────────────────");

  // Only run if platform matches current OS
  // const currentPlatform = os.platform();
  // const isCompatible =
  //   (platform === "windows" && currentPlatform === "win32") ||
  //   (platform === "mac" && currentPlatform === "darwin") ||
  //   (platform === "linux" && currentPlatform === "linux");

  // if (!isCompatible) {
  //   console.log(
  //     `This script was generated for "${platform}", but you're on "${currentPlatform}". Skipping execution.`
  //   );
  //   return;
  // }

  const shouldRun = await promptYesNo(
    "Do you want to execute this script now?"
  );
  if (shouldRun) {
    try {
      const runScript = isShell
        ? ['bash', [path.resolve(scriptPath)]]
        : ['cmd', ['/c', scriptPath]];
      await new Promise((resolve, reject) => {
        const child = spawn(runScript[0], runScript[1], { stdio: 'inherit', shell: true });
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
    } catch (err) {
      console.error("Error executing script:", err);
    }
  }
}

export default saveAsScript;
