const express = require('express');
const router = express.Router();
const saisonController = require('../controllers/saison');

router.post('/add', saisonController.AjoutSaison);
router.patch('/modif/:id', saisonController.MiseAjourSaison);
router.patch('/archiver/:id', saisonController.ArchiverSaison);

module.exports = router;