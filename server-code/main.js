const express = require("express");
const cors = require("cors");
const { generateSourceCode } = require("./helper/generateSourceCode");
const { cCompiler, cppCompiler, pyCompiler } = require("./compiler");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("", (req, res) => {
  res.status(200).json({ message: "Hallo" });
});
app.post("/run", async (req, res) => {
  const { language, code } = req.body;

  console.log(language, "Length:", code.length);

  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }
  try {
    // will generate a .language file with content from the request
    const filepath = await generateSourceCode(language, code);
    let output;
    switch (language) {
      case "c":
        output = await cCompiler(filepath);
        break;
      case "cpp":
        output = await cppCompiler(filepath);
        break;
      case "python":
        output = await pyCompiler(filepath);
        break;
      case "javascript":
        output = await nodejsCompiler(filepath);
        break;
      case "java":
        output = await cCompiler(filepath);
        break;
    }
    // write into DB
    // const job = await new Job({ language, filepath }).save();
    // const jobId = job["_id"];
    // addJobToQueue(jobId);
    // res.status(201).json({ jobId });
    res.json({ filepath, output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
