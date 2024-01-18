const express = require('express');
const router = express.Router();
const absenceController = require('../controllers/resultatAbsence');
const jwtcontro = require('../middlewares/userAuth');


router.get('/nominer', absenceController.getChoristesNominer);
router.get('/eliminer', absenceController.getChoristesEliminer);
router.patch('/seuil',absenceController.mettreAJourSeuil)
router.patch('/:id',absenceController.eliminerChoriste)
router.get('/liste',jwtcontro.loggedMiddleware,jwtcontro.isChoriste, absenceController.getAbsencesForChoriste);
router.post('/demandeAbsence',jwtcontro.loggedMiddleware,jwtcontro.isChoriste,absenceController.demanderAbsence);


module.exports = router;
