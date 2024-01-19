const express=require("express")
const router =express.Router()
const presenceController = require('../controllers/Listepresence');
const auth = require("../middlewares/UserAuth")

router.get('/getAuditions', presenceController.getAudit );
router.get('/listeP_repetition/:pupitre/:rep',auth.loggedMiddleware,auth.ischefpupitre, presenceController.getListePresentsByRepetition );
router.get('/listeP_programme/:pupitre/:programmeId',auth.loggedMiddleware,auth.ischefpupitre, presenceController.getListePresentsByProgramme );




module.exports=router