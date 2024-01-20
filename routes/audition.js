// Dans votre fichier de routes (par exemple, routes/audition.js)
const express = require('express');
const router = express.Router();
const auditionController = require('../controllers/audition');
/**
 * @swagger
 * tags:
 *  name: Audition
 *  description: Gestion des Auditions
 */

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
 *           description: Date of the audition
 *         heureDebut:
 *           type: string
 *           format: date-time
 *           description: Start time of the audition
 *         candidat:
 *           type: string
 *           format: uuid
 *           description: ID of the candidate (Personne) participating in the audition
 *       example:
 *         date: "2024-01-01T00:00:00Z"
 *         heureDebut: "2024-01-01T12:00:00Z"
 *         candidat: "5f5ebdb5-43ab-4e4e-9cf1-2b2c7d94d1a0"  # Replace with actual UUID
 * 
 *     NewAudition:
 *       type: object
 *       required:
 *         - heureDebut
 *         - candidat
 *       properties:
 *         heureDebut:
 *           type: string
 *           format: date-time
 *           description: Start time of the audition
 *         candidat:
 *           type: string
 *           format: uuid
 *           description: ID of the candidate (Personne) participating in the audition
 *       example:
 *         heureDebut: "2024-01-01T12:00:00Z"
 *         candidat: "5f5ebdb5-43ab-4e4e-9cf1-2b2c7d94d1a0"  # Replace with actual UUID
 * 
 *     AuditionWithID:
 *       allOf:
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: Auto-generated ID of the audition
 *         - $ref: '#/components/schemas/NewAudition'
 */

/**
 * @swagger
 * /auditions/auditions/auto:
 *   post:
 *     summary: Générer des auditions automatiquement
 *     tags:
 *       - Audition
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewAudition'  # Assurez-vous d'avoir défini ce schéma dans votre document Swagger
 *     responses:
 *       '201':
 *         description: Auditions générées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Audition'  # Assurez-vous d'avoir défini ce schéma dans votre document Swagger
 *       '500':
 *         description: Erreur lors de la génération des auditions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de la génération des auditions
 *                 error:
 *                   type: string
 *                   example: Message d'erreur détaillé
 */
router.post('/auditions/auto', auditionController.generateAuditions);

/**
 * @swagger
 * /auditions/generateAdditionalAuditions:
 *   post:
 *     summary: Générer des auditions supplémentaires
 *     tags:
 *       - Audition
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               listeCandidats:
 *                 type: array
 *                 items:
 *                   type: string
 *               nombreCandidatsParHeure:
 *                 type: integer
 *               heureDebut:
 *                 type: string
 *                 pattern: '^([01]\d|2[0-3]):[0-5]\d$'
 *               heureFin:
 *                 type: string
 *                 pattern: '^([01]\d|2[0-3]):[0-5]\d$'
 *               dateDebut:
 *                 type: string
 *                 format: date
 *     responses:
 *       '201':
 *         description: Auditions générées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Auditions générées avec succès
 *                 auditions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Audition'
 *       '500':
 *         description: Erreur lors de la génération des auditions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de la génération des auditions
 *                 error:
 *                   type: string
 *                   example: Message d'erreur détaillé
 */
router.post('/generateAdditionalAuditions', auditionController.generateAdditionalAuditions);


/**
 * @swagger
 * paths:
 *   /auditions:
 *     get:
 *       summary: Récupérer toutes les auditions
 *       tags:
 *         - Audition
 *       responses:
 *         '200':
 *           description: Toutes les auditions récupérées avec succès
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Toutes les auditions récupérées avec succès
 *                   auditions:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Audition'
 *         '500':
 *           description: Erreur lors de la récupération de toutes les auditions
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Erreur lors de la récupération de toutes les auditions
 *                   error:
 *                     type: string
 *                     example: Message d'erreur détaillé
 */
router.get('/', auditionController.getAllAuditions);

/**
 * @swagger
 * paths:
 *   /auditions/auditions/candidat/{candidatId}:
 *     get:
 *       summary: Récupérer les auditions pour un candidat spécifique
 *       tags:
 *         - Audition
 *       parameters:
 *         - in: path
 *           name: candidatId
 *           required: true
 *           description: ID du candidat
 *           schema:
 *             type: string
 *           example: "5f5ebdb5-43ab-4e4e-9cf1-2b2c7d94d1a0"  # Replace with actual UUID
 *       responses:
 *         '200':
 *           description: Auditions pour le candidat récupérées avec succès
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Auditions pour le candidat récupérées avec succès
 *                   auditions:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Audition'
 *         '404':
 *           description: Candidat non trouvé
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Candidat non trouvé
 *         '500':
 *           description: Erreur lors de la récupération des auditions pour le candidat
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Erreur lors de la récupération des auditions pour le candidat
 */


router.get('/auditions/candidat/:candidatId', auditionController.getAuditionsForCandidate);

/**
 * @swagger
 * paths:
 *   /auditions/date/{date}:
 *     get:
 *       summary: Récupérer les auditions pour une date spécifique
 *       tags:
 *         - Audition
 *       parameters:
 *         - in: path
 *           name: date
 *           required: true
 *           description: Date des auditions
 *           schema:
 *             type: string
 *             format: date
 *           example: "2024-01-31"
 *       responses:
 *         '200':
 *           description: Auditions pour la date récupérées avec succès
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Auditions pour la date récupérées avec succès
 *                   auditions:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Audition'
 *         '500':
 *           description: Erreur lors de la récupération des auditions par date
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Erreur lors de la récupération des auditions par date
 *                   error:
 *                     type: string
 *                     example: Message d'erreur détaillé
 */

router.get('/date/:date', auditionController.getAuditionsByDate);

/**
 * @swagger
 * paths:
 *   /auditions/heure/{heure}/date/{date}:
 *     get:
 *       summary: Récupérer les auditions pour une heure spécifique et une date donnée
 *       tags:
 *         - Audition
 *       parameters:
 *         - in: path
 *           name: heure
 *           required: true
 *           description: Heure des auditions (au format HH:mm)
 *           schema:
 *             type: string
 *           example: "09:00"
 *           pattern: '^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$'
 *         - in: path
 *           name: date
 *           required: true
 *           description: Date des auditions
 *           schema:
 *             type: string
 *             format: date
 *           example: "2023-01-01"
 *       responses:
 *         '200':
 *           description: Auditions récupérées avec succès pour l'heure et la date spécifiées
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Auditions récupérées avec succès pour l'heure et la date spécifiées
 *                   auditions:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Audition'
 *         '500':
 *           description: Erreur lors de la récupération des auditions par heure
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Erreur lors de la récupération des auditions par heure
 *                   error:
 *                     type: string
 *                     example: Message d'erreur détaillé
 */

router.get('/heure/:heure/date/:date', auditionController.getAuditionsByHeure);



module.exports = router;
