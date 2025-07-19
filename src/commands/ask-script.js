import { getAICommands } from "../lib/request.js";
import fs from "fs";
import readline from "readline";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

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

async function saveAsScript(fileName) {
  const commands = await getAICommands();
  // TODO: 获取回命令并保存为一个脚本，接着问用户是否需要帮他执行这个脚本

  if (!commands || commands.length === 0) {
    console.error("No commands received from AI.");
    return;
  }

  const scriptContent = `#!/bin/bash\n\n${commands}\n`;

  const scriptPath = `${fileName}.sh`;
  fs.writeFileSync(scriptPath, scriptContent, { mode: 0o755 });

  console.log(`Script saved as ${scriptPath}`);
  console.log("'''''''''''''''''''''''''''''''");
  console.log(commands);
  console.log("'''''''''''''''''''''''''''''''");

  const shouldRun = await promptYesNo(
    "Do you want to execute this script now?"
  );

  if (shouldRun) {
    try {
      const { stdout, stderr } = await execAsync(`bash ${scriptPath}`);
      console.log(stdout);
      if (stderr) console.error(stderr);
    } catch (err) {
      console.error("Error executing script:", err);
    }
  }
}

export default saveAsScript;