const express=require("express")
const router =express.Router()
const concertController=require("../controllers/concert")
const jwtcontro=require("../middlewares/UserAuth")
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

router.post("/",concertController.addConcert)

/**
 * @swagger
 * /concert/ajoutplacement/{id}:
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
router.get("/ajoutplacement/:id",jwtcontro.loggedMiddleware,jwtcontro.isAdmin,concertController.ajoutplacement)


module.exports=router