const express=require("express")
const router =express.Router()
const auth = require("../middlewares/UserAuth")
const OeuvreController=require("../controllers/oeuvre")

router.get("/AfficherTout",auth.loggedMiddleware,auth.isAdmin,OeuvreController.AfficherToutOeuvre)   
router.get("/AfficherUne/:id",auth.loggedMiddleware,auth.isAdmin,OeuvreController.AfficheUneOeuvre)
router.post("/ajouter",auth.loggedMiddleware,auth.isAdmin,OeuvreController.AjoutOeuvre)        
router.patch("/modifier/:id",auth.loggedMiddleware,auth.isAdmin,OeuvreController.MiseAjourOeuvre)
router.delete("/Supprimer/:id",auth.loggedMiddleware,auth.isAdmin,OeuvreController.SuppOeuvre)



module.exports=router



