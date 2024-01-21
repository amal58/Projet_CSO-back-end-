const app =require("./app")
const schedule = require('node-schedule');
const moment = require('moment');
const jwtcontro=require("./middlewares/UserAuth")
const Conge= require('./models/conge');
const http = require('http');
const Choriste = require('./models/choriste');
const Personne = require('./models/personne');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
 /**
 * @swagger
 * tags:
 *   name: Congés
 *   description: API de gestion des congés
 */


/**
 * 
 * @swagger
 * components:
 *   schemas:
 *     Conge:
 *       type: object
 *       properties:
 *         dateDebutConge:
 *           type: string
 *           format: date-time
 *         dateFinConge:
 *           type: string
 *           format: date-time
 *         etat:
 *           type: string
 *           enum: ['en attente', 'accepte']
 *         choriste:
 *           type: string
 *           description: ID du choriste
 *
 *     CongeRequest:
 *       type: object
 *       properties:
 *         dateDebutConge:
 *           type: string
 *           format: date-time
 *         dateFinConge:
 *           type: string
 *           format: date-time
 *         etat:
 *           type: string
 *           enum: ['en attente', 'accepte']
 *       required:
 *         - dateDebutConge
 *         - dateFinConge
 */


const port =process.env.PORT|| 5000
app.set("port",port)

server.listen(port,()=>{
    console.log("listening on "+ port)
})




/**
 * @swagger
 * /ajouteconger/{id}:
 *   post:
 *     summary: Ajoute une demande de congé pour un choriste
 *     tags: [Conges]
 *     security:
 *       - radiotherapie: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du choriste
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CongeRequest'
 *     responses:
 *       200:
 *         description: Succès de l'ajout de la demande de congé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message de succès
 *                 response:
 *                   $ref: '#/components/schemas/Conge'
 *       400:
 *         description: Échec de la requête
 */

app.post ("/ajouteconger/:id",jwtcontro.loggedMiddleware,jwtcontro.isChoriste, async (req, res) =>{
    try{
        const conge = new Conge({
            dateDebutConge: req.body.dateDebutConge,
            dateFinConge: req.body.dateFinConge,
            etat: req.body.etat,
            choriste: req.params.id
        })
       const resultat = await  conge.save();
       const choriste=  await Choriste.findOne({_id: req.params.id}).populate("candidatId")
       if(choriste){
            io.emit("new_notification","Vous avez une nouvelle demande de conge")
     }
    res.status(200).json({
        message: "bien retourner",
        response: resultat
    })
}
    catch(e){
console.log(e);
    }
})

io.on("connection",Socket=>{
 
    schedule.scheduleJob('* * * * *', async()=>{
     try {
         const tab = [];
         const existcongee =  await Conge.find({etat:'en attente'}).populate({ 
            path: 'choriste',
            populate: {
              path: 'candidatId',
            } 
         });
       
         Socket.emit("list",existcongee)
     } catch (e) {
         console.error("Une erreur s'est produite :", e);
     }
    })
})
 

schedule.scheduleJob('*/2 * * * *', async () => { 
    try {
        const date = moment();
        const today = moment();
        console.log(date)
        const existe_congées = await Conge.find({
            etat: "accepte",
            dateFinConge: { $gt: date }
        }).populate({ 
            path: 'choriste',
            populate: {
              path: 'candidatId',
            } 
         });

        existe_congées.map(async (elem) => {
            console.log(elem);
            console.log(elem.dateDebutConge);
            console.log(today);

            const diff = moment(elem.dateDebutConge).diff(today, 'minutes'); 
            console.log(diff);

            if (diff === 0 || (diff > 0 && diff < 3)&& elem.choriste.EtatConge==false) {
                console.log("succes");
                try {
              await    Choriste.findByIdAndUpdate({ _id: elem.choriste._id }, { EtatConge: true });}
                catch (error) {
                    console.error("Erreur lors de la mise à jour du statut :", error);
                }
                io.emit("notif_congé", `congée de maintenant a ${elem.dateFinConge}`);
                io.emit("notif_choriste", ` monsieur votre statut est inactif ${elem.choriste._id}`);
            }
        });
    } catch (e) {
        console.error("Une erreur s'est produite :", e);
    }
});
