const { Repetition, repetitionValidationSchema } = require('../models/repetition');

exports.createRepetition = async (req, res) => {
    // Valider les données de la requête
    const { error } = repetitionValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        // Générer l'URLQR aléatoire
        const urlQR = generateRandomURL();

        // Récupérer les données du corps de la requête
        const { heureDebut, heureFin, date, lieu, programme, concert } = req.body;

        // Créer un nouvel objet Repetition
        const nouvelleRepetition = new Repetition({
            heureDebut,
            heureFin,
            date,
            lieu,
            programme,
            concert,
            urlQR,
        });

        // Enregistrer la répétition dans la base de données
        const repetitionEnregistree = await nouvelleRepetition.save();

        res.status(201).json({
            repetition: repetitionEnregistree,
            message: "Répétition créée avec succès !",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fonction pour générer une chaîne de caractères aléatoire pour l'URLQR
function generateRandomURL() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomURL = 'https:';

    for (let i = 0; i < 10; i++) {
        randomURL += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    randomURL += '.com'; // Ajoutez le domaine à la fin

    return randomURL;
}
