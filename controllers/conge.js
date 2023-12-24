// const { Conge, congeValidationSchema} = require('../models/conge');
// const notificationService = require('../services/notificationService'); 

// // Fonction pour créer un congé et envoyer une notification en temps réel
// exports.createCongeAndSendNotification = async (req, res) => {
//   try {
//     const { error, value } = congeValidationSchema.validate(req.body);

//     if (error) {
//       return res.status(400).json({ error: error.details[0].message });
//     }

//     const conge = new Conge({ ...value, processed: false }); 
//     const savedConge = await conge.save();

//     // Envoyer une notification en temps réel
//     notificationService.sendNotification(savedConge);

//     res.status(201).json({
//       model: savedConge,
//       message: 'Demande de congé créée avec succès et notification envoyée.',
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Fonction pour récupérer toutes les notifications de congé
// exports.getAllCongeNotifications = async (req, res) => {
//   try {
//     const allCongeNotifications = await Conge.find().populate('candidat', 'nom prenom' );
//     const notifications = allCongeNotifications.map((conge) => ({
//       type: 'Demande de congé',
//       message: `Demande de congé de ${conge.candidat.nom} ${conge.candidat.prenom}`,
//       dateDebut: conge.datedebut,
//       duree: conge.duree,
//       etat: conge.etat,
//     }));

//     res.status(200).json(notifications);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };



// // Fonction pour traiter ultérieurement les notifications
// exports.processCongeNotifications = async () => {
//   try {
//     //  récupérer les nouveaux congés non traités et envoyer des notifications ultérieurement
//     const newConges = await Conge.find({ processed: false });
//     newConges.forEach(async (conge) => {
//       // Mettre à jour processed à true après le traitement
//       conge.processed = true;
//       await conge.save();

//       // Envoyer la notification
//       notificationService.sendNotification(conge);
//     });

//     console.log('Traitement ultérieur des notifications de congé terminé.');
//   } catch (error) {
//     console.error('Erreur lors du traitement ultérieur des notifications de congé:', error);
//   }
// };