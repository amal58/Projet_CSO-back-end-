// const sendNotification = (conge) => {
//     const io = require('../app').io; // Spécifiez le chemin correct vers votre application
  
//     io.emit('notification', {
//       message: `Demande de congé de ${conge.candidat.nom} ${conge.candidat.prenom}`,
//       dateDebut: conge.datedebut,
//       etat: conge.etat,
//     });
//   };
  
//   module.exports = {
//     sendNotification,
//   };