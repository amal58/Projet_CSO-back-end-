const express=require("express")
const router =express.Router()
const auth = require("../middlewares/UserAuth")
const OeuvreController=require("../controllers/oeuvre")
// const swaggerJSDoc = require('swagger-jsdoc')
// const swaggerUi = require('swagger-ui-express')

// const options = {
//     definition: {
//       openapi: '3.0.0',
//       info: {
//         title: 'Projet CSO API Documentation',
//         version: '1.0.0',
//       },
//       servers: [
//         {
//           url: 'http://localhost:5000/', 
//         },
//       ],
//       components: {
//           securitySchemes: {
//             bearerAuth: {
//               type: 'http',
//               scheme: 'bearer',
//               bearerFormat: 'JWT',
//             },
//           },
//         },
//       security: [
//         {
//           bearerAuth: [],
//         },
//       ],
//     },
//     apis: ['./routes/oeuvre.js'],
//   };

/**
 * @swagger
 * components:
 *   schemas:
 *     Oeuvre:
 *       type: object
 *       properties:
 *         titre:
 *           type: string
 *           description: The title of the Oeuvre.
 *         anneeComposition:
 *           type: number
 *           description: The year of composition.
 *         compositeurs:
 *           type: array
 *           items:
 *             type: string
 *           description: List of composers for the Oeuvre.
 *         arrangeurs:
 *           type: array
 *           items:
 *             type: string
 *           description: List of arrangers for the Oeuvre.
 *         genre:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - Symphonie chorale
 *               - Classique
 *               - Jazz
 *               - Opéra
 *               - Choral
 *               - Rock
 *           description: Genre of the Oeuvre.
 *         presence:
 *           type: boolean
 *           description: Indicates the presence status of the Oeuvre.
 *         paroles:
 *           type: array
 *           items:
 *             type: string
 *           description: List of lyrics for the Oeuvre.
 *         parties:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Partie'
 *           description: List of parts for the Oeuvre.
 *
 *     Partie:
 *       type: object
 *       properties:
 *         estChoeur:
 *           type: boolean
 *           default: false
 *           description: Indicates if it's a choir part.
 *         pupitres:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - Soprano
 *               - Alto
 *               - Ténor
 *               - Basse
 *           description: List of choir part pupitres.
 *         
 *     Error:
 *       type: object
 *       properties:
 *         errorCode:
 *           type: string
 *           description: A code representing the error.
 *         errorMessage:
 *           type: string
 *           description: A human-readable error message.
 *         errorDetails:
 *           type: object
 *           description: Additional details about the error.
 *       example:
 *         errorCode: "E001"
 *         errorMessage: "Invalid input"
 *         errorDetails:
 *           field: "exampleField"
 *           reason: "Field cannot be empty"
 */


/**
 * @swagger
 * tags:
 *   - name: Oeuvre
 *     description: Opérations liées aux œuvres
 */
/**
 * @swagger
 * /Oeuvre/AfficherTout:
 *   get:
 *     summary: Récupérer toutes les oeuvres
 *     tags: [Oeuvre]
 *     description: Obtenez la liste de toutes les oeuvres dans la base de données
 *     security:
 *       - customAuth: []
 *     responses:
 *       '200':
 *         description: Opération réussie
 *       '401':
 *         description: Non autorisé
 *       '500':
 *         description: Erreur interne du serveur
 */
router.get("/AfficherTout",auth.loggedMiddleware,auth.isAdmin,OeuvreController.AfficherToutOeuvre)  
/**
 * @swagger
 * /Oeuvre/AfficherUne/{id}:
 *   get:
 *     summary: Récupérer une œuvre spécifique par ID
 *     tags: [Oeuvre]
 *     description: Obtenez les détails d'une œuvre spécifique en utilisant son ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Opération réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Oeuvre'
 *       404:
 *         description: Œuvre non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/AfficherUne/:id",auth.loggedMiddleware,auth.isAdmin,OeuvreController.AfficheUneOeuvre)
/**
 * @swagger
 * /Oeuvre/ajouter:
 *   post:
 *     summary: Crée une nouvelle oeuvre musicale
 *     tags: [Oeuvre]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas'
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas'
 *       400:
 *         description: Requête incorrecte. Vous devrez peut-être vérifier vos informations.
 *       500:
 *         description: Erreur serveur
 */
router.post("/ajouter",auth.loggedMiddleware,auth.isAdmin,OeuvreController.AjoutOeuvre)     
/**
 * @swagger
 * /Oeuvre/modifier/{id}:
 *   patch:
 *     summary: Mettre à jour une oeuvre existante
 *     tags: [Oeuvre]
 *     description: Met à jour les détails d'une oeuvre existante en utilisant son ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas'
 *     responses:
 *       '200':
 *         description: Oeuvre mise à jour avec succès
 *       '400':
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Oeuvre non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Erreur lors de la mise à jour de l'oeuvre
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch("/modifier/:id",auth.loggedMiddleware,auth.isAdmin,OeuvreController.MiseAjourOeuvre)
/**
 * @swagger
 * /Oeuvre/Supprimer/{id}:
 *   delete:
 *     summary: Supprimer une oeuvre
 *     tags: [Oeuvre]
 *     description: Supprime une oeuvre de la base de données en utilisant son ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Oeuvre supprimée avec succès
 *       '404':
 *         description: Oeuvre non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Erreur lors de la suppression de l'oeuvre
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/Supprimer/:id",auth.loggedMiddleware,auth.isAdmin,OeuvreController.SuppOeuvre)




module.exports=router



