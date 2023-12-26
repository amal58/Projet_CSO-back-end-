const mongoose = require('mongoose');
const { AbsencePresence } = require("../models/absencepresence");
const { Choriste } = require('../models/choriste'); // Assurez-vous que le chemin est correct
const { CandAud } = require('../models/candidatAudition'); 
const { Audition } = require('../models/audition'); 
const { Personne } = require('../models/personne'); 
const { Repetition } = require('../models/repetition'); 
const { Oeuvre } = require('../models/oeuvre'); 

exports.createPresence = async (req, res) => {
  try {

    const presence = new AbsencePresence(req.body);
    const savedAbsence = await presence.save();
    res.status(201).json({
      model: savedAbsence,
      message: 'Presence créée avec succès',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getListePresentsByRepetition = async (req, res) => {
  try {
    const repParam = req.params.rep;
    const tess = req.params.pupitre;

    const absences = await AbsencePresence.find({
      'repetition': repParam,
      'etat': true,
    }).populate({
      path: 'choriste',
      populate: {
        path: 'candidatId',
        model: 'CandAud',
        populate: {
          path: 'audition',
          model: 'Audition',
          populate: {
            path: 'candidat',
            model: 'Personne',
          },
        },
      },
    }).exec();

    // Filtrer les absences pour n'inclure que celles avec la tessiture spécifiée
    const presentsFinaux = absences
      .filter(absence => absence.choriste.candidatId.tessiture === tess)
      .map(absence => ({
        nom: absence.choriste.candidatId.audition.candidat.nom,
        prenom: absence.choriste.candidatId.audition.candidat.prenom,
      }));

    // Envoyer la réponse avec la liste des noms et prénoms des choristes présents
    res.json({ Liste_des_Présents: presentsFinaux });

  } catch (error) {
    console.error(error);
    // Handle the error and send an appropriate response
    res.status(500).send('Erreur serveur');
  }
};

exports.getListePresentsByProgramme = async (req, res) => {
  try {
    const programmeIds = req.params.programmeId.split(','); // Si vous avez plusieurs ID séparés par des virgules
    const tess = req.params.pupitre;

    // Trouver les absences liées au programme et filtrer par tessiture
    const absences = await AbsencePresence.find({
      'etat': true,
    }).populate({
      path: 'repetition',
      populate: {
        path: 'programme',
        model: 'Oeuvre', // Assurez-vous de bien utiliser le modèle approprié
      },
    }).populate({
      path: 'choriste',
      populate: {
        path: 'candidatId',
        model: 'CandAud', // Assurez-vous de bien utiliser le modèle approprié
        populate: {
          path: 'audition',
          model: 'Audition', // Assurez-vous de bien utiliser le modèle approprié
          populate: {
            path: 'candidat',
            model: 'Personne', // Assurez-vous de bien utiliser le modèle approprié
          },
        },
      },
    }).exec();

    const presentsFinaux = absences
    .filter(absence => {
      const isSameProgramme = 
      absence.repetition &&
      absence.repetition.programme &&
      absence.repetition.programme.length > 0 &&
      absence.repetition.programme.some(oeuvre => programmeIds.includes(oeuvre._id.toString()));
        const isSameTessiture = absence.choriste.candidatId.tessiture === tess;

        if (absence.repetition) {
            console.log('Programme de l\'absence :', absence.repetition.programme);
        } else {
            console.log('L\'absence n\'a pas de programme défini');
        }

        return isSameProgramme && isSameTessiture;
    })
    .map(absence => ({
        nom: absence.choriste.candidatId.audition.candidat.nom,
        prenom: absence.choriste.candidatId.audition.candidat.prenom,
        // Ajoutez d'autres propriétés selon vos besoins
    }));
console.log(presentsFinaux);

    // Envoyer la réponse avec la liste des noms et prénoms des choristes présents
    res.json({ Liste_des_Présents: presentsFinaux });

  } catch (error) {
    console.error(error);
    // Gérer l'erreur et renvoyer une réponse appropriée
    res.status(500).send('Erreur serveur');
  }
}