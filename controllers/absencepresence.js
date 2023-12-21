const { AbsencePresence, absenceValidationSchema } = require('../models/absencepresence');

// Fonction pour gérer la demande d'absence pour une répétition ou un concert
const demanderAbsence = async (req, res) => {
  try {
    const { error, value } = absenceValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ erreur: error.details[0].message });
    }

    // Extraire les informations pertinentes de la requête
    const { date, RaisonAbsence, choriste, repetition, concert } = value;

    // Créer un nouveau document d'absence
    const nouvelleAbsence = new AbsencePresence({
      etat: repetition ? false : undefined,
      CurrentDate: date,
      RaisonAbsence,
      choriste,
      repetition,
      concert,
    });

    // Enregistrer le document d'absence dans la base de données
    await nouvelleAbsence.save();

    // Répondre avec un message de succès
    return res.status(201).json({ message: 'Demande d absence soumise avec succès.' });
  } catch (erreur) {
    console.error(erreur);
    return res.status(500).json({ erreur: 'Erreur interne du serveur' });
  }
};



// Fonction pour obtenir toutes les demandes d'absence
const getAllDemandeAbsence = async (req, res) => {
  try {
    // Récupérer toutes les demandes d'absence de la base de données
    const demandesAbsence = await AbsencePresence.find();

    // Répondre avec la liste des demandes d'absence
    return res.status(200).json(demandesAbsence);
  } catch (erreur) {
    console.error(erreur);
    return res.status(500).json({ erreur: 'Erreur interne du serveur' });
  }
};

module.exports = { demanderAbsence, getAllDemandeAbsence };

