const express = require('express');
const router = express.Router();
const concertController = require('../controllers/concert');
/**
 * @swagger
 * tags:
 *   name: Concert
 *   description: Gestion des Concerts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Concert:
 *       type: object
 *       required:
 *         - date
 *         - lieu
 *         - urlQR
 *       properties:
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date of the concert
 *         lieu:
 *           type: string
 *           description: Location of the concert
 *         affiche:
 *           type: string
 *           description: URL or path to the concert poster
 *         programme:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: List of Oeuvre (musical works) associated with the concert
 *         urlQR:
 *           type: string
 *           description: URL or path to the QR code for the concert
 *       example:
 *         date: "2024-01-01T18:00:00Z"
 *         lieu: "Concert Hall"
 *         affiche: "https://example.com/concert-poster.jpg"
 *         programme: ["5f5ebdb5-43ab-4e4e-9cf1-2b2c7d94d1a0"]  # Replace with actual UUID
 *         urlQR: "https://example.com/concert-qr-code"
 * 
 *     NewConcert:
 *       type: object
 *       required:
 *         - date
 *         - lieu
 *         - urlQR
 *       properties:
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date of the concert
 *         lieu:
 *           type: string
 *           description: Location of the concert
 *         affiche:
 *           type: string
 *           description: URL or path to the concert poster
 *         programme:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: List of Oeuvre (musical works) associated with the concert
 *         urlQR:
 *           type: string
 *           description: URL or path to the QR code for the concert
 *       example:
 *         date: "2024-01-01T18:00:00Z"
 *         lieu: "Concert Hall"
 *         affiche: "https://example.com/concert-poster.jpg"
 *         programme: ["5f5ebdb5-43ab-4e4e-9cf1-2b2c7d94d1a0"]  # Replace with actual UUID
 *         urlQR: "https://example.com/concert-qr-code"
 * 
 *     ConcertWithID:
 *       allOf:
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: Auto-generated ID of the concert
 *         - $ref: '#/components/schemas/NewConcert'
 */

/**
 * @swagger
 * paths:
 *   /concerts:
 *     post:
 *       summary: Créer un nouveau concert
 *       tags: [Concerts]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   format: date
 *                   description: Date du concert
 *                 lieu:
 *                   type: string
 *                   description: Lieu du concert
 *                 affiche:
 *                   type: string
 *                   description: URL de l'affiche du concert
 *                 programme:
 *                   type: string
 *                   description: Programme du concert
 *               required:
 *                 - date
 *                 - lieu
 *                 - affiche
 *                 - programme
 *       responses:
 *         '201':
 *           description: Concert créé avec succès
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   concert:
 *                     $ref: '#/components/schemas/Concert'
 *                   message:
 *                     type: string
 *                     example: Concert créé avec succès !
 *         '500':
 *           description: Erreur lors de la création du concert
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Message d'erreur détaillé
 */

router.post('/create', concertController.createConcert);

module.exports = router;
