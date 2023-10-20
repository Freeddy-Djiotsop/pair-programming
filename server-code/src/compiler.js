const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const platform = require("os").platform();

console.log(`Das Betriebssystem ist: ${platform}`);

const outputPath = path.join(__dirname);
const dirCodes = path.join(__dirname);
let filePath;

const generateSourceCode = async (format, content) => {
  const jobId = uuid();
  const filename = `${jobId}.${format}`;
  filePath = path.join(dirCodes, filename);
  fs.writeFileSync(filePath, content);
};

const nodejsCompiler = () => {
  return new Promise((resolve, reject) => {
    exec(`node ${filePath}`, (error, stdout, stderr) => {
      deleteSourceCode(filePath);
      error && reject({ error, stderr });
      stderr && reject(stderr);
      resolve(stdout);
    });
  });
};

const pyCompiler = () => {
  return new Promise((resolve, reject) => {
    exec(`python ${filePath}`, (error, stdout, stderr) => {
      deleteSourceCode(filePath);
      error && reject({ error, stderr });
      stderr && reject(stderr);
      resolve(stdout);
    });
  });
};

const phpCompiler = () => {
  return new Promise((resolve, reject) => {
    exec(`php ${filePath}`, (error, stdout, stderr) => {
      deleteSourceCode(filePath);
      error && reject({ error, stderr });
      stderr && reject(stderr);
      resolve(stdout);
    });
  });
};

const cppCompiler = () => {
  const jobId = path.basename(filePath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);
  const executeCode = platform.startsWith("win")
    ? `${jobId}.out`
    : `./${jobId}.out`;

  return new Promise((resolve, reject) => {
    exec(
      `g++ -Wall ${filePath} -o ${outPath} && cd ${outputPath} && ${executeCode}`,
      (error, stdout, stderr) => {
        deleteSourceCode(outPath);
        deleteSourceCode(filePath);
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
  });
};

const cCompiler = () => {
  const jobId = path.basename(filePath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);
  const executeCode = platform.startsWith("win")
    ? `${jobId}.out`
    : `./${jobId}.out`;

  return new Promise((resolve, reject) => {
    exec(
      `gcc -Wall ${filePath} -o ${outPath} && cd ${outputPath} && ${executeCode}`,
      (error, stdout, stderr) => {
        deleteSourceCode(outPath);
        deleteSourceCode(filePath);
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
  });
};

const deleteSourceCode = (path) => {
  try {
    fs.rmSync(path, { recursive: true });
  } catch (error) {
    console.error(`Fehler beim Löschen des Verzeichnisses ${path}: ${error}`);
  }
};

const runCode = async (req, res) => {
  const { language, code } = req.body;

  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }
  try {
    await generateSourceCode(language, code);
    let output;
    switch (language) {
      case "c":
        output = await cCompiler();
        break;
      case "cpp":
        output = await cppCompiler();
        break;
      case "py":
        output = await pyCompiler();
        break;
      case "js":
        output = await nodejsCompiler();
        break;
      case "php":
        output = await phpCompiler();
        break;
    }

    res.json({ output });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = { runCode };
