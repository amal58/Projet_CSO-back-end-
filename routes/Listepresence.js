const express=require("express")
const router =express.Router()
const presenceController = require('../controllers/Listepresence');
const auth = require("../middlewares/UserAuth")


/**
 * @swagger
 * tags:
 *   - name: Liste_présents_par_programme_et_par_pupitre
 *     description: Opérations liées aux auditions
 */

router.get('/getAuditions', presenceController.getAudit );

/**
 * @swagger
 * /listePresents/listeP_repetition/{pupitre}/{rep}:
 *   get:
 *     summary: Liste des choriste présents dans une repetition selon le nom de pupitre
 *     tags: [Liste_présents_par_programme_et_par_pupitre]
 *     description: Lister les présents selon le nom du pupitre dans une repetition .
 *     parameters:
 *       - name: pupitre
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: rep
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Opération réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas'
 *       404:
 *         description: Œuvre non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/listeP_repetition/:pupitre/:programmeId',auth.loggedMiddleware,auth.ischefpupitre, presenceController.getListePresentsByRepetition );

/**
 * @swagger
 * /listePresents/listeP_programme/{pupitre}/{programmeId}:
 *   get:
 *     summary: Liste des choriste présents dans une repetition selon le nom de pupitre et le programme  
 *     tags: [Liste_présents_par_programme_et_par_pupitre]
 *     description: Liste des choriste présents dans une repetition selon le nom de pupitre et le programme
 *     parameters:
 *       - name: pupitre
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: programmeId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Opération réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas'
 *       404:
 *         description: Œuvre non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/listeP_programme/:pupitre/:programmeId',auth.loggedMiddleware,auth.ischefpupitre, presenceController.getListePresentsByProgramme );




module.exports=router