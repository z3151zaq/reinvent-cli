const { execByLine } = require("../lib/execbyline");
const { checkValidCmd, getValidCmd } = require("../lib/request");

const { exec, spawn, execSync } = require("child_process");

async function proxy(args) {
  console.log("Received command:", args);
  const validResult = await checkValidCmd(args.slice(2));
  console.log("Origin Command:", args.slice(2));
  console.log("Valid Result:", validResult);
  let execCmd;
  if (process.platform === "win32") {
    execCmd = args.slice(2);
    console.log("execCmd:", execCmd);

    // Get the first command and execute where to find its path
    const firstCmd = execCmd[0];
    console.log("First command:", firstCmd);

    try {
      // Execute where command to find the actual path
      if (validResult.includes("true")) {
        const whereResult = execSync(`where ${firstCmd}`, {
          encoding: "utf-8",
        });
        const whereLines = whereResult
          .trim()
          .split("\n")
          .map((line) => line.replace(/\r/g, ""));

        console.log("Where result lines:", whereLines);

        // Get the second line (index 1) if it exists
        let actualPath = firstCmd; // fallback to original command
        if (whereLines.length > 1) {
          actualPath = whereLines[1].trim();
          console.log("Using second path from where result:", actualPath);
        } else if (whereLines.length === 1) {
          actualPath = whereLines[0].trim();
          console.log("Using first path from where result:", actualPath);
        }

        console.log("Executing:", actualPath, execCmd.slice(1));

        const fullCommand = `"${actualPath}" ${execCmd.slice(1).join(" ")}`;
        console.log("Full command:", fullCommand);
        exec(fullCommand, (error, stdout, stderr) => {
          if (error) {
            console.error("Exec error:", error.message);
            return;
          }
          if (stderr) {
            console.error("Stderr:", stderr);
          }
          if (stdout) {
            console.log("Stdout:", stdout);
          }
          console.log("Command completed successfully");
        });
        console.log("Executed:", fullCommand);
      }
      else {
        console.log("Command is not valid, trying to get a valid command...");
        execCmd = await getValidCmd(args.slice(2));
        console.log("Executing:", execCmd);
        execByLine(execCmd);
        console.log("Got valid command:", execCmd);
      }
    } catch (error) {
      console.error("Error executing where command:", error.message);
      // Fallback to original command
      console.log("Fallback: Executing original command:", execCmd.join(" "));
      spawn(execCmd[0], execCmd.slice(1), { stdio: "inherit" });
    }
  } else {
    if (validResult.includes("true")) {
      execCmd = args.slice(2);
      console.log("Executing:", execCmd.join(" "));
      spawn(execCmd[0], execCmd.slice(1), { stdio: "inherit" });
    } else {
      console.log("Command is not valid, trying to get a valid command...");
      execCmd = await getValidCmd(args.slice(2));
      console.log("Executing:", execCmd);
      execByLine(execCmd);
    }
  }
}

module.exports = {
  proxy,
};
