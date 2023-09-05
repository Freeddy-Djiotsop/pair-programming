const express = require("express");
const http = require("http");
const cors = require("cors");
const { socket } = require("./helper/socket");
const { runCode } = require("./compiler");
const { login, register } = require("./helper/user");

const app = express();
const port = 3001;
const server = http.createServer(app);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("", (req, res) => {
  res.status(200).json({ message: "Hallo" });
});
app.post("/user/register", register);
app.post("/user/login", login);
app.post("/run", runCode);

socket(server);

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
