const express = require('express');
const router = express.Router();

const choristeController = require("../controllers/choriste");


router.post("/",choristeController.login)

module.exports = router;