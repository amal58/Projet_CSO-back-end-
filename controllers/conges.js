const Choriste = require('../models/choriste');
const {Conge} = require('../models/conges');

const processDemandesConge = async (req, res) => {
  try {

    const choristesEnCongeInactifs = [];
    // Récupérer les demandes de congé en attente
    const demandesCongeEnAttente = await Conge.find({ etat: 'en attente' });
    //null ou undefined
    if (!demandesCongeEnAttente || demandesCongeEnAttente.length === 0) {
      return res.status(404).json({ message: 'Pas de demandes de congé en attente.' });
    }

    for (const demandeConge of demandesCongeEnAttente) {

      demandeConge.etat = 'accepte';
      await demandeConge.save();

      const choriste = await Choriste.findById(demandeConge.choriste);
               
      // Mettre à jour le statut du choriste à 'inactif'
      choriste.statutAcutel = 'inactif';
      await choriste.save();
      choristesEnCongeInactifs.push(choriste);

    }

    return res.status(200).json({
      message: 'Traitement des demandes de congé réussi.',
      choristesEnCongeInactifs,
    });
  } catch (error) {
    console.error('Erreur lors du traitement des demandes de congé:', error);
    return res.status(500).json({ error: error.message, message: 'Erreur lors du traitement des demandes de congé.' });
  }
};

module.exports = {
  processDemandesConge,
};
