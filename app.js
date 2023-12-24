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
    // insererExemples();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

// Ajoutez vos routes ici
const auditionRoutes = require("./routes/audition");
const personneRoutes = require("./routes/candidat");
const UserRoutes = require("./routes/compte.js");
const choriste = require("./models/choriste.js");
const concertRoutes = require('./routes/concert.js');
const repetitionRoutes = require('./routes/repetition.js');
const absenceRoutes = require('./routes/absence.js');
app.use("/api/absences", absenceRoutes);
app.use("/api/auditions", auditionRoutes);
app.use("/api/candidats", personneRoutes);
app.use("/api/auth/",UserRoutes);
app.use('/api/concerts', concertRoutes);
app.use('/api/repetitions', repetitionRoutes);


// Ajoutez une route pour servir le fichier HTML
app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// Gestion des fichiers statiques
app.use(express.static(path.join(__dirname, "public")));
// const exemples = [
//   {
//     candidatId: "65819baba2bfb602e732df7d",
//     nominé: false,
//     éliminé: false,
//     chefpupitre: false,
//     chefchoeur: false,
//     historiqueStatut: [
//         {
//             saison: "1",
//             statut: "choriste",
//         },
//     ],
//     password:"kjkgbhbjbglhhkhkug"
//     compteId: "65833f85acac178013d8fd12",
// }

// ];
// // Fonction pour insérer les exemples dans la base de données
// async function insererExemples() {
//   try {
//     await choriste.insertMany(exemples);
//     console.log('Exemples insérés avec succès dans la base de données.');
//   } catch (error) {
//     console.error('Erreur lors de l\'insertion des exemples :', error);
//   }
// }
module.exports = { app, server, io };
