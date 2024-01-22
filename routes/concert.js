const express=require("express")
const router =express.Router()
const concertController=require("../controllers/concert")
const jwtcontro = require('../middlewares/userAuth');
const auth = require("../middlewares/userAuth")

const socketIo = require('socket.io');
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
 *         choriste: "6586dacb9f6a29308c1dafa1"
 *         programme:
 *           - "658449596a98fa0d592861df"
 *           - "658449596a98fa0d592861e3"
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


router.delete("/:id",concertController.DeleteConcert)



  /**
 * @swagger
 * tags:
 *   name: Concerts
 *   description: API de gestion des concerts
 */
  /**
 * @swagger
 * components:
 *   schemas:
 *     Concert:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           description: Date du concert
 *         lieu:
 *           type: string
 *           description: Lieu du concert
 *         affiche:
 *           type: string
 *           description: URL de l'affiche du concert
 *         programme:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des IDs des œuvres programmées
 *         urlQR:
 *           type: string
 *           description: URL du code QR du concert
 *       example:
 *         date: "2023-01-01"
 *         lieu: "Sample Location"
 *         affiche: "https://example.com/affiche"
 *         programme:
 *           - "60768d8859f6a29308c1dafe"
 *           - "60768d8859f6a29308c1db01"
 *         urlQR: "https://example.com/qrcode"
 */



/**
 * @swagger
 * /api/concert/ajoutplacement/{id}:
 *   get:
 *     summary: Générer le placement pour un concert
 *     tags: [Concerts]
 *     security:
 *       - radiotherapie: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: ID du concert
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             example:
 *               reponse: [[{nom: "Nom1", prenom: "Prenom1", taille: 170, tessiture: "soprano"}, ...], ...]
 *               message: "succes retour"
 *       400:
 *         description: Échec de la génération du placement
 *         content:
 *           application/json:
 *             example:
 *               message: "failed"
 */
router.get("/ajoutplacement/:id",auth.loggedMiddleware,auth.isAdmin,concertController.ajoutplacement)
module.exports=router