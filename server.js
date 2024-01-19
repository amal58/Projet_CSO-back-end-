const app = require("./app");
const http = require('http');
const socketIo = require('socket.io');
const schedule = require('node-schedule');
const { Repetition } = require('./models/repetition');
const moment = require('moment-timezone');
const Personne = require('./models/personne');
const Choriste =  require('./models/choriste');
const Conge =  require('./models/conge');

const server = http.createServer(app);
const io = socketIo(server);

app.io = io;

app.get('/NotifRep/', (req, res) => {
    res.sendFile(__dirname + '/views/NotifRep.html');
});


io.on('connection', (socket) => {
    console.log('Nouvelle connexion socket :', socket.id);
    socket.on('disconnect', () => {
        console.log('Déconnexion socket :', socket.id);
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
                    io.emit('non', {
                        message: ` ${personne.email} "est en congé" `
                    });
                    console.log(personne.email+ " en congé ");
                }else{

                    const tacheSchedulee = schedule.scheduleJob(heureprgrm, async function () {
                       
                        io.emit('notification', {
                            message: ` à ${personne.email} ${message} le ${momentDateHeureDebut.format('DD-MM-YYYY HH:mm:ss')}`
                        });
    
                    if (repetitions && repetitions > 1) {
                        for (let i = 2; i <= repetitions; i++) {
                            const tempsProchainRappel = new Date(heureprgrm);
                            tempsProchainRappel.setMinutes(tempsProchainRappel.getMinutes() + i * 15);
                            const job = schedule.scheduleJob(tempsProchainRappel, function () {
                                console.log(`Rappel supplémentaire exécuté : ${message}`);
                                io.emit('notification', {
                                    message: ` à ${personne.email} ${message} le ${momentDateHeureDebut.format('DD-MM-YYYY HH:mm:ss')}`
                                });                         
                               });
                        }
                    }
                });
    
                console.log(`à ${personne.email}  Rappel pour repetition le :${momentDateHeureDebut.format('DD-MM-YYYY HH:mm:ss')}`);
                io.emit('notification', {
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


const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Serveur écoutant sur le port ${PORT}`);
});
