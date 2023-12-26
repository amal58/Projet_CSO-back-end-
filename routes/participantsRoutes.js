const express = require('express');
const router = express.Router();
const participantsController = require('../controllers/participantsController');


router.get('/:tessit/:idC', participantsController.getAll); 
router.get('/:concertId', participantsController.getParticipantsByConcertId);
router.get('/participants/:idC/:pourcentage', participantsController.getListeParticipants);
router.get('/participants/absence/:idC/:pourcentage', participantsController.getListeParticipantsParAbsence);
//router.get('/pupitre/:pupit/:idC/:pourcentage', participantsController.getListeParticipantsByPupitre);

module.exports = router;
