const express = require('express');
const router = express.Router();
const congeController = require('../controllers/conge');
const jwtcontro = require('../middlewares/userAuth');

router.patch('/valider',jwtcontro.loggedMiddleware,jwtcontro.isAdmin, congeController.processDemandesConge);

module.exports = router;