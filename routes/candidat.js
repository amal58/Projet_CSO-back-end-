const express = require('express');
const personneController = require('../controllers/candidat');
const router = express.Router();


router.get('/', personneController.getAllCandidats);


router.get('/:sexe', personneController.getCandidatsBySexe);


router.get('/email/:email', personneController.getCandidatByEmail);

router.post('/ajout', personneController.AjoutCandidat);

module.exports = router;
