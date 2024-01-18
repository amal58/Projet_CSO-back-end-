const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const { initializeSocket } = require("./socket");
// const {initializeTessitureSocket, getIoTessiture  } = require("./socketTessiture.js");

// const {initializeSopranoSocket, getIoSoprano } = require("./socketSoprano");
// const { initializeAltoSocket, getIoAlto } = require("./socketAlto");
// const { initializeTenorSocket, getIoTenor } = require("./socketTenor");
// const { initializeBaseSocket, getIoBase } = require("./socketBase.js");




const app = express();
const server = http.createServer(app);
const io = initializeSocket(server); // Initialisez le serveur Socket.IO
// const ioSoprano = initializeSopranoSocket(server);
// const ioAlto = initializeAltoSocket(server);
// const ioTenor = initializeTenorSocket(server);
// const ioBase = initializeBaseSocket(server);
// const ioTessiture = initializeTessitureSocket(server);
// Configurer body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://127.0.0.1:27017/database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Supprimez l'option useFindAndModify
    // useFindAndModify: false,
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
const oeuvreRoutes = require('./routes/oeuvre.js');
const historiqueRoutes=require("./routes/consulterHistorique");


app.use("/api/absences", absenceRoutes);
app.use("/api/auditions", auditionRoutes);
app.use("/api/candidats", personneRoutes);
app.use("/api/oeuvres", oeuvreRoutes);
app.use('/api/concerts', concertRoutes);
app.use('/api/repetitions', repetitionRoutes);
app.use("/api/historique", historiqueRoutes)

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/api/choristes', choristeRoutes);
app.use((req, res, next) => {
  console.log(`Requested: ${req.method} ${req.url}`);
  next();
});
// Ajoutez une route pour servir le fichier HTML
app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});
// app.get("/alto.html", (req, res) => {
//   res.sendFile(path.join(__dirname, "alto.html"));
// });
// app.get("/base.html", (req, res) => {
//   res.sendFile(path.join(__dirname, "base.html"));
// });
// app.get("/soprano.html", (req, res) => {
//   res.sendFile(path.join(__dirname, "soprano.html"));
// });
// app.get("/tenor.html", (req, res) => {
//   res.sendFile(path.join(__dirname, "tenor.html"));
// });
// app.get("/tessiture.html", (req, res) => {
//   res.sendFile(path.join(__dirname, "tessiture.html"));
// });
// app.use(express.static(path.join(__dirname, 'public')));
// getIoTessiture().on('connection', (socket) => {
//   const tessiture = socket.handshake.query.tessiture;
//   if (tessiture) {
//     socket.join(tessiture);
//   }
// });
// Gestion des fichiers statiques
// app.use(express.static(path.join(__dirname, 'public')));


// // Ajoutez ces lignes après la définition des routes
// app.use((req, res, next) => {
//   if (!res.headersSent) {
//     console.log(`No route handled the request: ${req.method} ${req.url}`);
//     res.status(404).send('Not Found');
//   }
// });

// Utilisez getIoSoprano pour gérer les connexions Soprano
// getIoSoprano().on('connection', (socket) => {
//   console.log('Soprano socket connected:', socket.id);
//   socket.emit('welcome', 'Welcome to the Soprano section!');
// });

// Utilisez getIoAlto pour gérer les connexions Alto
// getIoAlto().on('connection', (socket) => {
//   console.log('Alto socket connected:', socket.id);
//   socket.emit('welcome', 'Welcome to the Alto section!');
// });

// // Utilisez getIoTenor pour gérer les connexions Tenor
// getIoTenor().on('connection', (socket) => {
//   console.log('Tenor socket connected:', socket.id);
//   socket.emit('welcome', 'Welcome to the Tenor section!');
// });

// // Utilisez getIoBase pour gérer les connexions Base
// getIoBase().on('connection', (socket) => {
//   console.log('Base socket connected:', socket.id);
//   socket.emit('welcome', 'Welcome to the Base section!');
// });

// Gestion des fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));
// Ajoutez ces lignes après la définition des routes
app.use((req, res, next) => {
  if (!res.headersSent) {
    console.log(`No route handled the request: ${req.method} ${req.url}`);
    res.status(404).send('Not Found');
  }
});
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
module.exports = { app, server, io  };
