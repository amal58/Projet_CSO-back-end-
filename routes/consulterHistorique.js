const express = require('express');
const router = express.Router();
const historiqueController = require('../controllers/consulterHistorique');

// Route pour consulter l'historique du statut d'un choriste
router.get('/profil/:id', historiqueController.consulterProfil);
module.exports = router;
