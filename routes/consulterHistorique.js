const express = require('express');
const router = express.Router();
const historiqueController = require('../controllers/consulterHistorique');
const jwtcontro = require('../middlewares/userAuth');

router.get('/profil', jwtcontro.loggedMiddleware, jwtcontro.isChoriste, historiqueController.consulterProfil);
router.get('/profil/:id', jwtcontro.loggedMiddleware, jwtcontro.isAdmin, historiqueController.consulteProfilAdmin);

module.exports = router;
