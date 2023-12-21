const express = require('express');
const router = express.Router();
const abprController  = require('../controllers/absencepresence');

// soumettre une demande d'absence
router.post('/demandeAbsence', abprController.demanderAbsence);

// obtenir toutes les demandes d'absence
router.get('/getAllDemandeAbsence', abprController.getAllDemandeAbsence);


module.exports = router;
