const express = require('express');
const ChoristeController = require('../controllers/choriste');
const router = express.Router();



router.get("/",ChoristeController.GetAllChoristes)    
router.post("/login",ChoristeController.login)

module.exports = router;