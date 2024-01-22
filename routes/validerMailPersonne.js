const express = require('express');
const emailController = require('../controllers/validerMailPersonne');

const router = express.Router();

/**
 * @swagger
 * /validerMail/envoyer-email:
 *   post:
 *     summary: Validation initiale d'email 
 *     tags: 
 *       - Audition
 *     description: |
 *       Après que les personnes ont créé leur nom, prénom et e-mail,  
 *       un e-mail de validation contenant un jeton sera envoyé .
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
router.post('/envoyer-email', emailController.sendEmailController);
/**
 * @swagger
 * /validerMail/valider-email/{token}:
 *   get:
 *     summary: Validation du token envoyé par email
 *     tags: 
 *       - Audition
 *     description: |
 *       Après que le mail est reçu par la personne, elle doit prendre le jeton pour le valider.
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         type: string
 *         description: Le jeton reçu par email.
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas'
 *       400:
 *         description: Requête incorrecte. Vérifiez vos informations.
 *       500:
 *         description: Erreur serveur
 */
router.get('/valider-email/:token', emailController.validerEmail);


module.exports = router;

