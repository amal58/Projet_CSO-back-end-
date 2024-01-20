const Choriste = require('../models/choriste');
const {Conge} = require('../models/conge');
const  Personne=require('../models/personne')

const processDemandesConge = async (req, res) => {
  try {

    const choristesEnCongeInactifs = [];
    const demandesCongeEnAttente = await Conge.find({ etat: 'en attente' });
    if (!demandesCongeEnAttente || demandesCongeEnAttente.length === 0) {
      return res.status(404).json({ message: 'Pas de demandes de congé en attente.' });
    }

    for (const demandeConge of demandesCongeEnAttente) {

      demandeConge.etat = 'accepte';
      await demandeConge.save();

      const choriste = await Choriste.findById(demandeConge.choriste);
               
      choriste.statutAcutel = 'inactif';
      await choriste.save();
      choristesEnCongeInactifs.push(choriste);

    }

    return res.status(201).json({
        message :'traitement des demandes de congé réussi',
        choristeEnConges: await Promise.all(choristesEnCongeInactifs.map(async choriste => {
          const candidat = await Personne.findOne({ _id: choriste.candidatId });
      
          return {
            nom: candidat ? `${candidat.nom} ${candidat.prenom}` : 'Nom inconnu', // ou une valeur par défaut appropriée
           cin:`${candidat.cin} `,
           telephone:`${candidat.telephone}`,
           email:`${candidat.email}`,
            role: choriste.role,
            statutAcutel: choriste.statutAcutel,
          };
        })),
      });
      

 }   catch (error) {
    console.error('Erreur lors du traitement des demandes de congé:', error);
    return res.status(500).json({ error: error.message, message: 'Erreur lors du traitement des demandes de congé.' });
  }
};

module.exports = {
  processDemandesConge,
};