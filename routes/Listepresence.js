const express=require("express")
const router =express.Router()
const presenceController = require('../controllers/Listepresence');


router.get('/getAuditions', presenceController.getAudit );
router.get('/listeP_repetition/:pupitre/:rep', presenceController.getListePresentsByRepetition );
router.get('/listeP_programme/:pupitre/:programmeId', presenceController.getListePresentsByProgramme );




module.exports=router