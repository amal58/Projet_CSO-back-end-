const express = require('express');
const router = express.Router();
const absenceController = require('../controllers/resultatAbsence');
const jwtcontro = require('../middlewares/userAuth');



/**
 * @swagger
 * tags:
 *   name: Absence
 *   description: traiter les cas liées à l'absence des choristes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AbsencePresence:
 *       type: object
 *       properties:
 *         etat:
 *           type: boolean
 *           default: false
 *           description: État de présence ou absence (par défaut, false pour absence)
 *         CurrentDate:
 *           type: string
 *           format: date-time
 *           default: Date.now
 *           description: Date actuelle (par défaut, date actuelle)
 *         RaisonAbsence:
 *           type: string
 *           description: Raison de l'absence
 *         RaisonPresenceManuel:
 *           type: string
 *           description: Raison de la présence manuelle
 *         choriste:
 *           type: string
 *           description: ID du choriste associé
 *         repetition:
 *           type: string
 *           description: ID de la répétition associée
 *         concert:
 *           type: string
 *           description: ID du concert associé
 *         seuilnomine:
 *           type: number
 *           default: 15
 *           description: Seuil pour être nominé (par défaut, 15)
 *         seuilelimine:
 *           type: number
 *           default: 20
 *           description: Seuil pour être éliminé (par défaut, 20)
 *       example:
 *         etat: false
 *         CurrentDate: "2024-01-20T12:00:00Z"
 *         RaisonAbsence: "Maladie"
 *         RaisonPresenceManuel: "Raison manuelle"
 *         repetition: "60768d8859f6a29308c1dafe"
 *         concert: "60768d8859f6a29308c1dafc"
 */

/**
 * @swagger
 * /absence/demandeAbsence:
 *   post:
 *     summary: Créer une nouvelle entrée pour l'absence/présence
 *     tags: [Absence]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AbsencePresence'
 *     responses:
 *       '201':
 *         description: Création réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AbsencePresence'
 *       '400':
 *         description: Requête invalide
 *       '500':
 *         description: Erreur serveur
 *     security:
 *       - bearerAuth: []
 */

router.post('/demandeAbsence',jwtcontro.loggedMiddleware,jwtcontro.isChoriste,absenceController.demanderAbsence);

/**
 * @swagger
 * /absence/nominer:
 *   get:
 *     summary: Liste de toutes les nominés
 *     tags: [Absence]
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AbsencePresence'
 *       500:
 *         description: Erreur serveur
 */

router.get('/nominer',jwtcontro.loggedMiddleware ,absenceController.getChoristesNominer);


/**
 * @swagger
 * /absence/eliminer:
 *   get:
 *     summary: Liste de toutes les eliminés
 *     tags: [Absence]
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AbsencePresence'
 *       500:
 *         description: Erreur serveur
 */

router.get('/eliminer',jwtcontro.loggedMiddleware ,absenceController.getChoristesEliminer);

/**
 * @swagger
 * /absence/seuil:
 *   patch:
 *     summary: Mettre à jour les deux seuils
 *     tags: [Absence]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seuilnomine:
 *                 type: number
 *                 default: 15
 *               seuilelimine:
 *                 type: number
 *                 default: 20
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AbsencePresence'
 *       500:
 *         description: Erreur serveur
 */

router.patch('/seuil',jwtcontro.loggedMiddleware,jwtcontro.isAdmin,absenceController.mettreAJourSeuil)

/**
 * @swagger
 * /absence/{id}:
 *   patch:
 *     summary: Éliminer un choriste pour une raison disciplinaire
 *     tags: [Absence]
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
 *               $ref: '#/components/schemas/AbsencePresence'
 *       404:
 *         description: Objet non trouvé
 *       500:
 *         description: Erreur serveur
 */


router.patch('/:id',jwtcontro.loggedMiddleware,jwtcontro.isAdmin,absenceController.eliminerChoriste)

/**
 * @swagger
 * /absence/liste:
 *   get:
 *     summary: la liste des absences pour un choriste
 *     tags: [Absence]
 *     responses:
 *       '200':
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AbsencePresence'
 *       '404':
 *         description: Choriste non trouvé
 *     security:
 *       - bearerAuth: []
 */

router.get('/liste',jwtcontro.loggedMiddleware,jwtcontro.isChoriste, absenceController.getAbsencesForChoriste);



module.exports = router;
