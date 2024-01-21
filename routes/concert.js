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

module.exports=router