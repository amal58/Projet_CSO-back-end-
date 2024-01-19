const express = require('express');
const router = express.Router();
const concertController = require('../controllers/concert');

// Endpoint pour créer un nouveau concert
router.post('/create', concertController.createConcert);

module.exports = router;
