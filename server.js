const { app, server, io } = require("./app");
const cron = require('node-cron');

// Liste des candidats ajoutés depuis la dernière notification
let nouveauxCandidats = [];

const port = process.env.PORT || 5000;
app.set("port", port);

server.listen(port, () => {
  console.log("listening on " + port);
});

// Exécutez la tâche tous les jours à 13h15 (heure locale)
cron.schedule('59 13 * * *', () => {
  console.log('Envoi de notifications chaque jour à 13h15...');

  // Envoyer les nouveaux candidats depuis la dernière notification
  io.emit('scheduledNotification', { message: 'Nouveaux candidats ajoutés', candidats: nouveauxCandidats });

  // Réinitialiser la liste des nouveaux candidats
  nouveauxCandidats = [];
});

module.exports = { server, io, nouveauxCandidats };
