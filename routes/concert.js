const express=require("express")

const router =express.Router()

const concertController=require("../controllers/concert")

  
  
router.post("/",concertController.addConcert)


module.exports=router