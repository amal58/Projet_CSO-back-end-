const express = require('express');
const personneController = require('../controllers/candidat');
const router = express.Router();


router.get('/', personneController.getAllCandidats);


router.get('/:sexe', personneController.getCandidatsBySexe);


router.get('/id/:id', personneController.getCandidatByid);



module.exports = router;
