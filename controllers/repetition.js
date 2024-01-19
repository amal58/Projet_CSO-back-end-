const choriste = require('../models/choriste');
const Personne = require('../models/personne');
const Audition = require('../models/audition');
const { CandAud ,candAudSchemaValidation}= require('../models/candidatAudition');

const { Repetition,repetitionValidationSchema } = require('../models/repetition');
const socketIo = require('socket.io');

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
    const io = req.app.io; 
    const ioNotification = io.of('/notification');

    const val = req.body ;
    const champModifie = Object.keys(val)[0]; 

    const nouvelleValeur = val[champModifie];
    const rep = await Repetition.findOne({ _id: req.params.id});
 
    if(rep[champModifie] == nouvelleValeur){
      res.status(200).json({
        message: "Meme valeur a été saisi",
      });
    }
    else if(! rep[champModifie] ){
      res.status(200).json({
        message: "champs inexistant",
      });
    }
    else{
    const premierChoriste = rep.choriste.length > 0 ? rep.choriste[0] : null;
    const schChoriste = await choriste.findOne({ _id: premierChoriste });
    const schPerso =await Personne.findOne({ _id: schChoriste.candidatId });
    const aud =await Audition.findOne({ candidat: schPerso._id });
    const can = await CandAud.findOne({ audition: aud._id });
    const pupitre = can.tessiture ;

    const repetition = await Repetition.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    if (!repetition) {
      console.log("Répétition non trouvée");
      return res.status(404).json({
        message: "Répétition non trouvée",
      });
    }

    ioNotification.emit('notification', {
      message: `Répétition de pupitre ${pupitre} mise à jour : ${champModifie} a été changée  ${nouvelleValeur}`
    });

    console.log("Répétition mise à jour avec succès");
    res.status(200).json({
      model: repetition,
      message: "Répétition mise à jour avec succès",
    });
  }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la répétition:', error);
    res.status(400).json({
      error: error.message,
      message: "Erreur lors de la mise à jour de la répétition",
    });
  }
};
