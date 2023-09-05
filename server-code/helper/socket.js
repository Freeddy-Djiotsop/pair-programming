const { Server } = require("socket.io");

const socket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("send_code", (data) => {
      console.log(data.code);
      socket.broadcast.emit("receive_code", data);
    });

    socket.on("disconnect", () => {
      console.log(`user disconnected: ${socket.id}`);
    });
  });
};

module.exports = { socket };
