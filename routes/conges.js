const express = require('express');
const router = express.Router();
const congeController = require('../controllers/conges');

router.get('/valider', congeController.processDemandesConge);

module.exports = router;