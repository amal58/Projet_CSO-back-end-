const express = require('express');
const ChoristeController = require('../controllers/choriste');
const router = express.Router();
const jwtcontro=require("../middlewares/userAuth")

/**
 * @swagger
 * tags:
 *   name: Choristes
 *   description: API de gestion des choristes
 */

/**
 * @swagger
 * /api/choriste/:
 *   get:
 *     summary: Récupère tous les choristes
 *     tags: [Choristes]
 *     security:
 *       - radiotherapie: []
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message de succès
 *                 resultat:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       elem:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: L'ID du choriste
 *                           # Add other properties based on your Choriste model
 *                       existAuditionDetail:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: L'ID du détail d'audition
 *                           # Add other properties based on your AuditionDetail model
 *               example:
 *                 message: "extraction avec succes"
 *                 resultat:
 *                   - elem:
 *                       _id: "60768d8859f6a29308c1dafe"
 *                       # Add other properties of Choriste
 *                     existAuditionDetail:
 *                       _id: "60768d8859f6a29308c1db02"
 *                       # Add other properties of AuditionDetail
 *       400:
 *         description: Échec de la requête
 */
router.get("/", jwtcontro.loggedMiddleware,jwtcontro.isAdmin, ChoristeController.GetAllChoristes)    

/**
 * @swagger
 * /api/choriste/login:
 *   post:
 *     summary: Connecte un choriste
 *     tags: [Choristes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Adresse e-mail du choriste
 *               password:
 *                 type: string
 *                 description: Mot de passe du choriste
 *             example:
 *               email: "choriste@example.com"
 *               password: "password123"
 *     responses:
 *       200:
 *         description: Succès de la connexion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   # Add properties of Choriste
 *                 token:
 *                   type: string
 *                   description: Jeton d'authentification
 *               example:
 *                 user:
 *                   _id: "60768d8859f6a29308c1dafe"
 *                   # Add other properties of Choriste
 *                 token: "jwt.token.123"
 *       400:
 *         description: Échec de la connexion
 */
router.post("/login", ChoristeController.login)

/**
 * @swagger
 * /api/choriste/modifTessiture/{id}:
 *   patch:
 *     summary: Modifie la tessiture d'un choriste
 *     tags: [Choristes]
 *     security:
 *       - radiotherapie: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du choriste
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tessiture:
 *                 type: string
 *                 description: La nouvelle tessiture du choriste
 *             example:
 *               tessiture: "soprano"
 *     responses:
 *       200:
 *         description: Succès de la modification de la tessiture
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message de succès
 *                 res:
 *                   type: object
 *                   # Add properties of AuditionDetail
 *               example:
 *                 message: "tessiture modifiée"
 *                 res:
 *                   _id: "60768d8859f6a29308c1db02"
 *                   # Add other properties of AuditionDetail
 *       400:
 *         description: Échec de la requête
 */
router.patch("/modifTessiture/:id", jwtcontro.loggedMiddleware,jwtcontro.isAdmin,ChoristeController.modifier_tessiture)

module.exports = router;
