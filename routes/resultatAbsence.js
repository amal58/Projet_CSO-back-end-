const express = require('express');
const router = express.Router();
const absenceController = require('../controllers/resultatAbsence');

router.get('/nominer', absenceController.getChoristesNominer);
router.get('/eliminer', absenceController.getChoristesEliminer);
router.patch('/seuil',absenceController.mettreAJourSeuil)
router.get('/:id', absenceController.getAbsencesForChoriste);
router.post('/demandeAbsence', absenceController.demanderAbsence);


module.exports = router;
