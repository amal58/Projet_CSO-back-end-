const express = require('express');
const router = express.Router();
const repetitionController = require('../controllers/repetition');

// ... (déclaration d'autres routes ou middleware)
router.post('/', repetitionController.createRepetition );
router.get("/concert/:id", repetitionController.getRepetitionbyconcert );
router.patch("/mod/:id", repetitionController.UpdateRepetition );


module.exports = router;