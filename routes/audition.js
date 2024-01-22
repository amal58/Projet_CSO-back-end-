const express = require('express');
const router = express.Router();
const auditionController = require('../controllers/audition');

/**
 * @swagger
 * components:
 *   schemas:
 *     Audition:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date-time
 *           description: La date de l'audition.
 *         heureDebut:
 *           type: string
 *           format: date-time
 *           description: L'heure de début de l'audition.
 *         candidat:
 *           type: string
 *           format: uuid
 *           description: L'identifiant du candidat.
 *       required:
 *         - heureDebut
 *         - candidat
 */
/**
 * @swagger
 * tags:
 *   - name: Audition
 *     description: Opérations liées aux auditions
 */


/**
 * @swagger
 * /api/auditions/EnvoyerPourFormulaire:
 *   post:
 *     summary: Lancer une audition 
 *     tags: 
 *       - Audition
 *     description: |
 *       Envoyer des e-mails à toutes les personnes qui ont fait la validation de leurs e-mails, 
 *       donc les personnes enregistrées dans la table PersonneInitiale.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NomDeVotreSchema'
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NomDeVotreSchema'
 *       400:
 *         description: Requête incorrecte. Vous devrez peut-être vérifier vos informations.
 *       500:
 *         description: Erreur serveur
 */
router.post('/EnvoyerPourFormulaire', auditionController.lancerAudition);
/**
 * @swagger
 * /api/auditions/validerEmailFormulaire/{token}:
 *   get:
 *     summary: Vérifier si le token est valide, c'est-à-dire le même envoyé par email
 *     tags: [Audition]
 *     description: Saisir le token envoyé par email et le tester. Si il est valide, la personne sera enregistrée dans la table personneInitiale.
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         type: string
 *         description: Le token envoyé par email.
 *     responses:
 *       200:
 *         description: Opération réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas'
 *       404:
 *         description: Token non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.get('/validerEmailFormulaire/:token', auditionController.validerEmailFormulaire);
/**
 * @swagger
 * /api/auditions/enregistrer-candidature:
 *   post:
 *     summary: Enregistrer la candidature après le remplissage du formulaire
 *     tags: [Audition] 
 *     description: |
 *       Après que le candidat a rempli le formulaire sans erreur, la candidature sera enregistrée dans une table Personne.
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
 *         description: Requête incorrecte. Vérifiez vos informations.
 *       500:
 *         description: Erreur serveur
 *     security:
 *       - bearerAuth: []
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post('/enregistrer-candidature', auditionController.enregistrerPersonne);



router.post('/auditions/auto', auditionController.generateAuditions);

module.exports = router;