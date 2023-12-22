const express = require('express');
const router = express.Router();
const absenceController = require('../controllers/absence');

// Route pour créer une absence
router.post('/add/:id_repetition/:urlQR', absenceController.createAbsence);
// router.post('/:id_repetition', absenceController.createAbsenceConcert);
router.post('/confirm/:concertId', absenceController.confirmAbsence);
router.get('/confirmation-absence/:compteId/:concertId', absenceController.confirmDispo);
router.patch('/modifyChoristeState/:concertId/:urlQR', absenceController.modifyChoristeState);
router.get('/ChoristesDispo/:concertId', absenceController.getChoristesDispo);

module.exports = router;
