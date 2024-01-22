const express = require('express');
const router = express.Router();
const chefpupitreController = require('../controllers/chefpupitre');

const jwtcontro = require('../middlewares/userAuth');



/**
 * @swagger
 * tags:
 *   name: Deux Chef Pupitre
 *   description: Désigné deux chef de pupitres
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
 *           - saison: 2023
 *             statut: "senior"
 *         password: "MotDePasse123"
 *         confirmationStatus: "En attente de confirmation"
 */

/**
 * @swagger
 * /chef/{id}:
 *   patch:
 *     summary: Définir deux chefs de pupitre
 *     tags: [Deux Chef Pupitre]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du chef de pupitre
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Choriste'
 *       400:
 *         description: Choriste non valide pour la désignation en tant que chef de pupitre.
 *       404:
 *         description: Choriste non trouvé
 *       500:
 *         description: Erreur serveur
 */


router.patch('/:id',jwtcontro.loggedMiddleware ,chefpupitreController.designatePupitreChefs);

module.exports = router;