const app = require("./app");
const http = require('http');
const socketIo = require('socket.io');
const schedule = require('node-schedule');
const Repetition  = require('./models/repetition');
const Personne = require('./models/personne');
const Choriste =  require('./models/choriste');
const Conge =  require('./models/conge');
const server = http.createServer(app);
const io = socketIo(server);
app.io = io;
const ioRepetition = io.of('/repetition');
const ioNotification = io.of('/notification');
const moment = require('moment');
const jwtcontro=require("./middlewares/UserAuth")

app.get('/NotifRep/', (req, res) => {
    res.sendFile(__dirname + '/views/NotifRep.html');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/notifUrgente.html');
});
ioRepetition.on('connection', (socket) => {
    console.log('Nouvelle connexion socket pour les répétitions :', socket.id);
    socket.on('disconnect', () => {
        console.log('Déconnexion socket pour les répétitions :', socket.id);
    });
});

ioNotification.on('connection', (socket) => {
    console.log('Nouvelle connexion socket pour les notifications :', socket.id);
    socket.on('disconnect', () => {
        console.log('Déconnexion socket pour les notifications :', socket.id);
    });
});


async function creerTacheRappel(repetition, option) {
    try {
        const { heureprgrm, repetitions, message } = option;
        const { date, heureDebut, lieu, choriste } = repetition;
        const momentDate = moment(date);
        const momentDateHeureDebut = momentDate
            .set('hour', parseInt(heureDebut.split(':')[0]))
            .set('minute', parseInt(heureDebut.split(':')[1]));
        if (momentDateHeureDebut.isBefore(moment())) {
            console.log(`La date et l'heure de début sont déjà passées pour : ${message}`);
            return;
        }

        const differenceHeures = momentDateHeureDebut.diff(moment(), 'hours');

        if (differenceHeures <= 24) {
            for (const choristeId of choriste) {
                const choriste = await Choriste.findOne({ _id: choristeId });
                const personne = await Personne.findOne({ _id: choriste.candidatId });
                const Pcong = await Conge.findOne({ choriste : choristeId                 });
                if(Pcong){
                    ioRepetition.emit('non', {
                        message: ` ${personne.email} "est en congé" `
                    });
                    console.log(personne.email+ " en congé ");
                }else{

                    const tacheSchedulee = schedule.scheduleJob(heureprgrm, async function () {
                       
                        ioRepetition.emit('notification', {
                            message: ` à ${personne.email} ${message} le ${momentDateHeureDebut.format('DD-MM-YYYY HH:mm:ss')}`
                        });
    
                    if (repetitions && repetitions > 1) {
                        for (let i = 2; i <= repetitions; i++) {
                            const tempsProchainRappel = new Date(heureprgrm);
                            tempsProchainRappel.setMinutes(tempsProchainRappel.getMinutes() + i * 300);
                            const job = schedule.scheduleJob(tempsProchainRappel, function () {
                                console.log(`Rappel supplémentaire exécuté : ${message}`);
                                ioRepetition.emit('notification', {
                                    message: ` à ${personne.email} ${message} le ${momentDateHeureDebut.format('DD-MM-YYYY HH:mm:ss')}`
                                });                         
                               });
                        }
                    }
                });
    
                console.log(`à ${personne.email}  Rappel pour repetition le :${momentDateHeureDebut.format('DD-MM-YYYY HH:mm:ss')}`);
                ioRepetition.emit('notification', {
                    message: ` à ${personne.email} Rappel pour repetition : ${momentDateHeureDebut.format('DD-MM-YYYY HH:mm:ss')}`
                });

                }
        }  
        } else {
            console.log(`La différence en heures (${differenceHeures}) est supérieure à 24 heures pour : ${message}`);
        }

    } catch (error) {
        console.error('Erreur lors de la récupération des données de la répétition :', error);
    }
}

async function planifierToutesLesRepetitions() {
    try {
        const optionsRappel = {
            heureprgrm: new Date(Date.now() + 10000),
            repetitions: 10,
            message: "N'oubliez pas la repetition !",
        };

        const repetitions = await Repetition.find().exec();

        if (!repetitions || repetitions.length === 0) {
            console.log('Aucune répétition trouvée.');
            return;
        }

        repetitions.forEach((repetition) => {
            creerTacheRappel(repetition, optionsRappel);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des répétitions :', error);
    }
}

planifierToutesLesRepetitions();

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
        const { dateDebutConge, dateFinConge, etat } = req.body;

        if (new Date(dateFinConge) <= new Date(dateDebutConge)) {
            return res.status(400).json({ message: "Date de fin doit être supérieure à la date de début." });
        }

        const conge = new Conge({
            dateDebutConge,
            dateFinConge,
            etat,
            choriste: req.params.id
        });



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
                io.emit("notif_choriste", ` Cher choriste ${elem.choriste.candidatId.nom} ${elem.choriste.candidatId.prenom} votre statut est inactif ${elem.choriste._id}`);
            }
        });
    } catch (e) {
        console.error("Une erreur s'est produite :", e);
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/test.html');
});

io.on('connection', (socket) => {
       const message = "Connexion notif";
   io.emit('notification', {message});

    console.log('Nouvelle connexion socket :', socket.id);

    socket.on('disconnect', () => {
        console.log('Déconnexion socket :', socket.id);
    });
});
const port =process.env.PORT|| 5000
app.set("port",port)

server.listen(port,()=>{
    console.log("listening on "+ port)
})