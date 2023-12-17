const http =require("http")
const app =require("./app")
const port =process.env.PORT|| 5000
app.set("port",port)

const server =http.createServer(app)
// Ajouter Socket.io
const socketIo = require('socket.io');
const io = socketIo(server);
app.io = io;
server.listen(port,()=>{
    console.log("listening on "+ port)
})





