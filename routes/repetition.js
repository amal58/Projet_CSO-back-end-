const express = require('express');
const router = express.Router();
const repetitionController = require('../controllers/repetition');
/**
 * @swagger
 * tags:
 *   name: Répétition
 *   description: Gestion des Répétitions
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Repetition:
 *       type: object
 *       required:
 *         - heureDebut
 *         - heureFin
 *         - date
 *         - lieu
 *         - programme
 *         - concert
 *         - urlQR
 *       properties:
 *         heureDebut:
 *           type: string
 *           pattern: '^([01]\d|2[0-3]):[0-5]\d$'
 *           description: Heure de début de la répétition (au format HH:mm)
 *         heureFin:
 *           type: string
 *           pattern: '^([01]\d|2[0-3]):[0-5]\d$'
 *           description: Heure de fin de la répétition (au format HH:mm)
 *         date:
 *           type: string
 *           format: date
 *           description: Date de la répétition (au format ISO)
 *         lieu:
 *           type: string
 *           description: Lieu de la répétition
 *         programme:
 *           type: array
 *           items:
 *             type: string
 *           description: Programme de la répétition (liste d'ID des œuvres)
 *         concert:
 *           type: string
 *           description: ID du concert lié à la répétition
 *         urlQR:
 *           type: string
 *           description: URL du code QR associé à la répétition
 *       example:
 *         heureDebut: "18:00"
 *         heureFin: "20:00"
 *         date: "2024-01-31"
 *         lieu: "Salle de répétition"
 *         programme: ["ObjectId1", "ObjectId2"]
 *         concert: "ObjectIdConcert"
 *         urlQR: "https://example.com/qrcode"
 *
 *     RepetitionValidation:
 *       type: object
 *       required:
 *         - heureDebut
 *         - heureFin
 *         - date
 *         - lieu
 *         - programme
 *         - concert
 *
 *       properties:
 *         heureDebut:
 *           type: string
 *           pattern: '^([01]\d|2[0-3]):[0-5]\d$'
 *         heureFin:
 *           type: string
 *           pattern: '^([01]\d|2[0-3]):[0-5]\d$'
 *         date:
 *           type: string
 *           format: date
 *         lieu:
 *           type: string
 *         programme:
 *           type: string
 *         concert:
 *           type: string
 *
 *       example:
 *         heureDebut: "18:00"
 *         heureFin: "20:00"
 *         date: "2024-01-31"
 *         lieu: "Salle de répétition"
 *         programme: "ObjectId1"
 *         concert: "ObjectIdConcert"
 */

/**
 * @swagger
 * paths:
 *   /repetitions/create:
 *     post:
 *       summary: Créer une nouvelle répétition
 *       tags: [Répétitions]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 heureDebut:
 *                   type: string
 *                   format: time
 *                   description: Heure de début de la répétition
 *                 heureFin:
 *                   type: string
 *                   format: time
 *                   description: Heure de fin de la répétition
 *                 date:
 *                   type: string
 *                   format: date
 *                   description: Date de la répétition
 *                 lieu:
 *                   type: string
 *                   description: Lieu de la répétition
 *                 programme:
 *                   type: string
 *                   description: Programme de la répétition
 *                 concert:
 *                   type: string
 *                   description: Concert associé à la répétition
 *               required:
 *                 - heureDebut
 *                 - heureFin
 *                 - date
 *                 - lieu
 *                 - programme
 *                 - concert
 *       responses:
 *         '201':
 *           description: Répétition créée avec succès
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   repetition:
 *                     $ref: '#/components/schemas/Repetition'
 *                   message:
 *                     type: string
 *                     example: Répétition créée avec succès !
 *         '400':
 *           description: Erreur de validation des données
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Détails de l'erreur de validation
 *         '500':
 *           description: Erreur lors de la création de la répétition
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Message d'erreur détaillé
 */
router.post('/create', repetitionController.createRepetition);



module.exports = router;
