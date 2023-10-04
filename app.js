const express = require("express");
const path = require("path");
const { Socket } = require("socket.io");
const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`💬 server running on port ${port}`);
});
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

// SOCKET.IO

let socketConnectd = new Set();
io.on("connection", onConnected);

function onConnected(socket) {
  socketConnectd.add(socket.id);
  io.emit("client-total", socketConnectd.size);

  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);
    socketConnectd.delete(socket.id);
    io.emit("client-total", socketConnectd.size);
  });

  socket.on("message", (data) => {
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("chat-feedback", data);
  });
}
