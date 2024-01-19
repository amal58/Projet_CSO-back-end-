const express = require('express');
const router = express.Router();
const absenceController = require('../controllers/resultatAbsence');
const jwtcontro = require('../middlewares/userAuth');


router.get('/nominer',jwtcontro.loggedMiddleware ,absenceController.getChoristesNominer);
router.get('/eliminer',jwtcontro.loggedMiddleware ,absenceController.getChoristesEliminer);
router.patch('/seuil',jwtcontro.loggedMiddleware,jwtcontro.isAdmin,absenceController.mettreAJourSeuil)
router.patch('/:id',jwtcontro.loggedMiddleware,jwtcontro.isAdmin,absenceController.eliminerChoriste)
router.get('/liste',jwtcontro.loggedMiddleware,jwtcontro.isChoriste, absenceController.getAbsencesForChoriste);
router.post('/demandeAbsence',jwtcontro.loggedMiddleware,jwtcontro.isChoriste,absenceController.demanderAbsence);


module.exports = router;
