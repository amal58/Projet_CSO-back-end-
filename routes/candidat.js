const express = require('express');
const CandidatController = require('../controllers/candidat');
const router = express.Router();

router.post("/",CandidatController.AjoutCandidat)        





module.exports = router;