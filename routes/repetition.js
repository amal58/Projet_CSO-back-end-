const express = require('express');
const router = express.Router();
const repetitionController = require('../controllers/repetition');


router.post('/:id', repetitionController.createRepetition );
router.delete("/:id", repetitionController.deleteRepetition );


module.exports = router;