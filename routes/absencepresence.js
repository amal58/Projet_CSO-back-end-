const express=require("express")

const router =express.Router()

const absprController=require("../controllers/absencepresence")

  
  
router.post("/",absprController.AjoutDispon)


module.exports=router