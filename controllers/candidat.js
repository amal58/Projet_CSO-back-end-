const { getIo } = require("../socket"); 
const Personne = require('../models/personne');
const mongoose = require('mongoose');
const net = require('net');
const cron = require('node-cron');

 // Importez l'instance io depuis app.js

// Contrôleur pour récupérer la liste de tous les candidats avec pagination
exports.getAllCandidats = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const candidats = await Personne.paginate({ role: 'candidat' }, options);
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
  
      const candidats = await Personne.paginate({ role: 'candidat', sexe }, options);
      res.json(candidats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  exports.getCandidatByEmail = async (req, res) => {
    try {
      const { email } = req.params;
      const candidat = await Personne.findOne({ role: 'candidat', email });
      if (!candidat) {
        return res.status(404).json({ message: 'Candidat non trouvé' });
      }
      res.json(candidat);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
// Utilisez getIo() au lieu de directement io
  const io = getIo();
 
  exports.AjoutCandidat = async (req, res) => {
    try {
      req.body.role = 'candidat';
      const newCandidat = new Personne(req.body);
      await newCandidat.save();
  
      // Émettez un événement pour notifier l'administrateur
      io.emit('newCandidateAdded', { model: newCandidat });
  
      res.status(201).json({
        model: newCandidat,
        message: 'Candidat créé !',
        
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        error: error.message,
        message: 'Problème lors de la création du Candidat',
      });
    }
  };
  // Planifiez l'envoi de notifications chaque jour à 10h00
cron.schedule('23 20 * * *', async () => {
  try {
    // Récupérez les nouveaux candidats ajoutés entre 10h d'hier et 10h d'aujourd'hui
    const dateDebut = new Date();
    dateDebut.setDate(dateDebut.getDate() - 1); // Hier
    dateDebut.setHours(10, 0, 0, 0); // 10h du matin

    const dateFin = new Date();
    dateFin.setHours(15, 0, 0, 0); // 10h du matin

    const nouveauxCandidats = await Personne.find({
      role: 'candidat',
      createdAt: {
        $gte: dateDebut,
        $lt: dateFin,
      },
    });

    // Émettez un événement pour notifier l'administrateur avec les nouveaux candidats
    io.emit('scheduledNotification', {
      message: 'Nouveaux candidats ajoutés entre 10h d\'hier et 10h d\'aujourd\'hui',
      candidats: nouveauxCandidats,
    });

    console.log('Envoi de notifications chaque jour à 10h00...');
  } catch (error) {
    console.error(error);
  }
});