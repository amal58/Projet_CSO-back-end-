// const http =require("http")
// const app =require("./app")

// const express = require('express');
// const socketIo = require('socket.io');

// const app = express();
// const serverr = http.createServer(app);
// const io = socketIo(serverr);

// // Configurez vos routes Express et MongoDB ici...

// // Écoutez les connexions WebSocket
// io.on('connection', (socket) => {
//   console.log('Nouvelle connexion WebSocket');
// });


// const port =process.env.PORT|| 5000
// app.set("port",port)

// const server =http.createServer(app)
// server.listen(port,()=>{
//     console.log("listening on "+ port)
// })


// const http =require("http")
// const app =require("./app")
// const port =process.env.PORT|| 5000
// app.set("port",port)

// const server =http.createServer(app)
// // Ajouter Socket.io
// const socketIo = require('socket.io');
// const io = socketIo(server);
// app.io = io;
// server.listen(port,()=>{
//     console.log("listening on "+ port)
// })






const app = require("./app");
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server);

// Ajoutez le middleware d'IO à votre application
app.io = io;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/test.html');
});

io.on('connection', (socket) => {
       const message = "Connexion notif";
   io.emit('notification', {message});

    console.log('Nouvelle connexion socket :', socket.id);

    socket.on('disconnect', () => {
        console.log('Déconnexion socket :', socket.id);
    });
});
server.listen(5000, () => {
    console.log('Serveur écoutant sur le port 5000');
});