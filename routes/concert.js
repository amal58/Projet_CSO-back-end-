const express=require("express")
const router =express.Router()
const auth = require("../middlewares/UserAuth")
const concertController=require("../controllers/concert")
const socketIo = require('socket.io');

router.get("/",concertController.fetchConcert)
router.get("/:id",concertController.getConcertById)
router.post("/",concertController.addConcert)
router.post("/excel/:filePath",concertController.addProgramExcel)


/**
 * @swagger
 * /api/concert/{id}:
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
router.patch("/:id",auth.loggedMiddleware,auth.ischefpupitre,concertController.UpdateConcert)
router.delete("/:id",concertController.DeleteConcert)



  /**
 * @swagger
 * tags:
 *   name: Concerts
 *   description: API de gestion des concerts
 */
  /**
 * @swagger
 * components:
 *   schemas:
 *     Concert:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           description: Date du concert
 *         lieu:
 *           type: string
 *           description: Lieu du concert
 *         affiche:
 *           type: string
 *           description: URL de l'affiche du concert
 *         programme:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des IDs des œuvres programmées
 *         urlQR:
 *           type: string
 *           description: URL du code QR du concert
 *       example:
 *         date: "2023-01-01"
 *         lieu: "Sample Location"
 *         affiche: "https://example.com/affiche"
 *         programme:
 *           - "60768d8859f6a29308c1dafe"
 *           - "60768d8859f6a29308c1db01"
 *         urlQR: "https://example.com/qrcode"
 */



/**
 * @swagger
 * /api/concert/ajoutplacement/{id}:
 *   get:
 *     summary: Générer le placement pour un concert
 *     tags: [Concerts]
 *     security:
 *       - radiotherapie: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: ID du concert
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             example:
 *               reponse: [[{nom: "Nom1", prenom: "Prenom1", taille: 170, tessiture: "soprano"}, ...], ...]
 *               message: "succes retour"
 *       400:
 *         description: Échec de la génération du placement
 *         content:
 *           application/json:
 *             example:
 *               message: "failed"
 */
router.get("/ajoutplacement/:id",auth.loggedMiddleware,auth.isAdmin,concertController.ajoutplacement)
module.exports=router