const express = require('express');
const router = express.Router();
const historiqueController = require('../controllers/consulterHistorique');
const jwtcontro = require('../middlewares/userAuth');

router.get('/profil/:choristeId',   historiqueController.consulterProfil);
router.get('/profil/:id', jwtcontro.loggedMiddleware, historiqueController.consulteProfilAdmin);

module.exports = router;