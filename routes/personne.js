const express = require('express');
const router = express.Router();
const CandidatController = require('../controllers/personne');




router.post("/ajouter",CandidatController.AjoutCandidat);
module.exports = router;