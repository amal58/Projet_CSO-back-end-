const express=require("express")

const router =express.Router()

const concertController=require("../controllers/concert")

  
  
router.post("/",concertController.addConcert)
router.get("/ajoutplacement/:id",concertController.ajoutplacement)


module.exports=router