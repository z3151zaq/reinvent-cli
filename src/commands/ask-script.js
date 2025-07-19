import { getAICommands } from "../lib/request.js";
import fs from "fs";
import readline from "readline";
import { exec } from "child_process";
import util from "util";
import os from "os";
import path from "path";

const execAsync = util.promisify(exec);

const prompt = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
};

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

// Ask user for platform
const askForPlatform = async () => {
  const validPlatforms = ["windows", "mac", "linux"];
  while (true) {
    const input = (
      await prompt(
        "Which platform do you want to generate the script for? (windows/mac/linux): "
      )
    ).toLowerCase();
    if (validPlatforms.includes(input)) return input;
    console.log("Invalid input. Please enter 'windows', 'mac', or 'linux'.");
  }
};

async function saveAsScript(fileName) {
  const commands = await getAICommands();
  // TODO: 获取回命令并保存为一个脚本，接着问用户是否需要帮他执行这个脚本
  if (!commands || commands.length === 0) {
    console.error("No commands received from AI.");
    return;
  }

  const platform = await askForPlatform();
  const commandLines = Array.isArray(commands)
    ? commands
    : commands.split("\n");
  const isShell = platform === "mac" || platform === "linux";
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
  const currentPlatform = os.platform();
  const isCompatible =
    (platform === "windows" && currentPlatform === "win32") ||
    (platform === "mac" && currentPlatform === "darwin") ||
    (platform === "linux" && currentPlatform === "linux");

  if (!isCompatible) {
    console.log(
      `This script was generated for "${platform}", but you're on "${currentPlatform}". Skipping execution.`
    );
    return;
  }

  const shouldRun = await promptYesNo(
    "Do you want to execute this script now?"
  );
  if (shouldRun) {
    try {
      const command = isShell
        ? `bash ${path.resolve(scriptPath)}`
        : `cmd /c "${scriptPath}"`;

      const { stdout, stderr } = await execAsync(command);
      console.log(stdout);
      if (stderr) console.error(stderr);
    } catch (err) {
      console.error("Error executing script:", err);
    }
  }
}

export default saveAsScript;
