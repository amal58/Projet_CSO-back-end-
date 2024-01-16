const express = require('express');
const ChoristeController = require('../controllers/choriste');
const router = express.Router();
const jwtcontro=require("../middlewares/UserAuth")



router.get("/",jwtcontro.loggedMiddleware,jwtcontro.isChoriste,ChoristeController.GetAllChoristes)    
router.post("/login",ChoristeController.login)
router.patch("/modifTessiture/:id",ChoristeController.modifier_tessiture)

module.exports = router;