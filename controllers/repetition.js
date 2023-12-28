const choriste = require('../models/choriste');
const Personne = require('../models/personne');
const Audition = require('../models/audition');
const { CandAud ,candAudSchemaValidation}= require('../models/candidatAudition');
// controller.js
const { Repetition,repetitionValidationSchema } = require('../models/repetition');
const socketIo = require('socket.io');
const schedule = require('node-schedule');


// // Fonction pour vérifier si une répétition est proche
// function isRepetitionProche(repetition) {
//   const maintenant = new Date();
//   const dateRepetition = new Date(repetition.date);
//   const heureDebutRepetition = new Date(`${repetition.date} ${repetition.heureDebut}`);
  
//   // Définir la plage de temps (par exemple, 15 minutes avant la répétition)
//   const plageDeTemps = 15 * 60 * 1000; // 15 minutes en millisecondes

//   // Vérifier si la date ou l'heure est proche de maintenant
//   const dateProche = Math.abs(maintenant - dateRepetition) <= plageDeTemps;
//   const heureProche = Math.abs(maintenant - heureDebutRepetition) <= plageDeTemps;

//   return dateProche || heureProche;
// }

// // Fonction pour planifier des notifications pour les répétitions proches
// function planifierNotificationsPourRepetitionsProches(repetitions) {
//   repetitions.forEach(repetition => {
//       if (isRepetitionProche(repetition)) {
//           // Planifier une notification pour la date de la répétition
//           const dateRepetition = new Date(repetition.date);
//           schedule.scheduleJob(dateRepetition, () => {
//               req.app.io.emit('notification', {
//                   message: `Répétition proche : ${repetition.programme} le ${new Date(repetition.date).toLocaleDateString()} à ${repetition.heureDebut}`
//               });
//           });
//       }
//   });
// }

//creation repetition
exports.createRepetition = async (req, res) => {
  try {
  
    const { error, value } = repetitionValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const repetition = new Repetition(value);
    const savedRepetition = await repetition.save();
    res.status(201).json({
      model: savedRepetition,
      message: 'repetition créé avec succès',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Nouvelle route pour obtenir tous les repetition d'un concert
exports.getRepetitionbyconcert=(req, res) => {
  const concertId = req.params.id;

  Repetition.findByConcert(concertId)
    .populate('concert')
    .then((repetitions) => {
      res.status(200).json({
        model: repetitions,
        message: 'repetitions d concert récupérés avec succès',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message,
        message: 'Problème lors de la récupération des repetitions d un cocnert',
      });
    });
};

exports.UpdateRepetition = async (req, res) => {
  try {
    const io = req.app.io; // Récupérez io à partir de req.app
    const val = req.body ;
    // Récupérer le nom du champ modifié
    const champModifie = Object.keys(val)[0]; // Supposant qu'il y ait un seul champ modifié

    // Récupérer la nouvelle valeur
    const nouvelleValeur = val[champModifie];
    //--------------------- chercher le nom de pupitre --------------------------------------------------
    const rep = await Repetition.findOne({ _id: req.params.id});
    const premierChoriste = rep.choriste.length > 0 ? rep.choriste[0] : null;
    const schChoriste = await choriste.findOne({ _id: premierChoriste });
    const schPerso =await Personne.findOne({ _id: schChoriste.candidatId });
    const aud =await Audition.findOne({ candidat: schPerso._id });
    const can = await CandAud.findOne({ audition: aud._id });
    const pupitre = can.tessiture ;
    //console.log(can)

    // Émettre une notification aux clients connectés
    io.emit('notification', {
      message: `Répétition de pupitre ${pupitre} mise à jour : ${champModifie} a été changée  ${nouvelleValeur}`
    });


    console.log("Répétition mise à jour avec succès");
    res.status(200).json({
      model: rep,
      message: "Répétition mise à jour avec succès",
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la répétition:', error);
    res.status(400).json({
      error: error.message,
      message: "Erreur lors de la mise à jour de la répétition",
    });
  }
};

