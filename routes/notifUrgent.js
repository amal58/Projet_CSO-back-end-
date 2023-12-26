const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notifUrgent');

// Route pour gérer les changements d'horaire
router.post('/changement-horaire', notificationController.gererChangementHoraireLieu);

module.exports = router;