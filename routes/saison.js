const express = require('express');
const router = express.Router();
const saisonController = require('../controllers/saison');
const auth = require("../middlewares/UserAuth")

/**
 * @swagger
 * components:
 *   schemas:
 *     Saison:
 *       type: object
 *       required:
 *         - SaisonName
 *         - dateDebut
 *         - dateFin
 *       properties:
 *         SaisonName:
 *           type: string
 *           description: Le nom de la saison.
 *         dateDebut:
 *           type: string
 *           format: date-time
 *           description: La date de début de la saison.
 *         dateFin:
 *           type: string
 *           format: date-time
 *           description: La date de fin de la saison.
 *         Personnes:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: Liste des identifiants de Personne associés à la saison.
 *         Oeuvres:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: Liste des identifiants d'Oeuvre associés à la saison.
 *         Absences:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: Liste des identifiants d'Absence associés à la saison.
 *         CandAuds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: Liste des identifiants de CandAud associés à la saison.
 *         Choristes:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: Liste des identifiants de Choriste associés à la saison.
 *         Repetitions:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: Liste des identifiants de Repetition associés à la saison.
 *         PersonneInitiales:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: Liste des identifiants de PersonneInitiale associés à la saison.
 *         Conges:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: Liste des identifiants de Conge associés à la saison.
 *         Concerts:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: Liste des identifiants de Concert associés à la saison.
 */


/**
 * @swagger
 * tags:
 *   - name: Saison
 *     description: Opérations liées aux saisons
 */
/**
 * @swagger
 * /api/saison/add:
 *   post:
 *     summary: Crée une nouvelle saison
 *     tags: [Saison] 
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
 *         description: Requête incorrecte. Vous devrez peut-être vérifier vos informations.
 *       500:
 *         description: Erreur serveur
 */
router.post('/add',auth.loggedMiddleware,auth.isAdmin, saisonController.AjoutSaison);
/**
 * 
 * @swagger
 * /api/saison/modif/{id}:
 *   patch:
 *     summary: Mettre à jour une saison existante
 *     tags: [Saison]
 *     description: Met à jour les détails d'une saison existante en utilisant son ID
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
 *         description: saison mise à jour avec succès
 *       '400':
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: saison non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Erreur lors de la mise à jour de saison
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/modif/:id',auth.loggedMiddleware,auth.isAdmin, saisonController.MiseAjourSaison);
/**
 * 
 * @swagger
 * /api/saison/archiver/{id}:
 *   patch:
 *     summary: Archiver une saison
 *     tags: [Saison]
 *     description: Enregistrer tous les données en relation avec la saison 
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
 *         description: saison mise à jour avec succès
 *       '400':
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: saison non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Erreur lors de la mise à jour de saison
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/archiver/:id',auth.loggedMiddleware,auth.isAdmin, saisonController.ArchiverSaison);

module.exports = router;