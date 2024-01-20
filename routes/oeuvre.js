const express=require("express")
const router =express.Router()

const OeuvreController=require("../controllers/oeuvre")
/**
 * @swagger
 * tags:
 *   name: Oeuvre
 *   description: Gestion des Œuvres Musicales
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Partie:
 *       type: object
 *       properties:
 *         estChoeur:
 *           type: boolean
 *           description: Indique si la partie est un chœur
 *         pupitres:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - Soprano
 *               - Alto
 *               - Ténor
 *               - Basse
 *           description: Liste des pupitres de la partie
 *       example:
 *         estChoeur: true
 *         pupitres: ["Soprano", "Alto"]

 *     Oeuvre:
 *       type: object
 *       required:
 *         - titre
 *         - anneeComposition
 *         - compositeurs
 *         - arrangeurs
 *         - genre
 *       properties:
 *         titre:
 *           type: string
 *           description: Titre de l'œuvre
 *         anneeComposition:
 *           type: integer
 *           format: int32
 *           description: Année de composition de l'œuvre
 *         compositeurs:
 *           type: array
 *           items:
 *             type: string
 *             description: Liste des compositeurs de l'œuvre
 *         arrangeurs:
 *           type: array
 *           items:
 *             type: string
 *             description: Liste des arrangeurs de l'œuvre
 *         genre:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - Symphonie chorale
 *               - Classique
 *               - Jazz
 *               - Opéra
 *               - Choral
 *               - Rock
 *           description: Genre de l'œuvre
 *         presence:
 *           type: boolean
 *           description: Indique la présence de l'œuvre
 *         paroles:
 *           type: array
 *           items:
 *             type: string
 *           description: Paroles de l'œuvre
 *         parties:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Partie'
 *           description: Liste des parties de l'œuvre
 *       example:
 *         titre: "Symphonie No. 9"
 *         anneeComposition: 1824
 *         compositeurs: ["Ludwig van Beethoven"]
 *         arrangeurs: ["Arrangeur1", "Arrangeur2"]
 *         genre: ["Classique"]
 *         presence: true
 *         paroles: ["Parole1", "Parole2"]
 *         parties:
 *           - estChoeur: true
 *             pupitres: ["Soprano", "Alto"]
 *           - estChoeur: false
 *             pupitres: ["Ténor", "Basse"]
 */


router.get("/AfficherTout",OeuvreController.AfficherToutOeuvre)   
router.get("/AfficherUne/:id",OeuvreController.AfficheUneOeuvre)
router.post("/ajouter",OeuvreController.AjoutOeuvre)        
router.patch("/modifier/:id",OeuvreController.MiseAjourOeuvre)
router.delete("/Supprimer/:id",OeuvreController.SuppOeuvre)



module.exports=router