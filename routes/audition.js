// Dans votre fichier de routes (par exemple, routes/audition.js)
const express = require('express');
const router = express.Router();
const auditionController = require('../controllers/audition');
router.post('/auditions/auto', auditionController.generateAuditions);
router.post('/EnvoyerPourFormulaire', auditionController.lancerAudition);
router.get('/validerEmailFormulaire/:token', auditionController.validerEmailFormulaire);

// Route pour enregistrer la candidature
router.post('/enregistrer-candidature/:token', auditionController.enregistrerPersonne);

module.exports = router;