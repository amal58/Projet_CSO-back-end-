const express=require("express")
const router =express.Router()
const candAController=require("../controllers/candidatAudition")

router.get("/",candAController.fetchCandAs)
//  router.get("/:id",candAController.getCandAById)
router.post("/",candAController.addCandA)

//  router.patch("/:id",candAController.UpdateCandA)
// router.delete("/:id",candAController.DeleteCandA)

router.get("/AUD",candAController.getCandidaR)
router.post("/confirmation/:token", candAController.confirmation)



module.exports=router