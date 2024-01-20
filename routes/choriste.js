const express = require('express');
const router = express.Router();
const choristeController = require("../controllers/choriste");



/**
 * @swagger
 * tags:
 *   name: Authentification
 *   description: Authentification et récupération du token JWT
 */


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authentification 
 *     tags: [Authentification]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Adresse e-mail de l'utilisateur
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Succès de l'authentification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT à inclure dans l'en-tête "Authorization" pour les requêtes ultérieures
 *       401:
 *         description: Échec de l'authentification
 */



router.post("/",choristeController.login)

module.exports = router;