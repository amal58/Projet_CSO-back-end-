const express = require('express');
const router = express.Router();
const congeController = require('../controllers/conges');
const jwtcontro = require('../middlewares/userAuth');



/**
 * @swagger
 * tags:
 *   name: Conges
 *   description: Validation des congés suite à demande
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Conge:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: L'ID auto-généré du congé
 *         datefin:
 *           type: string
 *           format: date
 *           description: Date de fin du congé
 *         datedebut:
 *           type: string
 *           format: date
 *           description: Date de début du congé
 *         etat:
 *           type: string
 *           enum: [en attente, accepte]
 *           default: en attente
 *           description: État du congé (en attente, accepte)
 *         choriste:
 *           type: string
 *           description: ID du choriste associé
 *       example:
 *         datefin: "2023-01-01"
 *         datedebut: "2022-12-31"
 *         etat: "en attente"
 *         choriste: "60768d8859f6a29308c1daf9"
 */


/**
 * @swagger
 * /conge/valider:
 *   patch:
 *     summary: Valider un nouveau congé
 *     tags: [Conges]
 *     responses:
 *       201:
 *         description: traitement des demandes de congé réussi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conge'
 *       400:
 *         description: Données de congé non valides
 *       404:
 *         description: Pas de demandes de congé en attente.
 *       500:
 *         description: Erreur lors du traitement des demandes de congé.
 */



router.patch('/valider',jwtcontro.loggedMiddleware,jwtcontro.isAdmin, congeController.processDemandesConge);

module.exports = router;