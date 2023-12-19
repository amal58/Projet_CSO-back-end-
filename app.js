const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const { initializeSocket } = require("./socket"); // Importez le fichier socket.js ici

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server); // Initialisez le serveur Socket.IO

// Configurer body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://127.0.0.1:27017/database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

// Ajoutez vos routes ici
const auditionRoutes = require("./routes/audition");
const personneRoutes = require("./routes/candidat");
app.use("/api/auditions", auditionRoutes);
app.use("/api/candidats", personneRoutes);

// Ajoutez une route pour servir le fichier HTML
app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// Gestion des fichiers statiques
app.use(express.static(path.join(__dirname, "public")));

module.exports = { app, server, io };
