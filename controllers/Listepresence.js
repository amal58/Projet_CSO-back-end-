const mongoose = require('mongoose');
const Audition = require("../models/audition")
const { CandAud } = require("../models/candidatAudition")

const { AbsencePresence } = require("../models/absencepresence");

exports.getAudit = async (req, res) => {
  try {
    console.log('getAuditions');
    const Auditions = await Audition.find();
    if (Auditions.length === 0) {
      // Aucune oeuvre trouvée
      res.status(404).json({
        message: "Aucune audition trouvée dans la base de données",
      });
      return;
    }

    // oeuvres trouvées avec succès
    res.status(200).json({
      model: Auditions,
      message: "auditions récupérées avec succès",
    });
  } catch (error) {
    // Gestion des erreurs générales
    res.status(500).json({
      error: error.message,
      message: "Problème lors de la récupération des auditions",
    });
  }
};

exports.getListePresentsByRepetition = async (req, res) => {
    try {
      const repParam = req.params.rep;
      console.log("param"+repParam);
      const tess = req.params.pupitre;
  
      const absences = await AbsencePresence.find({
        'repetition': repParam,
        'etat': true,
      }).populate({
        path: 'choriste',
        populate: {
          path: 'candidatId',
          model: 'Personne',
        },
      }).exec();
      //console.log(absences)
      // Filtrer les absences pour n'inclure que celles avec la tessiture spécifiée
      const presentsFinaux = [];

      for (const absence of absences) {
        const valid1 = await Audition.findOne({ candidat: absence.choriste.candidatId._id });
        const valid2 = await CandAud.findOne({ audition: valid1._id });
        console.log("personne recupérée "+absence.choriste.candidatId)
        console.log("resultat valid 1 "+valid1)
        console.log("resultat valid 2 "+valid2)

        if (valid2.tessiture === tess) {
          presentsFinaux.push({
            nom: absence.choriste.candidatId.nom,
            prenom: absence.choriste.candidatId.prenom,
          });
        }
      }
            res.json({ Liste_des_Présents: presentsFinaux });
  
    } catch (error) {
      console.error(error);
      // Handle the error and send an appropriate response
      res.status(500).send('Erreur serveur');
    }
  };