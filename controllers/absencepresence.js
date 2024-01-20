const mongoose = require("mongoose");
const { AbsencePresence, absenceValidationSchema } = require('../models/absencepresence');

const AjoutDispon = (req, res, next) => {
    const { disponibilite,  choriste, concert } = req.body;
    const nouveauDispo = new AbsencePresence({
        disponibilite,
        choriste,
        concert,
    });
    nouveauDispo.save()
        .then(dispo => {
            res.status(201).json({
                Dispo: dispo ,
                message: "dispo créé avec succès !",
            });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
};

const demanderAbsence = async (req, res) => {
  try {
    const { error } = absenceValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ erreur: error.details[0].message });
    }
    const nouvelleDemande = new AbsencePresence({
      etat: req.body.etat,
      date: req.body.date,
      RaisonAbsence: req.body.RaisonAbsence,
      RaisonPresenceManuel: req.body.RaisonPresenceManuel,
      disponibilite: req.body.disponibilite,
      choriste: req.body.choriste,
      repetition: req.body.repetition,
      concert: req.body.concert,
    });

    const demandeEnregistree = await nouvelleDemande.save();
    res.status(200).json({ message: "Demande d'absence ajoutée avec succès", demande: demandeEnregistree });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur interne du serveur lors de l'ajout de la demande d'absence" });
  }
};



const getAllDemandeAbsence = async (req, res) => {
  try {
    const demandesAbsence = await AbsencePresence.find();

    return res.status(200).json(demandesAbsence);
  } catch (erreur) {
    console.error(erreur);
    return res.status(500).json({ erreur: 'Erreur interne du serveur' });
  }
};

module.exports = { demanderAbsence, getAllDemandeAbsence,AjoutDispon };

