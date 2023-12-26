const express = require('express');
const router = express.Router();
const congeController = require('../controllers/conge');


router.post("/ajouteconger/:id", congeController.AjouterConge );


module.exports = router;