const express = require('express');
const router = express.Router();
const repetitionController = require('../controllers/repetition');

// Endpoint pour créer une nouvelle répétition
router.post('/create', repetitionController.createRepetition);

// Vous pouvez ajouter d'autres routes CRUD ici si nécessaire

module.exports = router;
