const express=require("express")
const router =express.Router()
const absprController=require("../controllers/absencepresence")
const jwtcontro=require("../middlewares/UserAuth")

/**
 * @swagger
 * tags:
 *   name: Absences
 *   description: API de gestion des demandes d'absence
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Absence:
 *       type: object
 *       properties:
 *         etat:
 *           type: boolean
 *         CurrentDate:
 *           type: string
 *           format: date-time
 *         RaisonAbsence:
 *           type: string
 *         RaisonPresenceManuel:
 *           type: string
 *         disponibilite:
 *           type: boolean
 *         choriste:
 *           type: string
 *           description: ID du choriste
 *         repetition:
 *           type: string
 *           description: ID de la répétition
 *         concert:
 *           type: string
 *           description: ID du concert
 *
 *     AbsenceDemande:
 *       type: object
 *       properties:
 *         etat:
 *           type: boolean
 *         date:
 *           type: string
 *           format: date-time
 *         RaisonAbsence:
 *           type: string
 *         RaisonPresenceManuel:
 *           type: string
 *         choriste:
 *           type: string
 *           description: ID du choriste
 *         repetition:
 *           type: string
 *           description: ID de la répétition
 *         concert:
 *           type: string
 *           description: ID du concert
 */






router.post("/",absprController.AjoutDispon)
/**
 * @swagger
 * /api/absencepresence/demandeAbsence:
 *   post:
 *     summary: Ajoute une demande d'absence
 *     tags: [Absences]
 *     security:
 *       - radiotherapie: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AbsenceDemande'
 *     responses:
 *       201:
 *         description: Demande d'absence ajoutée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message de succès
 *                 demande:
 *                   $ref: '#/components/schemas/Absence'
 *               example:
 *                 message: "Demande d'absence ajoutée avec succès"
 *                 demande:
 *                   etat: false
 *                   CurrentDate: "2024-01-20T12:34:56.789Z"
 *                   RaisonAbsence: "Raison de l'absence"
 *                   RaisonPresenceManuel: "Raison de la présence manuelle"
 *                   disponibilite: false
 *                   choriste: "choriste_id"
 *                   repetition: "repetition_id"
 *                   concert: "concert_id"
 *       400:
 *         description: Échec de la requête
 */


router.post('/demandeAbsence', jwtcontro.loggedMiddleware,jwtcontro.isChoriste,absprController.demanderAbsence);



/**
 * @swagger
 * /api/absencepresence/getAllDemandeAbsence:
 *   get:
 *     summary: Récupère toutes les demandes d'absence
 *     tags: [Absences]
 *     security:
 *       - radiotherapie: []
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Absence'
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/getAllDemandeAbsence', jwtcontro.loggedMiddleware,jwtcontro.isAdmin,absprController.getAllDemandeAbsence);


module.exports = router;
