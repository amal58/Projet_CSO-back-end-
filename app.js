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
const auditionC = require("./models/candidataudition.js");

const choriste = require("./models/choriste.js");
const choristeRoutes = require("./routes/choriste.js");
const concertRoutes = require('./routes/concert.js');
const repetitionRoutes = require('./routes/repetition.js');
const absenceRoutes = require('./routes/absence.js');
app.use("/api/absences", absenceRoutes);
app.use("/api/auditions", auditionRoutes);
app.use("/api/candidats", personneRoutes);

app.use('/api/concerts', concertRoutes);
app.use('/api/repetitions', repetitionRoutes);// Middleware de journalisation pour déboguer les demandes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/api/choristes', choristeRoutes);

// Ajoutez une route pour servir le fichier HTML
app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// Gestion des fichiers statiques
app.use(express.static(path.join(__dirname, "public")));
//   const exemples = [
  
//     {
//         candidatId: "65819ae617a62846b387f0a9",
//         role: "choriste",
//         login: "poutestsima@outlook.fr",
//         historiqueStatut: [
//           { saison: 2022, statut: "senior" },
//           { saison: 2023, statut: "senior" },
//         ],
//         password: "$2b$10$Xl2HC7GKAZPk0qkvZiDHaueUBa0zYDK88OUuAaLyGjNqDbD4vCwS.",
//         confirmationStatus: "En attente de confirmation",
//       },
//       {
//         candidatId: "658193982c8735d5ce803421",
//         role: "choriste",
//         login: "poutestsima@outlook.com",
//         historiqueStatut: [
//           { saison: 2022, statut: "senior" },
//           { saison: 2023, statut: "senior" },
//         ],
//         password: "$2b$10$Xl2HC7GKAZPk0qkvZiDHaueUBa0zYDK88OUuAaLyGjNqDbD4vCwS.",
//         confirmationStatus: "En attente de confirmation",
//       }
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
