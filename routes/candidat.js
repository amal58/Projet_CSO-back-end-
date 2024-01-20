const express = require('express');
const personneController = require('../controllers/candidat');
const auth = require('../middlewares/auth');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Personne
 *   description: Gestion des Personnes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Personne:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the person
 *         email:
 *           type: string
 *           description: Email of the person
 *         nom:
 *           type: string
 *           description: Last name of the person
 *         prenom:
 *           type: string
 *           description: First name of the person
 *         nomJeuneFille:
 *           type: string
 *           description: Maiden name of the person
 *         sexe:
 *           type: string
 *           enum: ['Homme', 'Femme']
 *           description: Gender of the person
 *         dateNaissance:
 *           type: string
 *           format: date
 *           description: Date of birth of the person
 *         Nationalite:
 *           type: string
 *           description: Nationality of the person
 *         taille:
 *           type: number
 *           description: Height of the person
 *         telephone:
 *           type: string
 *           description: Telephone number of the person
 *         cin:
 *           type: string
 *           description: National Identity Card (CIN) of the person
 *         situationPro:
 *           type: string
 *           description: Professional situation of the person
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time of creation of the person's record
 */


/**
 * @swagger
 * paths:
 *   /candidats/:
 *     get:
 *       summary: Récupérer tous les candidats
 *       tags:
 *         - Personne
 *       responses:
 *         '200':
 *           description: Candidats récupérés avec succès
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Tous les candidats récupérés avec succès
 *                   auditions:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Personne'
 *         '500':
 *           description: Erreur lors de la récupération des candidats
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Erreur lors de la récupération des candidats
 *                   error:
 *                     type: string
 *                     example: Message d'erreur détaillé
 */

router.get('/', personneController.getAllCandidats);

/**
 * @swagger
 * paths:
 *   /candidats/{sexe}:
 *     get:
 *       summary: Récupérer les candidats par sexe
 *       tags:
 *         - Personne
 *       parameters:
 *         - in: path
 *           name: sexe
 *           description: Sexe des candidats à récupérer
 *           schema:
 *             type: string
 *           required: true
 *           example: "Homme"
 *       responses:
 *         '200':
 *           description: Candidats récupérés avec succès par sexe
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Candidats récupérés avec succès par sexe
 *                   auditions:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Personne'
 *         '500':
 *           description: Erreur lors de la récupération des candidats par sexe
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Erreur lors de la récupération des candidats par sexe
 *                   error:
 *                     type: string
 *                     example: Message d'erreur détaillé
 */

router.get('/:sexe', personneController.getCandidatsBySexe);

/**
 * @swagger
 * paths:
 *   /candidats/id/{id}:
 *     get:
 *       summary: Récupérer un candidat par ID
 *       tags:
 *         - Personne
 *       parameters:
 *         - in: path
 *           name: id
 *           description: ID du candidat à récupérer
 *           schema:
 *             type: string
 *           required: true
 *           example: "5f5ebdb5-43ab-4e4e-9cf1-2b2c7d94d1a0"
 *       responses:
 *         '200':
 *           description: Candidat récupéré avec succès par ID
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Candidat récupéré avec succès par ID
 *                   candidat:
 *                     $ref: '#/components/schemas/Personne'
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
 *           description: Erreur lors de la récupération du candidat par ID
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Erreur lors de la récupération du candidat par ID
 *                   error:
 *                     type: string
 *                     example: Message d'erreur détaillé
 */

router.get('/id/:id', personneController.getCandidatByid);

/**
 * @swagger
 * paths:
 *   /candidats/ajout:
 *     post:
 *       summary: Ajouter un nouveau candidat
 *       tags:
 *         - Personne
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewPersonne'
 *       responses:
 *         '201':
 *           description: Candidat créé avec succès
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   model:
 *                     $ref: '#/components/schemas/Personne'
 *                   message:
 *                     type: string
 *                     example: Candidat créé !
 *         '400':
 *           description: Problème lors de la création du candidat
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Message d'erreur détaillé
 *                   message:
 *                     type: string
 *                     example: Problème lors de la création du Candidat
 */

router.post('/ajout', personneController.AjoutCandidat);

module.exports = router;
