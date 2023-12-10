const express = require('express');
const router = express.Router();
const repetitionController = require('../controllers/repetition');


router.post('/', repetitionController.createRepetition );

module.exports = router;