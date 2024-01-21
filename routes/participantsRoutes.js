const express = require('express');
const router = express.Router();
const participantsController = require('../controllers/participantsController');
const auth = require("../middlewares/UserAuth")

/**
 * @swagger
 * tags:
 *   - name: Participants_Concert
 *     description: Opérations liées aux auditions
 */

/**
 * @swagger
 * /api/{tessit}/{idC}:
 *   get:
 *     summary: Liste des participants(disponile) dans un concert
 *     tags: [Participants_Concert]
 *     description: Lister les participants selon le nom du pupitre pour un prochain concert .
 *     parameters:
 *       - name: tessit
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: idC
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Opération réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas'
 *       404:
 *         description: Œuvre non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:tessit/:idC',auth.loggedMiddleware,auth.isAdmin, participantsController.getAll); 
/**
 * @swagger
 * /api/{concertId}:
 *   get:
 *     summary: Liste des participants dans un concert déjà passé .
 *     tags: [Participants_Concert]
 *     description: Lister les participants selon id du concert (tester sur les choristes qui ont été présents dans un concert).
 *     parameters:
 *       - name: concertId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Opération réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas'
 *       404:
 *         description: Œuvre non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:concertId',auth.loggedMiddleware,auth.isAdmin, participantsController.getParticipantsByConcertId);
/**
 * @swagger
 * /api/participants/{idC}/{pourcentage}:
 *   get:
 *     summary: Liste des participants dans un concert selon taux présence
 *     tags: [Participants_Concert]
 *     description: Lister les participants selon id du concert et le pourcentage de présence (qui ont un pourcentage de  présence supérieur ou égale le pourcentage indiqué)
 *     parameters:
 *       - name: idC
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: pourcentage
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Opération réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas'
 *       404:
 *         description: Œuvre non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/participants/:idC/:pourcentage',auth.loggedMiddleware,auth.isAdmin, participantsController.getListeParticipants);
/**
 * @swagger
 * /api/participants/absence/{idC}/{pourcentage}:
 *   get:
 *     summary: Liste des participants dans un concert selon taux absence
 *     tags: [Participants_Concert]
 *     description: Lister les participants selon id du concert et le pourcentage d absence (qui ont un pourcentage d absence inférieur ou égale le pourcentage indiqué)
 *     parameters:
 *       - name: idC
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: pourcentage
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Opération réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas'
 *       404:
 *         description: Œuvre non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/participants/absence/:idC/:pourcentage',auth.loggedMiddleware,auth.isAdmin, participantsController.getListeParticipantsParAbsence);


module.exports = router;
