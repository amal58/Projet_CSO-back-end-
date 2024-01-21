const express=require("express")
const router =express.Router()
const candAController=require("../controllers/candidatAudition")
const jwtcontro=require("../middlewares/UserAuth")
/**
 * @swagger
 * tags:
 *   name: Auditions
 *   description: API for managing auditions
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CandAResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         tessiture:
 *           type: string
 *         decision:
 *           type: string
 *         audition:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             candidat:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 nom:
 *                   type: string
 *                 prenom:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Email of the candidate
 */

router.get("/",candAController.fetchCandAs)
//  router.get("/:id",candAController.getCandAById)
router.post("/",candAController.addCandA)

//  router.patch("/:id",candAController.UpdateCandA)
// router.delete("/:id",candAController.DeleteCandA)
/**
 * @swagger
 * /api/cand/AUD:
 *   post:
 *     summary: Get the selected number of candidates for each tessitura
 *     tags: [Auditions]
 *     security:
 *       - radiotherapie: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sop:
 *                 type: integer
 *               alt:
 *                 type: integer
 *               ten:
 *                 type: integer
 *               bas:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved candidates for each tessitura
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CandAResponse'
 *       500:
 *         description: Internal Server Error
 */
router.post("/AUD",jwtcontro.loggedMiddleware,jwtcontro.isAdmin,candAController.getCandidaR)


/**
 * @swagger
 * /api/cand/confirmation/{token}:
 *   post:
 *     summary: Confirm email using the provided token
 *     tags: [Auditions]
 *     security:
 *       - radiotherapie: []
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The confirmation token received via email
 *     responses:
 *       200:
 *         description: Email confirmation successful
 *       400:
 *         description: Bad request or invalid token
 *       500:
 *         description: Internal Server Error
 */

router.post("/confirmation/:token",jwtcontro.loggedMiddleware,jwtcontro.isAdmin,candAController.confirmation)



module.exports=router