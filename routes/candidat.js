const express = require('express');
const CandidatController = require('../controllers/candidat');
const router = express.Router();


router.get('/', CandidatController.getAllCandidats);


router.get('/:sexe', CandidatController.getCandidatsBySexe);



router.get('/id/:id', personneController.getCandidatByid);



router.post('/ajout', CandidatController.AjoutCandidat);


module.exports = router;
