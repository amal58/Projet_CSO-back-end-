const app = require("./app");
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server);

app.io = io;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/notifUrgente.html');
});

io.on('connection', (socket) => {
    console.log('Nouvelle connexion socket :', socket.id);

    socket.on('disconnect', () => {
        console.log('Déconnexion socket :', socket.id);
    });
});
server.listen(5000, () => {
    console.log('Serveur écoutant sur le port 5000');
});