const express = require('express');
const router = express.Router();
const historiqueController = require('../controllers/consulterHistorique');
const jwtcontro = require('../middlewares/userAuth');
/**
 * @swagger
 * tags:
 *   name: Historique
 *   description: Consultation de l'historique
 */

/**
 * @swagger
 * paths:
 *   /historique/profil/{choristeId}:
 *     get:
 *       summary: Consulter le profil d'un choriste
 *       tags: [Historique]
 *       parameters:
 *         - in: path
 *           name: choristeId
 *           schema:
 *             type: string
 *           required: true
 *           description: L'ID du choriste
 *       responses:
 *         '200':
 *           description: Profil du choriste consulté avec succès
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   profil:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: L'ID du candidat
 *                       nom:
 *                         type: string
 *                         description: Le nom du candidat
 *                       prenom:
 *                         type: string
 *                         description: Le prénom du candidat
 *                       statutActuel:
 *                         type: string
 *                         description: Le statut actuel du choriste
 *                       role:
 *                         type: string
 *                         description: Le rôle du choriste
 *                       dateNaissance:
 *                         type: string
 *                         format: date
 *                         description: La date de naissance du candidat
 *                       cin:
 *                         type: string
 *                         description: Le numéro de carte d'identité du candidat
 *                       telephone:
 *                         type: string
 *                         description: Le numéro de téléphone du candidat
 *                       AnneeIntegration:
 *                         type: integer
 *                         description: L'année d'intégration du candidat
 *                   historiqueStatut:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         statut:
 *                           type: string
 *                           description: Le statut
 *                         date:
 *                           type: string
 *                           format: date-time
 *                           description: La date du changement de statut
 *         '404':
 *           description: Choriste non trouvé
 *         '500':
 *           description: Erreur lors de la consultation du profil du choriste
 */
router.get('/profil/:choristeId',   historiqueController.consulterProfil);
router.get('/profil/:id', jwtcontro.loggedMiddleware, historiqueController.consulteProfilAdmin);

module.exports = router;