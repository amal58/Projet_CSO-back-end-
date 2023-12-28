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
    // Émettre une notification à chaque connexion
    socket.on('disconnect', () => {
        console.log('Déconnexion socket :', socket.id);
    });
});

async function creerTacheRappel(repetition, option) {
    try {
        const { heureprgrm, repetitions, message } = option;
        const { date, heureDebut, lieu, choriste } = repetition;

        // Convertir la date stockée en base de données en objet moment
        const momentDate = moment(date);

        // Combiner la date, l'année, le mois, le jour et l'heure de début pour former un objet moment
        const momentDateHeureDebut = momentDate
            .set('hour', parseInt(heureDebut.split(':')[0]))
            .set('minute', parseInt(heureDebut.split(':')[1]));

        // Afficher la date au format souhaité
        //console.log(momentDateHeureDebut.format('YYYY-MM-DD HH:mm:ss'));

        // Vérifier si la date et l'heure de début ne sont pas dans le passé
        if (momentDateHeureDebut.isBefore(moment())) {
            console.log(`La date et l'heure de début sont déjà passées pour : ${message}`);
            return;
        }

        // Calculer la différence en heures entre la date actuelle et la date de début
        const differenceHeures = momentDateHeureDebut.diff(moment(), 'hours');

        // Vérifier si la différence est inférieure ou égale à 24 heures
        if (differenceHeures <= 24) {
            // Planifier une tâche pour exécuter la fonction de rappel
            for (const choristeId of choriste) {
                const choriste = await Choriste.findOne({ _id: choristeId });
                const personne = await Personne.findOne({ _id: choriste.candidatId });
                const Pcong = await Conge.findOne({ choriste : choristeId });
                //console.log("conge"+Pcong);
                if(Pcong){
                    console.log(personne.email+ " en congé ");
                }else{

                    const tacheSchedulee = schedule.scheduleJob(heureprgrm, async function () {
                        // Utilisez await pour accéder au résultat de la requête
                       
                        io.emit('notification', {
                            message: ` à ${personne.email} ${message} le ${momentDateHeureDebut.format('DD-MM-YYYY HH:mm:ss')}`
                        });
    
                    // Vérifier s'il reste des répétitions
                    if (repetitions && repetitions > 1) {
                        // Planifier des tâches de rappel supplémentaires avec un intervalle
                        for (let i = 2; i <= repetitions; i++) {
                            const tempsProchainRappel = new Date(heureprgrm);
                            tempsProchainRappel.setMinutes(tempsProchainRappel.getMinutes() + i * 300);
                            const job = schedule.scheduleJob(tempsProchainRappel, function () {
                                console.log(`Rappel supplémentaire exécuté : ${message}`);
                                io.emit('notification', { message });
                            });
                        }
                    }
                });
    
                console.log(`à ${personne.email}  Rappel pour repetition le :${momentDateHeureDebut.format('DD-MM-YYYY HH:mm:ss')}`);
                // Émettre une notification aux clients connectés
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
            heureprgrm: new Date(Date.now() + 5000),
            repetitions: 3,
            message: "N'oubliez pas la repetition demain !",
        };

        const repetitions = await Repetition.find().exec();

        if (!repetitions || repetitions.length === 0) {
            console.log('Aucune répétition trouvée.');
            return;
        }

        repetitions.forEach((repetition) => {
            //console.log("1") ;
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
