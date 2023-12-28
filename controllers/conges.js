const Choriste = require('../models/choriste');
const {Conge} = require('../models/conges');

const processDemandesConge = async (req, res) => {
  try {
    // Récupérer les demandes de congé en attente
    const demandesCongeEnAttente = await Conge.find({ etat: 'en attente' });
    //null ou undefined
    if (!demandesCongeEnAttente || demandesCongeEnAttente.length === 0) {
      return res.status(404).json({ message: 'Pas de demandes de congé en attente.' });
    }

    // Parcourir chaque demande de congé en attente
    for (const demandeConge of demandesCongeEnAttente) {
      // Mettre à jour l'état de la demande de congé à 'accepte'
      demandeConge.etat = 'accepte';

      // Sauvegarder les changements dans la demande de congé
      await demandeConge.save();

      // Sauvegarder le statut actuel du choriste
      const choriste = await Choriste.findById(demandeConge.choriste);
     
      // Récupérer à nouveau le choriste pour éviter tout problème de référence
      const updatedChoriste = await Choriste.findById(demandeConge.choriste);
          
      // Mettre à jour le statut du choriste à 'inactif'
      updatedChoriste.statutAcutel = 'inactif';
      await updatedChoriste.save();
      console.log('Changement de statut à "inactif" au moment de la datedebut pour le choriste', demandeConge.choriste);
    }

    return res.status(200).json({ message: 'Traitement des demandes de congé réussi.' });
  } catch (error) {
    console.error('Erreur lors du traitement des demandes de congé:', error);
    return res.status(500).json({ error: error.message, message: 'Erreur lors du traitement des demandes de congé.' });
  }
};

module.exports = {
  processDemandesConge,
};
