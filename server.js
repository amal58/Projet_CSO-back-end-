const app = require("./app");
const http = require('http');
const socketIo = require('socket.io');
const schedule = require('node-schedule');
const { Repetition } = require('./models/repetition');
const moment = require('moment-timezone');

const server = http.createServer(app);
const io = socketIo(server);
app.io = io;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/notifUrgente.html');
});


io.on('connection', (socket) => {
    console.log('Nouvelle connexion socket :', socket.id);
    socket.emit('notification', { message: ' ' });

    // Émettre une notification à chaque connexion
    io.emit('notification', { message: ' ' });

    socket.on('disconnect', () => {
        console.log('Déconnexion socket :', socket.id);
    });
});

async function creerTacheRappel(repetition,option) {
    try {
        const { heureprgrm , repetitions,  message } = option;
        const { date , heureDebut, lieu } = repetition;

 // Convertir la date stockée en base de données en objet moment
 const momentDate = moment(date);

 // Utiliser le fuseau horaire de Tunis
 const momentDateTunis = momentDate.tz('Europe/Tunis');

 // Combiner la date, l'année, le mois, le jour et l'heure de début pour former un objet moment
 const momentDateHeureDebut = momentDateTunis
     .set('hour', parseInt(heureDebut.split(':')[0]))
     .set('minute', parseInt(heureDebut.split(':')[1]));

 // Afficher la date au format souhaité
 console.log(momentDateHeureDebut.format('YYYY-MM-DD HH:mm:ss'));

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
            const tacheSchedulee = schedule.scheduleJob(heureprgrm, function () {
                console.log(`Rappel programmé exécuté : ${message} le ${momentDateHeureDebut}`);
                const msg = "${message} le ${momentDateHeureDebut}"
                io.emit('notification', {
                    message: `${message} le ${momentDateHeureDebut.format('DD-MM-YYYY HH:mm:ss')}`
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

            console.log(`Rappel pour repetition le : ${momentDateHeureDebut.format('DD-MM-YYYY HH:mm:ss')}`);
            // Émettre une notification aux clients connectés
            io.emit('notification', {
                message: `Rappel pour repetition : ${momentDateHeureDebut.format('DD-MM-YYYY HH:mm:ss')}`
            });
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
