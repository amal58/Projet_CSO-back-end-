const socketIo = require('socket.io');

let ioTessiture;

function initializeTessitureSocket(server) {
  // Ajoutez cette configuration CORS lors de l'initialisation du serveur Socket.IO
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5000", // Ajoutez l'origine de votre serveur principal ici
      methods: ["GET", "POST"]
    }
  });

  ioTessiture = io.of('/tessiture');

  ioTessiture.on('connection', (socket) => {
    console.log(`Client connecté à la tessiture: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Client déconnecté de la tessiture: ${socket.id}`);
    });
  });

  return io;
}

function getIoTessiture() {
  if (!ioTessiture) {
    throw new Error("Socket.IO Tessiture not initialized");
  }
  return ioTessiture;
}

module.exports = {
  initializeTessitureSocket,
  getIoTessiture,
};
