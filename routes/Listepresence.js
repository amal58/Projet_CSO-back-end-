const express=require("express")
const router =express.Router()
const presenceController = require('../controllers/Listepresence');


router.get('/getAuditions', presenceController.getAudit );
router.get('/listeP_repetition/:pupitre/:rep', presenceController.getListePresentsByRepetition );




module.exports=router



