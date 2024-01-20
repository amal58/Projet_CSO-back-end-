const express = require('express');
const ChoristeController = require('../controllers/choriste');
const router = express.Router();
// const {loggedMiddleware}=require("../middlewares/Userauth");
// router.get("/",loggedMiddleware,ChoristeController.GetAllChoristes) ;  

/**
 * @swagger
 * tags:
 *  name: Choriste
 *  description: Gestion des Choristes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Choriste:
 *       type: object
 *       properties:
 *         candidatId:
 *           type: string
 *           description: ID of the associated candidate (Personne)
 *         role:
 *           type: string
 *           enum: ['admin', 'choriste', 'Manager', 'chefpupitre', 'chefchoeur']
 *           description: Role of the choriste
 *         statutAcutel:
 *           type: string
 *           enum: ['choriste', 'junior', 'senior', 'veteran', 'inactif']
 *           description: Current status of the choriste
 *         login:
 *           type: string
 *           description: Choriste's login
 *         historiqueStatut:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               saison:
 *                 type: number
 *                 description: Season of the historical status
 *               statut:
 *                 type: string
 *                 enum: ['choriste', 'junior', 'senior', 'veteran', 'inactif']
 *                 description: Historical status of the choriste
 *         password:
 *           type: string
 *           description: Choriste's password
 *         confirmationStatus:
 *           type: string
 *           default: 'En attente de confirmation'
 *           description: Confirmation status of the choriste
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     NewChoriste:
 *       type: object
 *       required:
 *         - candidatId
 *         - role
 *         - statutAcutel
 *         - login
 *         - historiqueStatut
 *         - password
 *       properties:
 *         candidatId:
 *           type: string
 *           description: ID of the associated candidate (Personne)
 *         role:
 *           type: string
 *           enum: ['admin', 'choriste', 'Manager', 'chefpupitre', 'chefchoeur']
 *           description: Role of the choriste
 *         statutAcutel:
 *           type: string
 *           enum: ['choriste', 'junior', 'senior', 'veteran', 'inactif']
 *           description: Current status of the choriste
 *         login:
 *           type: string
 *           description: Choriste's login
 *         historiqueStatut:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               saison:
 *                 type: number
 *                 description: Season of the historical status
 *               statut:
 *                 type: string
 *                 enum: ['choriste', 'junior', 'senior', 'veteran', 'inactif']
 *                 description: Historical status of the choriste
 *         password:
 *           type: string
 *           description: Choriste's password
 *         confirmationStatus:
 *           type: string
 *           default: 'En attente de confirmation'
 *           description: Confirmation status of the choriste
 *       example:
 *         candidatId: "personne123"
 *         role: "choriste"
 *         statutAcutel: "junior"
 *         login: "choriste123"
 *         historiqueStatut: [{ saison: 2022, statut: "junior" }]
 *         password: "securePassword123"
 *         confirmationStatus: "En attente de confirmation"
 * 
 *     Choriste:
 *       allOf:
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: Auto-generated ID of the choriste
 *         - $ref: '#/components/schemas/NewChoriste'
 */
/**
 * @swagger
 * paths:
 *   /choristes/login:
 *     post:
 *       summary: Connectez-vous en tant que choriste ou utilisateur
 *       tags:
 *         - Choriste
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   description: Email du choriste ou de l'utilisateur
 *                 password:
 *                   type: string
 *                   description: Mot de passe du choriste ou de l'utilisateur
 *               required:
 *                 - email
 *                 - password
 *       responses:
 *         '200':
 *           description: Connexion réussie
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   token:
 *                     type: string
 *                     description: Jeton d'authentification pour accéder aux ressources protégées
 *         '400':
 *           description: Échec de la connexion en raison d'un mot de passe invalide
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Mot de passe invalide
 *         '401':
 *           description: Utilisateur non trouvé
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Utilisateur non trouvé
 */

router.post("/login",ChoristeController.login);
/**
 * @swagger
 * paths:
 *   /choristes/modifTessiture/{id}:
 *     patch:
 *       summary: Modifie la tessiture d'un choriste
 *       tags:
 *         - Choriste
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: ID du choriste à modifier
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tessiture:
 *                   type: string
 *                   description: Nouvelle tessiture du choriste
 *               required:
 *                 - tessiture
 *       responses:
 *         '200':
 *           description: Tessiture modifiée avec succès
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Tessiture modifiée
 *                   res:
 *                     $ref: '#/components/schemas/Audition'
 *         '404':
 *           description: Choriste, audition, ou tessiture non trouvée
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Choriste non trouvé
 *         '500':
 *           description: Erreur serveur
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Erreur serveur
 */

router.patch("/modifTessiture/:id",ChoristeController.modifier_tessiture);
module.exports = router;