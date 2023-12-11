const express = require('express');
const CandidatController = require('../controllers/candidat');

const router = express.Router();

router.get("/AfficherUn/:id",CandidatController.AfficheUnCandidat)
router.post("/ajouter",CandidatController.AjoutCandidat)        
router.patch("/modifier/:id",CandidatController.MiseAjourCandidat)
router.delete("/Supprimer/:id",CandidatController.SuppCandidat)




module.exports = router;