const express = require('express');
const router = express.Router();
const participantsController = require('../controllers/participantsController');
const auth = require("../middlewares/UserAuth")

router.get('/:tessit/:idC',auth.loggedMiddleware,auth.isAdmin, participantsController.getAll); 
router.get('/:concertId',auth.loggedMiddleware,auth.isAdmin, participantsController.getParticipantsByConcertId);
router.get('/participants/:idC/:pourcentage',auth.loggedMiddleware,auth.isAdmin, participantsController.getListeParticipants);
router.get('/participants/absence/:idC/:pourcentage',auth.loggedMiddleware,auth.isAdmin, participantsController.getListeParticipantsParAbsence);


module.exports = router;
