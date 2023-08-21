const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const platform = require("os").platform();

console.log(`Das Betriebssystem ist: ${platform}`);

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const nodejsCompiler = (filepath) => {
  return new Promise((resolve, reject) => {
    exec(`node ${filepath}`, (error, stdout, stderr) => {
      error && reject({ error, stderr });
      stderr && reject(stderr);
      resolve(stdout);
    });
  });
};

const pyCompiler = (filepath) => {
  return new Promise((resolve, reject) => {
    exec(`python ${filepath}`, (error, stdout, stderr) => {
      error && reject({ error, stderr });
      stderr && reject(stderr);
      resolve(stdout);
    });
  });
};

const cppCompiler = (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);
  const executeCode = platform.startsWith("win")
    ? `${jobId}.out`
    : `./${jobId}.out`;

  return new Promise((resolve, reject) => {
    exec(
      `g++ -Wall ${filepath} -o ${outPath} && cd ${outputPath} && ${executeCode}`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
  });
};

const cCompiler = (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);
  const executeCode = platform.startsWith("win")
    ? `${jobId}.out`
    : `./${jobId}.out`;

  return new Promise((resolve, reject) => {
    exec(
      `gcc -Wall ${filepath} -o ${outPath} && cd ${outputPath} && ${executeCode}`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
  });
};

module.exports = { nodejsCompiler, cppCompiler, pyCompiler, cCompiler };
