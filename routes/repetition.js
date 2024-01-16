const express = require('express');
const router = express.Router();
const repetitionController = require('../controllers/repetition');


router.post('/:id', repetitionController.createRepetition );
router.delete("/:id", repetitionController.deleteRepetition );
router.patch("/:id", repetitionController.updateRepetition );
router.get("/getid/:id", repetitionController.getRepetitionById );
router.get("/getall", repetitionController.getAllRepetitions );


module.exports = router;