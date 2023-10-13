const { Server } = require("socket.io");

const socket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  const confirmedRequests = {};
  const userConnections = {};
  const pendingRequests = {};

  io.on("connection", (socket) => {
    socket.on("set_username", (username) => {
      userConnections[username] = socket.id;
      console.log(userConnections);
    });

    socket.on("request_transfer", (from, to) => {
      const toSocketId = userConnections[to];
      const fromSocketId = userConnections[from];

      if (toSocketId) {
        if (toSocketId === fromSocketId) {
          io.to(fromSocketId).emit("same_user", from);
          return;
        }
        pendingRequests[to] = from;
        io.to(toSocketId).emit("transfer_request", from);
        return;
      } else {
        io.to(fromSocketId).emit("no_user", to);
        return;
      }
    });

    socket.on("confirm_transfer", (from, to) => {
      if (pendingRequests[to] === from) {
        const fromSocketId = userConnections[from];

        confirmedRequests[from] = to;
        delete pendingRequests[to];

        io.to(fromSocketId).emit("transfer_confirmed", to);
      } else {
        const toSocketId = userConnections[to];
        const fromSocketId = userConnections[from];
        io.to(fromSocketId).emit("share_problem", to);
        io.to(toSocketId).emit("share_problem", from);
      }
    });

    socket.on("deny_transfer", (from, to) => {
      if (pendingRequests[to] === from) {
        const fromSocketId = userConnections[from];
        io.to(fromSocketId).emit("transfer_denied", to);
      }
    });

    socket.on("send_code", (from, to, data) => {
      const toSocketId = userConnections[to];
      io.to(toSocketId).emit("receive_code", from, data);
    });

    socket.on("send_first_code", (from, to, data) => {
      const toSocketId = userConnections[to];
      io.to(toSocketId).emit("receive_first_code", from, data);
    });

    socket.on("send_file_change", (from, to, data) => {
      const toSocketId = userConnections[to];
      io.to(toSocketId).emit("receive_file_change", from, data);
    });

    socket.on("stop_transfer", (to) => {
      const toSocketId = userConnections[to];
      io.to(toSocketId).emit("transfer_stop");
    });

    socket.on("disconnect", () => {
      console.log("disconnection", socket.id);
      for (const [username, socketId] of Object.entries(userConnections)) {
        if (socketId === socket.id) {
          for (const [from, to] of Object.entries(confirmedRequests)) {
            if (from === username) {
              const id = userConnections[to];
              io.to(id).emit("reload", username);
              break;
            }
            if (to === username) {
              const id = userConnections[from];
              io.to(id).emit("reload", username);
              break;
            }
          }
          delete userConnections[username];
          break;
        }
      }
      console.log(userConnections);
    });
  });
};

module.exports = { socket };
