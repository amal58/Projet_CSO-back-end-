const express = require('express');
const router = express.Router();
const abprController  = require('../controllers/absencepresence');


router.post('/demandeAbsence', abprController.demanderAbsence);
router.get('/getAllDemandeAbsence', abprController.getAllDemandeAbsence);


module.exports = router;
