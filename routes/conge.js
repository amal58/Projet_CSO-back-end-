const express = require('express');
const router = express.Router();
const congeController = require('../controllers/conge');


router.post('/', congeController.createCongeAndSendNotification );



router.get('/conges/notifications', congeController.getAllCongeNotifications);

module.exports = router;