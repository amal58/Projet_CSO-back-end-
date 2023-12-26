// appRoutes.js
const express = require('express');
const emailController = require('../controllers/validerMailPersonne');

const router = express.Router();


// Route pour envoyer l'email
router.post('/envoyer-email', emailController.sendEmailController);

// Route pour valider l'email
router.get('/valider-email/:token', emailController.validerEmail);


module.exports = router;

