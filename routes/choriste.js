const express = require('express');
const ChoristeController = require('../controllers/choriste');
const router = express.Router();
// const {loggedMiddleware}=require("../middlewares/Userauth");



// router.get("/",loggedMiddleware,ChoristeController.GetAllChoristes) ;   
router.post("/login",ChoristeController.login);
module.exports = router;