const express=require("express")
const router =express.Router()

const OeuvreController=require("../controllers/oeuvre")

router.get("/AfficherTout",OeuvreController.AfficherToutOeuvre)   
router.get("/AfficherUne/:id",OeuvreController.AfficheUneOeuvre)
router.post("/ajouter",OeuvreController.AjoutOeuvre)        
router.patch("/modifier/:id",OeuvreController.MiseAjourOeuvre)
router.delete("/Supprimer/:id",OeuvreController.SuppOeuvre)



module.exports=router



