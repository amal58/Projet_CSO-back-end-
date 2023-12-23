// Dans votre fichier de routes (par exemple, routes/audition.js)
const express = require('express');
const router = express.Router();
const auditionController = require('../controllers/audition');

router.post('/auditions/auto', auditionController.generateAuditions);

module.exports = router;