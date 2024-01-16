const express = require('express');
const router = express.Router();
const absenceController = require('../controllers/absence');

// Route pour créer une absence
router.post('/add/:id_repetition/:urlQR', absenceController.createAbsence);
// router.post('/:id_repetition', absenceController.createAbsenceConcert);
router.post('/confirm/:concertId', absenceController.confirmAbsence);
router.get('/confirmation-absence/:compteId/:concertId', absenceController.confirmDispo);
router.patch('/modifychoristestate/:concertId/:urlQR', absenceController.modifyChoristeState);
router.get('/choristesdispo/:concertId', absenceController.getChoristesDispo);
router.get('/listerAbsencesParTessitureEtConcert/:tessiture/:concert', absenceController.listerAbsencesParTessitureEtConcert);
router.get('/profil/:oeuvreId', absenceController.statspresenceChoriste);
router.get('/absences-concerts-repetitions/:choristeId', absenceController.getAbsencesAndConcertsAndRepetitions);
router.get('/statistique-concert/:concertId', absenceController.statistiqueConcert);
router.get('/statistique-repetition/:repetitionId', absenceController.statistiqueRepetition);
module.exports = router;
