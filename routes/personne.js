const express = require('express');
const personneController = require('../controllers/personne');
const router = express.Router();


router.get('/', personneController.getAllCandidats);


router.get('/:sexe', personneController.getCandidatsBySexe);


router.get('/email/:email', personneController.getCandidatByEmail);



module.exports = router;
