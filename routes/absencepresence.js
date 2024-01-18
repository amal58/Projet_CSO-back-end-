const express=require("express")
const router =express.Router()
const absprController=require("../controllers/absencepresence")

  
router.post("/",absprController.AjoutDispon)
router.post('/demandeAbsence', absprController.demanderAbsence);
router.get('/getAllDemandeAbsence', absprController.getAllDemandeAbsence);


module.exports = router;
