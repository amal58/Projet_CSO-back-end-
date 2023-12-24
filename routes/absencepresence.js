const express = require('express');
const router = express.Router();
const presenceController = require('../controllers/absencepresence');


router.post('/', presenceController.createPresence );

module.exports = router;