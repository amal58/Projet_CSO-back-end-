const express = require('express');
const router = express.Router();
const CandidatController = require('../controllers/candidat');




router.post("/ajouter",CandidatController.AjoutCandidat);
module.exports = router;