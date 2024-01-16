const express = require('express');
const router = express.Router();
const auditionController = require('../controllers/audition');

router.post('/auditions/auto', auditionController.generateAuditions);
router.post('/EnvoyerPourFormulaire', auditionController.lancerAudition);
router.get('/validerEmailFormulaire/:token', auditionController.validerEmailFormulaire);
router.post('/enregistrer-candidature', auditionController.enregistrerPersonne);

module.exports = router;