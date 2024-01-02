const express = require('express');
const router = express.Router();
const repetitionController = require('../controllers/repetition');


router.post('/:id', repetitionController.createRepetition );


//router.get("/concert/:id", repetitionController.getRepetitionbyconcert );


module.exports = router;