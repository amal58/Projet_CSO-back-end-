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


router.get('/absences-concerts-repetitions/:choristeId', absenceController.getAbsencesAndConcertsAndRepetitions);
router.get('/statistique-concert/:concertId', absenceController.statistiqueConcert);
router.get('/statistique-repetition/:repetitionId', absenceController.statistiqueRepetition);
router.get("/statistique-oeuvre/:oeuvreId", absenceController.statistiqueOeuvre);
router.get('/absences-repetition', absenceController.AbsenceRepetition);
router.get('/absences-repetition-choriste/:choristeId', absenceController.AbsenceRepetitionChoriste);
router.get('/absences-choristes/:tessiture', absenceController.absencesChoristesParTessiture);
router.get("/absencesRepetitionDate/:date", absenceController.absencesRepetitionDate);


router.get('/profil', absenceController.statspresenceChoriste);

module.exports = router;
