const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { generateSourceCode } = require("./helper/generateSourceCode");
const {
  cCompiler,
  cppCompiler,
  pyCompiler,
  nodejsCompiler,
} = require("./compiler");

const app = express();
const port = 3001;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    // methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/check", (req, res) => {
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
      case "py":
        output = await pyCompiler(filepath);
        break;
      case "js":
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
    console.log(output);
    res.json({ filepath, output });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // socket.on("join_room", (data) => {
  //   socket.join(data);
  // });

  socket.on("send_code", (data) => {
    console.log(data.code);
    socket.broadcast.emit("receive_code", data);
  });

  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
