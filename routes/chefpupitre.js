const express = require('express');
const router = express.Router();
const chefpupitreController = require('../controllers/chefpupitre');

router.patch('/:id', chefpupitreController.designatePupitreChefs);

module.exports = router;