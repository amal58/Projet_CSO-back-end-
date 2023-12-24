const socketIo = require("socket.io");

let io;

function initializeSocket(server) {
  io = socketIo(server);
  return io;
}

function getIo() {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
}

module.exports = { initializeSocket, getIo };
