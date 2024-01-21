const express = require('express');
const router = express.Router();
const repetitionController = require('../controllers/repetition');
const jwtcontro=require("../middlewares/UserAuth")
/**
 * @swagger
 * tags:
 *   name: Repetitions
 *   description: API de gestion des répétitions
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Repetition:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: L'ID auto-généré de la répétition
 *         heureDebut:
 *           type: string
 *           description: Heure de début de la répétition
 *         heureFin:
 *           type: string
 *           description: Heure de fin de la répétition
 *         date:
 *           type: string
 *           format: date
 *           description: Date de la répétition
 *         lieu:
 *           type: string
 *           description: Lieu de la répétition
 *         programme:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des IDs des œuvres programmées
 *         concert:
 *           type: string
 *           description: ID du concert associé
 *         choriste:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des IDs des choristes présents
 *         urlQR:
 *           type: string
 *           description: URL du code QR de la répétition
 *       example:
 *         heureDebut: "18:00"
 *         heureFin: "20:00"
 *         date: "2023-01-01"
 *         lieu: "Sample Location"
 *         programme:
 *           - "60768d8859f6a29308c1dafe"
 *           - "60768d8859f6a29308c1db01"
 *         concert: "60768d8859f6a29308c1db02"
 *         choriste:
 *           - "60768d8859f6a29308c1db03"
 *           - "60768d8859f6a29308c1db04"
 *         urlQR: "https://example.com/qrcode"
 */


/**
 * @swagger
 * /api/repetitions/{id}:
 *   post:
 *     summary: Ajouter une répétition pour un concert donné
 *     tags: [Repetitions]
 *     security:
 *       - radiotherapie: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: ID du concert
 *       - in: header
 *         name: Content-Type
 *         schema:
 *           type: string
 *         default: application/json
 *       - in: body
 *         name: body
 *         required: true
 *         description: Données de la répétition
 *         schema:
 *           type: object
 *           properties:
 *             heureDebut:
 *               type: string
 *             heureFin:
 *               type: string
 *             date:
 *               type: string
 *               format: date-time
 *             lieu:
 *               type: string
 *             programme:
 *               type: array
 *               items:
 *                 type: string
 *               description: Liste des IDs des œuvres programmées
 *             urlQR:
 *               type: string
 *             choriste:
 *               type: array
 *               items:
 *                 type: string
 *               description: Liste des IDs des choristes présents
 *     responses:
 *       '400':
 *         description: Succès de l'ajout de la répétition
 *         content:
 *           application/json:
 *             example:
 *               message: "success repetition"
 *               response:
 *                 $ref: '#/components/schemas/Repetition'
 */

router.post('/:id',jwtcontro.loggedMiddleware,jwtcontro.isAdmin,repetitionController.createRepetition );
/**
 * @swagger
 * /api/repetitions/{id}:
 *   delete:
 *     summary: Supprime une répétition par ID
 *     tags: [Repetitions]
 *     security:
 *       - radiotherapie: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Repetition'
 *       404:
 *         description: Répétition non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id",jwtcontro.loggedMiddleware,jwtcontro.isAdmin,repetitionController.deleteRepetition );
/**
 * @swagger
 * /api/repetitions/{id}:
 *   patch:
 *     summary: Met à jour partiellement une répétition par ID
 *     tags: [Repetitions]
 *     security:
 *       - radiotherapie: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la répétition à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Repetition'
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Repetition'
 *       400:
 *         description: Requête incorrecte. Vous devrez peut-être vérifier vos informations.
 *       404:
 *         description: Répétition non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.patch("/:id",jwtcontro.loggedMiddleware,jwtcontro.isAdmin,repetitionController.updateRepetition );
/**
 * @swagger
 * /api/repetitions/getid/{id}:
 *   get:
 *     summary: Obtient une répétition par ID
 *     tags: [Repetitions]
 *     security:
 *       - radiotherapie: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la répétition
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 repetition:
 *                   $ref: '#/components/schemas/Repetition'
 *       404:
 *         description: Répétition non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get("/getid/:id",jwtcontro.loggedMiddleware,jwtcontro.isAdmin,repetitionController.getRepetitionById );
/**
 * @swagger
 * /api/repetitions/getall:
 *   get:
 *     summary: Récupère toutes les répétitions
 *     tags: [Repetitions]
 *     security:
 *       - radiotherapie: []
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Repetition'
 *       500:
 *         description: Erreur serveur
 */
router.get("/getall",jwtcontro.loggedMiddleware,jwtcontro.isAdmin,repetitionController.getAllRepetitions );


module.exports = router;