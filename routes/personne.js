const express = require('express');
const CandidatController = require('../controllers/personne');

const router = express.Router();
router.get('/', CandidatController.getAllCandidats);
router.get('/:sexe', CandidatController.getCandidatsBySexe);
router.get('/email/:email', CandidatController.getCandidatByEmail);

router.get("/AfficherUn/:id",CandidatController.AfficheUnCandidat)
router.post("/ajouter",CandidatController.AjoutCandidat)        
router.patch("/modifier/:id",CandidatController.MiseAjourCandidat)
router.delete("/Supprimer/:id",CandidatController.SuppCandidat)




module.exports = router;