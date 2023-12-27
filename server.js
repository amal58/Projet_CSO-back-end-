const app = require("./app");
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server);

// Ajoutez le middleware d'IO à votre application
app.io = io;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/notif.html');
});

io.on('connection', (socket) => {
    console.log('Nouvelle connexion socket :', socket.id);

    // Émettre une notification à chaque connexion
    socket.emit('notification', { message: 'Bienvenue sur la page de notification!' });

    socket.on('disconnect', () => {
        console.log('Déconnexion socket :', socket.id);
    });
});
server.listen(5000, () => {
    console.log('Serveur écoutant sur le port 5000');
});