const express = require('express');
const router = express.Router();
const repetitionController = require('../controllers/repetition');
const auth = require("../middlewares/UserAuth")

router.post('/', repetitionController.createRepetition );
router.get("/concert/:id", repetitionController.getRepetitionbyconcert );
router.patch("/mod/:id",auth.loggedMiddleware,auth.ischefpupitre, repetitionController.UpdateRepetition );


module.exports = router;