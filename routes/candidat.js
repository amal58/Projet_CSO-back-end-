const express = require('express');
const router = express.Router();
const CandidatController = require('../controllers/candidat');




router.get('/', CandidatController.getAllCandidats);


router.get('/:sexe', CandidatController.getCandidatsBySexe);


router.get('/id/:id', CandidatController.getCandidatByid);

router.post('/ajout', CandidatController.AjoutCandidat);

module.exports = router;
