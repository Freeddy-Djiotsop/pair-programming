const { Server } = require("socket.io");
const { File } = require("./mongodb");

const socket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
  /**
   *
   * @param {string} from
   * @param {string} to
   * @returns - true
   */
  const checkConfirmedRequests = (from, to) => {
    let result = false;
    for (const [_from, _to] of Object.entries(confirmedRequests)) {
      if ((from === _from && to === _to) || (from === _to && to === _from)) {
        result = true;
        delete confirmedRequests[_from];
        break;
      }
    }
    return result;
  };

  const confirmedRequests = {};
  const userConnections = {};
  const pendingRequests = {};

  io.on("connection", (socket) => {
    socket.on("set_username", (username) => {
      userConnections[username] = socket.id;
      console.log("Liste aller angemeldeten Benutzer für das Teilen:");
      console.log(userConnections);
    });

    socket.on("save_code", async (data) => {
      const file = await File.findById(data.file_id);

      if (!file) {
        socket.emit("error_save_code");
        return;
      }
      file.content = data.code;
      await file.save();
    });

    socket.on("request_transfer", (from, to, data) => {
      const toSocketId = userConnections[to];
      const fromSocketId = userConnections[from];

      if (toSocketId) {
        if (toSocketId === fromSocketId) {
          io.to(fromSocketId).emit("same_user", from);
          return;
        }
        pendingRequests[to] = from;
        io.to(toSocketId).emit("transfer_request", from, data);
      } else {
        io.to(fromSocketId).emit("no_user", to);
      }
    });

    socket.on("confirm_transfer", (from, to) => {
      if (pendingRequests[to] === from) {
        const fromSocketId = userConnections[from];
        confirmedRequests[to] = from;
        io.to(fromSocketId).emit("transfer_confirmed", to);
      } else if (pendingRequests[from] === to) {
        const toSocketId = userConnections[to];
        confirmedRequests[from] = to;
        io.to(toSocketId).emit("transfer_confirmed", from);
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
      if (checkConfirmedRequests(from, to)) {
        const toSocketId = userConnections[to];
        io.to(toSocketId).emit("receive_code", from, data);
      }
    });

    socket.on("send_file_change", (from, to, data) => {
      if (checkConfirmedRequests(from, to)) {
        const toSocketId = userConnections[to];
        io.to(toSocketId).emit("receive_file_change", from, data);
      }
    });

    socket.on("stop_transfer", (from, to) => {
      if (checkConfirmedRequests(from, to)) {
        const toSocketId = userConnections[to];
        io.to(toSocketId).emit("transfer_stop", from);
      }
      console.log(confirmedRequests);
    });

    socket.on("disconnect", () => {
      console.log("disconnection", socket.id);
      for (const [username, socketId] of Object.entries(userConnections)) {
        if (socketId === socket.id) {
          for (const [from, to] of Object.entries(confirmedRequests)) {
            if (from === username) {
              const id = userConnections[to];
              console.log("Diconnect", username, to);
              io.to(id).emit("reload", username);
              delete confirmedRequests[from];
              break;
            }
            if (to === username) {
              const id = userConnections[from];
              console.log("Diconnect", username, from);

              io.to(id).emit("reload", username);
              delete confirmedRequests[from];
              break;
            }
          }
          delete userConnections[username];
          break;
        }
      }
    });
  });
};

module.exports = { socket };
