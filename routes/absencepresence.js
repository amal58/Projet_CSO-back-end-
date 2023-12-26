const express = require('express');
const router = express.Router();
const presenceController = require('../controllers/absencepresence');


// router.post('/', presenceController.createPresence );
router.get('/ListeRep/:pupitre/:rep', presenceController.getListePresentsByRepetition );
// router.get('/ListePrgrm/:pupitre/:programmeId', presenceController.getListePresentsByProgramme );

module.exports = router;