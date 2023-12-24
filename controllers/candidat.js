const Personne = require('../models/personne');
const mongoose = require('mongoose');

// Contrôleur pour récupérer la liste de tous les candidats avec pagination
exports.getAllCandidats = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const candidats = await Personne.paginate( {},options);
    res.json(candidats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getCandidatsBySexe = async (req, res) => {
    try {
      const { sexe } = req.params;
      const { page = 1, limit = 10 } = req.query;
  
      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      };
  
      const candidats = await Personne.paginate({ sexe: sexe }, options);
      res.json(candidats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  exports.getCandidatByid = async (req, res) => {
    try {
      const { id } = req.params;
      const candidat = await Personne.find({ _id:id });
      if (!candidat) {
        return res.status(404).json({ message: 'Candidat non trouvé' });
      }
      res.json(candidat);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
