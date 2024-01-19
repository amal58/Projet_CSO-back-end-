// Dans votre fichier de routes (par exemple, routes/audition.js)
const express = require('express');
const router = express.Router();
const auditionController = require('../controllers/audition');

router.post('/auditions/auto', auditionController.generateAuditions);

router.post('/generateAdditionalAuditions', auditionController.generateAdditionalAuditions);


// Route pour visualiser toutes les auditions
router.get('/', auditionController.getAllAuditions);

// Route pour visualiser les auditions par candidat
router.get('/auditions/candidat/:candidatId', auditionController.getAuditionsForCandidate);

// Route pour visualiser les auditions par date
router.get('/date/:date', auditionController.getAuditionsByDate);

// Route pour visualiser les auditions par heure
router.get('/heure/:heure/date/:date', auditionController.getAuditionsByHeure);



module.exports = router;
