const express = require('express');
const router = express.Router();
const repetitionController = require('../controllers/repetition');
const auth = require("../middlewares/UserAuth")

/**
 * @swagger
 * tags:
 *   - name: Envoyer_notification_urgent
 *     description: Opérations liées aux auditions
 */



/**
 * @swagger
 * /api/repetitions/concert/{id}:
 *   patch:
 *     summary: notification urgente en cas changement concert
 *     tags: [Envoyer_notification_urgent]
 *     description:  lors d'un changement dans un concert existant s'envoie une notification pour choristes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas'
 *     responses:
 *       '200':
 *         description: Oeuvre mise à jour avec succès
 *       '400':
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Oeuvre non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Erreur lors de la mise à jour de concert
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/concert/:id",auth.loggedMiddleware,auth.ischefpupitre, repetitionController.getRepetitionbyconcert );

/**
 * @swagger
 * /api/repetitions/mod/{id}:
 *   patch:
 *     summary: notification urgente en cas changement répétition
 *     tags: [Envoyer_notification_urgent]
 *     description: lors d'un changement dans une repetition existante s'envoie une notification pour choristes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas'
 *     responses:
 *       '200':
 *         description: Oeuvre mise à jour avec succès
 *       '400':
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Oeuvre non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Erreur lors de la mise à jour de l'oeuvre
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch("/mod/:id",auth.loggedMiddleware,auth.ischefpupitre, repetitionController.UpdateRepetition );


module.exports = router;