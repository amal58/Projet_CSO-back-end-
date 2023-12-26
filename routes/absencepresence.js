const express = require('express');
const router = express.Router();
const presenceController = require('../controllers/absencepresence');


router.post('/', presenceController.createPresence );
router.post('/:pupitre/:rep', presenceController.createPresence );
router.post('/ListePrgrm/:pupitre/:programmeId', presenceController.createPresence );

module.exports = router;