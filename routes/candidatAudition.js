const express=require("express")

const router =express.Router()

const candAController=require("../controllers/candidatAudition")

router.get("/",candAController.fetchCandAs)
  
  router.get("/:id",candAController.getCandAById)
  
  
  router.post("/",candAController.addCandA)
   

 router.patch("/:id",candAController.UpdateCandA)


router.delete("/:id",candAController.DeleteCandA)

module.exports=router
