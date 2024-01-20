const express=require("express")
const router =express.Router()
const concertController=require("../controllers/concert")
const jwtcontro = require('../middlewares/userAuth');

/**
 * @swagger
 * tags:
 *   name: Concert
 *   description: API de gestion des concerts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Concert:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: L'ID auto-généré du concert
 *         date:
 *           type: string
 *           format: date
 *           description: Date du concert
 *         lieu:
 *           type: string
 *           description: Lieu du concert
 *         choriste:
 *           type: string
 *           description: ID du choriste associé
 *         programme:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des IDs des œuvres programmées
 *       example:
 *         date: "2023-01-01"
 *         lieu: "Sample Location"
 *         choriste: "60768d8859f6a29308c1daf9"
 *         programme:
 *           - "60768d8859f6a29308c1dafe"
 *           - "60768d8859f6a29308c1db01"
 */


/**
 * @swagger
 * /concert:
 *   get:
 *     summary: Liste toutes les candidatAuditions
 *     tags: [Concert]
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Concert'
 *       500:
 *         description: Erreur serveur
 */


router.get("/",jwtcontro.loggedMiddleware,concertController.fetchConcert)
  
/**
 * @swagger
 * /concert/{id}:
 *   get:
 *     summary: Obtient un concert par ID
 *     tags: [Concert]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la concert
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Concert'
 *       404:
 *         description: Objet non trouvé
 *       500:
 *         description: Erreur serveur
 */

router.get("/:id",jwtcontro.loggedMiddleware,concertController.getConcertById)
  
/**
 * @swagger
 * /concert:
 *   post:
 *     summary: Crée un nouveau concert
 *     tags: [Concert]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Concert'
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Concert'
 *       400:
 *         description: Requête incorrecte. Vous devrez peut-être vérifier vos informations.
 *       500:
 *         description: Erreur serveur
 */



router.post("/",jwtcontro.loggedMiddleware,concertController.addConcert)

/**
 * @swagger
 * /concert/excel:
 *   post:
 *     summary: Crée un nouveau concert avec excel
 *     tags: [Concert]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Concert'
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Concert'
 *       400:
 *         description: Requête incorrecte. Vous devrez peut-être vérifier vos informations.
 *       500:
 *         description: Erreur serveur
 */


router.post("/excel",jwtcontro.loggedMiddleware, concertController.addProgramExcel);


/**
 * @swagger
 * /concert/{id}:
 *   patch:
 *     summary: Mettre à jour partiellement une concert par ID
 *     tags: [Concert]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la concert à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Concert'
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Concert'
 *       400:
 *         description: Requête incorrecte. Vous devrez peut-être vérifier vos informations.
 *       404:
 *         description: Concert non trouvé
 *       500:
 *         description: Erreur serveur
 */

   
router.patch("/:id",jwtcontro.loggedMiddleware,concertController.UpdateConcert)

/**
 * @swagger
 * /concert/{id}:
 *   delete:
 *     summary: Delete a concert by ID
 *     tags: [Concert]
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
 *               $ref: '#/components/schemas/Concert'
 *       404:
 *         description: Concert not found
 *       500:
 *         description: Some server error
 */

router.delete("/:id",jwtcontro.loggedMiddleware,concertController.DeleteConcert)

module.exports=router
