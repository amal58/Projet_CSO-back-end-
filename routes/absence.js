const express = require('express');
const router = express.Router();
const absenceController = require('../controllers/absence');
/**
 * @swagger
 * tags:
 *  name: Absence
 *  description: Gestion des Absences
 */
/**
 * @swagger
  * components:
 *   schemas:
 *     NewAbsence:
 *       type: object
 *       required:
 *         - etat
 *         - RaisonAbsence
 *       properties:
 *         etat:
 *           type: boolean
 *           description: État de l'absence
 *         RaisonAbsence:
 *           type: string
 *           description: Raison de l'absence
 *         RaisonPresenceManuel:
 *           type: string
 *           description: Raison de la présence manuelle
 *       example:
 *         etat: true
 *         RaisonAbsence: "Maladie"
 *         RaisonPresenceManuel: "Raison de la présence manuelle"
 * 
 *     Absence:
 *       allOf:
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: L'ID auto-généré de l'absence
 *         - $ref: '#/components/schemas/NewAbsence'
 */

// Route pour créer une absence
/**
 * @swagger
 * /absences/add/{id_repetition}/{urlQR}:
 *   post:
 *     summary: Créer une nouvelle absence
 *     tags: [Absence]
 *     parameters:
 *       - in: path
 *         name: id_repetition
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la répétition
 *       - in: path
 *         name: urlQR
 *         schema:
 *           type: string
 *         required: true
 *         description: L'URL QR de la répétition
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewAbsence'
 *     responses:
 *       201:
 *         description: Présence créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Absence'
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Token invalide ou expiré
 *       404:
 *         description: Répétition ou choriste non trouvés
 *       500:
 *         description: Erreur serveur
 */
router.post('/add/:id_repetition/:urlQR', absenceController.createAbsence);


// router.post('/:id_repetition', absenceController.createAbsenceConcert);
/**
 * @swagger
 * /absences/confirm/{concertId}:
 *   post:
 *     summary: Confirmer la disponibilité pour un concert
 *     tags: [Absence]
 *     parameters:
 *       - in: path
 *         name: concertId
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du concert
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Confirmation de la disponibilité réussie
 *       400:
 *         description: La disponibilité a déjà été confirmée ou requête invalide
 *       401:
 *         description: Token invalide ou expiré
 *       404:
 *         description: Choriste, Concert ou Absence non trouvés
 *       500:
 *         description: Erreur serveur
 */
router.post('/confirm/:concertId', absenceController.confirmAbsence);
/**
 * @swagger
 * /absences/confirmation-absence/{compteId}/{concertId}:
 *   get:
 *     summary: Confirmer la disponibilité pour un choriste à un concert
 *     tags: [Absence]
 *     parameters:
 *       - in: path
 *         name: compteId
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du choriste
 *       - in: path
 *         name: concertId
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du concert
 *     responses:
 *       200:
 *         description: Confirmation de disponibilité réussie. Le choriste a été ajouté à la liste de disponibilité.
 *       404:
 *         description: Choriste ou Concert non trouvés
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/confirmation-absence/:compteId/:concertId', absenceController.confirmDispo);
/**
 * @swagger
 * /absences/modifychoristestate/{concertId}/{urlQR}:
 *   patch:
 *     summary: Modifier l'état de présence d'un choriste pour un concert
 *     tags: [Absence]
 *     parameters:
 *       - in: path
 *         name: concertId
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du concert
 *       - in: path
 *         name: urlQR
 *         schema:
 *           type: string
 *         required: true
 *         description: L'URL QR du concert
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: État de présence modifié avec succès
 *       400:
 *         description: L'URL QR ne correspond pas à celui du concert ou requête invalide
 *       401:
 *         description: Token invalide ou expiré
 *       404:
 *         description: Choriste, Concert ou Absence non trouvés
 *       500:
 *         description: Erreur interne du serveur
 */
router.patch('/modifychoristestate/:concertId/:urlQR', absenceController.modifyChoristeState);
/**
 * @swagger
 * /absences/choristesdispo/{concertId}:
 *   get:
 *     summary: Récupérer la liste des choristes disponibles pour un concert
 *     tags: [Absence]
 *     parameters:
 *       - in: path
 *         name: concertId
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du concert
 *     responses:
 *       200:
 *         description: Liste des choristes disponibles récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dispoChoristes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Choriste'
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/choristesdispo/:concertId', absenceController.getChoristesDispo);
/**
 * @swagger
 * /absences/listerDispoParTessitureEtConcert/{tessiture}/{concert}:
 *   get:
 *     summary: Récupérer la liste des absences par tessiture et concert
 *     tags: [Absence]
 *     parameters:
 *       - in: path
 *         name: tessiture
 *         schema:
 *           type: string
 *         required: true
 *         description: La tessiture à filtrer
 *       - in: path
 *         name: concert
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du concert
 *     responses:
 *       200:
 *         description: Liste des absences récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   choriste:
 *                     $ref: '#/components/schemas/Choriste'
 *                   tessiture:
 *                     type: string
 *                     description: Tessiture du choriste
 *                   nom:
 *                     type: string
 *                     description: Nom du choriste
 *                   prenom:
 *                     type: string
 *                     description: Prénom du choriste
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/listerDispoParTessitureEtConcert/:tessiture/:concert', absenceController.listerAbsencesParTessitureEtConcert);
/**
 * @swagger
 * /absences/ajouterPresencePourChoriste:
 *   post:
 *     summary: Ajouter la présence d'un choriste à une répétition manuellement
 *     tags: [Absence]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               choristeId:
 *                 type: string
 *                 description: L'ID du choriste
 *                 example: "6123456789abcdef12345678"
 *               RaisonPresenceManuel:
 *                 type: string
 *                 description: La raison de la présence manuelle (facultatif)
 *                 example: "Présence confirmée manuellement"
 *               repetitionId:
 *                 type: string
 *                 description: L'ID de la répétition
 *                 example: "6123456789abcdef12345679"
 *     responses:
 *       200:
 *         description: Présence ajoutée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 absence:
 *                   $ref: '#/components/schemas/Absence'
 *                 message:
 *                   type: string
 *                   description: Message de succès
 *                   example: "Présence ajoutée avec succès"
 *       400:
 *         description: Requête invalide ou ID du choriste manquant
 *       403:
 *         description: Accès non autorisé ou tessiture non autorisée pour le choriste
 *       404:
 *         description: Audition, Document CandA, Choriste, ou Répétition non trouvés
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/ajouterPresencePourChoriste', absenceController.ajouterpresenceRepetionPourChoriste);
/**
 * @swagger
 * /absences/presenceManellement/{concertId}:
 *   patch:
 *     summary: Modifier manuellement la présence d'un choriste à un concert
 *     tags: [Absence]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: concertId
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du concert
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               choristeId:
 *                 type: string
 *                 description: L'ID du choriste
 *                 example: "6123456789abcdef12345678"
 *               RaisonPresenceManuel:
 *                 type: string
 *                 description: La raison de la présence manuelle
 *                 example: "Présence confirmée manuellement"
 *     responses:
 *       200:
 *         description: Présence modifiée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message de succès
 *                   example: "Presence modifiée avec succès"
 *       400:
 *         description: Requête invalide ou ID du choriste manquant
 *       403:
 *         description: Accès non autorisé ou tessiture non autorisée pour le choriste
 *       404:
 *         description: Audition, Document CandA, Choriste, ou Concert non trouvés
 *       500:
 *         description: Erreur interne du serveur
 */
router.patch('/presenceManellement/:concertId', absenceController.modifierpresenceConcertPourChoriste);

/**
 * @swagger
 * /absences/Statistiques-concerts-repetitions/{choristeId}:
 *   get:
 *     summary: Obtient les statistiques des concerts et répétitions pour un choriste
 *     tags: [Absence]
 *     parameters:
 *       - in: path
 *         name: choristeId
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du choriste
 *     responses:
 *       200:
 *         description: Succès de la récupération des statistiques
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 presences:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Absence'
 *                   description: Liste des présences confirmées
 *                 maitriseOeuvre:
 *                   type: boolean
 *                   description: Indique si le choriste a une maîtrise d'oeuvre
 *                 repetitionsPresencesIds:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Liste des IDs des répétitions avec présence confirmée
 *                 concertsPresencesIds:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Liste des IDs des concerts avec présence confirmée
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/Statistiques-concerts-repetitions/:choristeId', absenceController.getAbsencesAndConcertsAndRepetitions);
/**
 * @swagger
 * /absences/statistique-concert/{concertId}:
 *   get:
 *     summary: Obtient les statistiques d'absence et de présence pour un concert
 *     tags: [Absence]
 *     parameters:
 *       - in: path
 *         name: concertId
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du concert
 *     responses:
 *       200:
 *         description: Succès de la récupération des statistiques du concert
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nombrePresence:
 *                   type: integer
 *                   description: Le nombre de choristes présents au concert
 *                 nombreAbsence:
 *                   type: integer
 *                   description: Le nombre de choristes absents au concert
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/statistique-concert/:concertId', absenceController.statistiqueConcert);
/**
 * @swagger
 * /absences/statistique-repetition/{repetitionId}:
 *   get:
 *     summary: Obtient les statistiques d'absence et de présence pour une répétition
 *     tags: [Absence]
 *     parameters:
 *       - in: path
 *         name: repetitionId
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la répétition
 *     responses:
 *       200:
 *         description: Succès de la récupération des statistiques de la répétition
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nombrePresence:
 *                   type: integer
 *                   description: Le nombre de choristes présents à la répétition
 *                 nombreAbsence:
 *                   type: integer
 *                   description: Le nombre de choristes absents à la répétition
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/statistique-repetition/:repetitionId', absenceController.statistiqueRepetition);
/**
 * @swagger
 * /absences/statistique-oeuvre/{oeuvreId}:
 *   get:
 *     summary: Obtient les statistiques d'absence et de présence pour une œuvre
 *     tags: [Absence]
 *     parameters:
 *       - in: path
 *         name: oeuvreId
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de l'œuvre
 *     responses:
 *       200:
 *         description: Succès de la récupération des statistiques de l'œuvre
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statsRepetitions:
 *                   type: object
 *                   properties:
 *                     nombrePresence:
 *                       type: integer
 *                       description: Le nombre de choristes présents aux répétitions de l'œuvre
 *                     nombreAbsence:
 *                       type: integer
 *                       description: Le nombre de choristes absents aux répétitions de l'œuvre
 *                 statsConcerts:
 *                   type: object
 *                   properties:
 *                     nombrePresence:
 *                       type: integer
 *                       description: Le nombre de choristes présents aux concerts de l'œuvre
 *                     nombreAbsence:
 *                       type: integer
 *                       description: Le nombre de choristes absents aux concerts de l'œuvre
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/statistique-oeuvre/:oeuvreId", absenceController.statistiqueOeuvre);
/**
 * @swagger
 * /absences/absences-repetition:
 *   get:
 *     summary: Obtient la liste des absences pour les répétitions
 *     tags: [Absence]
 *     responses:
 *       200:
 *         description: Succès de la récupération des absences pour les répétitions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AbsenceRepetition'
 *       500:
 *         description: Erreur interne du serveur
 *
 * components:
 *   schemas:
 *     AbsenceRepetition:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: L'ID de l'absence
 *         etat:
 *           type: boolean
 *           description: L'état de l'absence (true pour présence, false pour absence)
 *         choriste:
 *           $ref: '#/components/schemas/Choriste'
 *         repetition:
 *           $ref: '#/components/schemas/Repetition'
 *         CurrentDate:
 *           type: string
 *           format: date-time
 *           description: La date actuelle de l'absence
 *         RaisonAbsence:
 *           type: string
 *           description: La raison de l'absence
 *         RaisonPresenceManuel:
 *           type: string
 *           description: La raison de la présence manuelle
 */
router.get('/absences-repetition', absenceController.AbsenceRepetition);
/**
 * @swagger
 * /absences/absences-repetition-choriste/{choristeId}:
 *   get:
 *     summary: Obtient la liste des absences pour les répétitions d'un choriste spécifique
 *     tags: [Absence]
 *     parameters:
 *       - in: path
 *         name: choristeId
 *         required: true
 *         description: L'ID du choriste
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Succès de la récupération des absences pour les répétitions du choriste
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AbsenceRepetition'
 *       500:
 *         description: Erreur interne du serveur
 *
 * components:
 *   schemas:
 *     AbsenceRepetition:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: L'ID de l'absence
 *         etat:
 *           type: boolean
 *           description: L'état de l'absence (true pour présence, false pour absence)
 *         choriste:
 *           $ref: '#/components/schemas/Choriste'
 *         repetition:
 *           $ref: '#/components/schemas/Repetition'
 *         CurrentDate:
 *           type: string
 *           format: date-time
 *           description: La date actuelle de l'absence
 *         RaisonAbsence:
 *           type: string
 *           description: La raison de l'absence
 *         RaisonPresenceManuel:
 *           type: string
 *           description: La raison de la présence manuelle
 */
router.get('/absences-repetition-choriste/:choristeId', absenceController.AbsenceRepetitionChoriste);
/**
 * @swagger
 * /absences/absences-choristes/{tessiture}:
 *   get:
 *     summary: Obtient la liste des absences pour les choristes par tessiture spécifique
 *     tags: [Absence]
 *     parameters:
 *       - in: path
 *         name: tessiture
 *         required: true
 *         description: La tessiture pour laquelle récupérer les absences
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Succès de la récupération des absences pour les choristes par tessiture
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AbsenceChoristesParTessiture'
 *       500:
 *         description: Erreur interne du serveur
 *
 * components:
 *   schemas:
 *     AbsenceChoristesParTessiture:
 *       type: object
 *       properties:
 *         choriste:
 *           $ref: '#/components/schemas/Choriste'
 *         tessiture:
 *           type: string
 *           description: La tessiture du choriste
 *         nom:
 *           type: string
 *           description: Le nom du choriste
 *         prenom:
 *           type: string
 *           description: Le prénom du choriste
 *         // Ajoutez d'autres champs si nécessaire
 */
router.get('/absences-choristes/:tessiture', absenceController.absencesChoristesParTessiture);
/**
 * @swagger
 * /absences/absencesRepetitionDate/{date}:
 *   get:
 *     summary: Obtient la liste des absences pour les répétitions à une date spécifique
 *     tags: [Absence]
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         description: La date pour laquelle récupérer les absences des répétitions
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Succès de la récupération des absences pour les répétitions à la date spécifiée
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AbsenceRepetitionDate'
 *       500:
 *         description: Erreur interne du serveur
 *
 * components:
 *   schemas:
 *     AbsenceRepetitionDate:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: L'ID de l'absence
 *         repetitionId:
 *           type: string
 *           description: L'ID de la répétition associée à l'absence
 *         choristeId:
 *           type: string
 *           description: L'ID du choriste associé à l'absence
 *         etat:
 *           type: boolean
 *           description: État de l'absence (true pour présence, false pour absence)
 *         // Ajoutez d'autres propriétés spécifiques à votre objet d'absence pour les répétitions à la date
 */
router.get("/absencesRepetitionDate/:date", absenceController.absencesRepetitionDate);
/**
 * @swagger
 * /absences/profil:
 *   get:
 *     summary: Obtient les statistiques de présence et d'absence d'un choriste
 *     tags: [Absence]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token d'authentification de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Succès de la récupération des statistiques de présence et d'absence
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nombrePresences:
 *                   type: integer
 *                   description: Nombre total de présences du choriste
 *                 nombreRepetitionsPresences:
 *                   type: integer
 *                   description: Nombre total de présences aux répétitions du choriste
 *                 repetitionsPresences:
 *                   type: array
 *                   description: Liste des répétitions auxquelles le choriste a participé
 *                   items:
 *                     $ref: '#/components/schemas/Repetition'
 *                 nombreConcertsPresences:
 *                   type: integer
 *                   description: Nombre total de présences aux concerts du choriste
 *                 concertsPresences:
 *                   type: array
 *                   description: Liste des concerts auxquels le choriste a participé
 *                   items:
 *                     $ref: '#/components/schemas/Concert'
 *                 nombreConcertsParticipes:
 *                   type: integer
 *                   description: Nombre total de concerts auxquels le choriste a participé
 *                 concertsParticipes:
 *                   type: array
 *                   description: Liste des concerts auxquels le choriste a participé, avec détails
 *                   items:
 *                     $ref: '#/components/schemas/ConcertParticipe'
 *       403:
 *         description: Accès non autorisé
 *       500:
 *         description: Erreur interne du serveur
 *
 * components:
 *   schemas:
 *     Repetition:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: L'ID de la répétition
 *         // Ajoutez d'autres propriétés spécifiques à votre objet de répétition
 *     Concert:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: L'ID du concert
 *         // Ajoutez d'autres propriétés spécifiques à votre objet de concert
 *     ConcertParticipe:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: L'ID du concert
 *         etat:
 *           type: boolean
 *           description: État de participation du choriste au concert
 *         // Ajoutez d'autres propriétés spécifiques à votre objet de concert avec détails
 */

router.get('/profil', absenceController.statspresenceChoriste);

module.exports = router;
