const express = require('express');
const router = express.Router();
const historiqueController = require('../controllers/consulterHistorique');
const jwtcontro = require('../middlewares/userAuth');



/**
 * @swagger
 * tags:
 *   name: Historique
 *   description: Consulter status actuel , historique status et profil liée à un choriste
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
 *           description: L'ID auto-généré du choriste
 *         role:
 *           type: string
 *           description: Rôle du choriste (admin, choriste, Manager, chefpupitre, chefchoeur)
 *         statutAcutel:
 *           type: string
 *           description: Statut actuel du choriste (choriste, junior, senior, veteran, inactif)
 *         historiqueStatut:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               saison:
 *                 type: number
 *               statut:
 *                 type: string
 *           description: Historique des statuts du choriste
 *         password:
 *           type: string
 *           description: Mot de passe du choriste
 *         confirmationStatus:
 *           type: string
 *           description: Statut de confirmation (par exemple, "En attente de confirmation")
 *         etat:
 *           type: string
 *           description: État du choriste (eliminer, nominer)
 *       example:
 *         candidatId: "60768d8859f6a29308c1daf9"
 *         role: "choriste"
 *         login: "john_doe"
 *         statutAcutel: "senior"
 *         historiqueStatut:
 *           - saison: 2022
 *             statut: "senior"
 *         password: "MotDePasse123"
 *         confirmationStatus: "En attente de confirmation"
 *         etat: "nominer"
 */

/**
 * @swagger
 * /historique/profil/{id}:
 *   get:
 *     summary: Consulter le profil et l'historique du statut d'un choriste par un admin
 *     tags: [Historique]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du choriste
 *     responses:
 *       '200':
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Choriste'
 *       '404':
 *         description: Choriste non trouvé
 *     security:
 *       - bearerAuth: []
 */





router.get('/profil/:id', jwtcontro.loggedMiddleware, jwtcontro.isAdmin, historiqueController.consulteProfilAdmin);





/**
 * @swagger
 * /historique/profil:
 *   get:
 *     summary: Consulter le profil et l'historique du statut d'un choriste
 *     tags: [Historique]
 *     responses:
 *       '200':
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Choriste'
 *       '404':
 *         description: Choriste non trouvé
 *     security:
 *       - bearerAuth: []
 */


 router.get('/profil', jwtcontro.loggedMiddleware, jwtcontro.isChoriste, historiqueController.consulterProfil);




module.exports = router;
