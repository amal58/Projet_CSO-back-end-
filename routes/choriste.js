// Dans votre fichier de routes (par exemple, routes/audition.js)
const express = require('express');
const router = express.Router();
const ChoristeController = require('../controllers/choriste');

router.post("/login",ChoristeController.login)
module.exports = router;