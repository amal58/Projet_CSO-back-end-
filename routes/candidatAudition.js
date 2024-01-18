const express=require("express")

const router =express.Router()

const candAController=require("../controllers/candidatAudition")

/**
 * @swagger
 * tags:
 *   name: candidatAudition
 *   description: APII de gestion des candidatAuditions
 */
///////////////////////////////////comme si en va déclarer tout les component utilisé 
/**
 * @swagger
 * tags:
 *   name: candidatAudition
 *   description: API de gestion des candidatAuditions
 */

///////////////////////////////////comme si en va déclarer tout les composants utilisés 
/**
 * @swagger
 * components:
 *   schemas:
 *     CandAud:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: L'ID auto-généré de la candidatAudition
 *         extrait:
 *           type: string
 *           description: Extrait de la candidatAudition
 *         tessiture:
 *           type: string
 *           enum: ['Base', 'Alto', 'Tenor', 'Soprano']
 *           description: Tessiture de la candidatAudition
 *         evaluation:
 *           type: string
 *           enum: ['A', 'B', 'C']
 *           description: Évaluation de la candidatAudition
 *         decision:
 *           type: string
 *           enum: ['retenu', 'non retenu']
 *           default: 'non retenu'
 *           description: Décision de la candidatAudition
 *         remarque:
 *           type: string
 *           description: Remarques sur la candidatAudition
 *         audition:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: L'ID auto-généré de l'audition associée
 *           description: L'audition associée
 *         ConfirmedEmail: 
 *           type: string
 *           enum: ['confirmer', 'infirmer']
 *           default: 'infirmer'
 *           description: Email de confirmation
 *       example:
 *         extrait: "Sample Excerpt"
 *         tessiture: "Base"
 *         evaluation: "A"
 *         decision: "retenu"
 *         remarque: "Sample Remark"
 *         audition:
 *           _id: "60768d8859f6a29308c1daf9"
 *         ConfirmedEmail: "infirmer"
 */
 
//  *     CandAud:
//  *          allOf:
//  *              - type: object
//  *                properties:
//  *                  _id:
//  *                      type: string
//  *                      description: The auto-generated id of the task
//  *              - $ref: '#/components/schemas/CandAud'
//  */
///////////////////////////////////

/**
 * @swagger
 * /cand:
 *   get:
 *     summary: Liste toutes les candidatAuditions
 *     tags: [candidatAudition]
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CandAud'
 *       500:
 *         description: Erreur serveur
 */


router.get("/",candAController.fetchCandAs)

/**
 * @swagger
 * /cand/{id}:
 *   get:
 *     summary: Obtient une candidatAudition par ID
 *     tags: [candidatAudition]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la candidatAudition
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CandAud'
 *       404:
 *         description: Objet non trouvé
 *       500:
 *         description: Erreur serveur
 */
  
  router.get("/:id",candAController.getCandAById)
  
/**
 * @swagger
 * /cand:
 *   post:
 *     summary: Crée une nouvelle candidatAudition
 *     tags: [candidatAudition]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CandAud'
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CandAud'
 *       400:
 *         description: Requête incorrecte. Vous devrez peut-être vérifier vos informations.
 *       500:
 *         description: Erreur serveur
 */


  router.post("/",candAController.addCandA)
   
/**
 * @swagger
 * /cand/{id}:
 *   patch:
 *     summary: Mettre à jour partiellement une candidatAudition par ID
 *     tags: [candidatAudition]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la candidatAudition à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CandAud'
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CandAud'
 *       400:
 *         description: Requête incorrecte. Vous devrez peut-être vérifier vos informations.
 *       404:
 *         description: CandidatAudition non trouvé
 *       500:
 *         description: Erreur serveur
 */

 router.patch("/:id",candAController.UpdateCandA)

/**
 * @swagger
 * /cand/{id}:
 *   delete:
 *     summary: Delete a candidatAudition by ID
 *     tags: [candidatAudition]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CandAud'
 *       404:
 *         description: CandidatAudition not found
 *       500:
 *         description: Some server error
 */
router.delete("/:id",candAController.DeleteCandA)

module.exports=router
