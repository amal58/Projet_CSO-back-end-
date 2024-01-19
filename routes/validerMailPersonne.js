const express = require('express');
const emailController = require('../controllers/validerMailPersonne');

const router = express.Router();
router.post('/envoyer-email', emailController.sendEmailController);
router.get('/valider-email/:token', emailController.validerEmail);


module.exports = router;

