// const Personne = require("../models/personne");

// let lastCronRun = null;

// const notifierAdmin = async (io) => {
//   try {
//     const newCandidats = await Personne.find({
//       role: "candidat",
//       createdAt: { $gte: lastCronRun },
//     });

//     if (newCandidats.length > 0) {
//       const candidatsNoms = newCandidats.map((candidat) => candidat.nom);
//       const message = `Nouvelles candidatures ajoutées : ${candidatsNoms.join(", ")}`;

//       // Émettez un événement "nouveauxCandidats" à tous les clients connectés
//       io.emit("nouveauxCandidats", { nouveauxCandidats: newCandidats });

//       console.log("Notification envoyée avec succès.");
//     } else {
//       console.log("Aucun nouveau candidat depuis la dernière notification");
//     }
// // 
//     lastCronRun = new Date();
//   } catch (error) {
//     console.error("Erreur lors de la notification de l'administrateur :", error.message);
//   }
// };

// module.exports = notifierAdmin;
