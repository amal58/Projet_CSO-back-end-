const mongoose = require("mongoose");
const Concert = require("../models/concert");

exports.createConcert = (req, res, next) => {
    // Générer l'URLQR aléatoire
    const urlQR = generateRandomURL();

    // Récupérer les autres champs du corps de la requête
    const { date, lieu, affiche } = req.body;

    // Créer un nouvel objet Concert
    const nouveauConcert = new Concert({
        date,
        lieu,
        affiche,
        urlQR,
    });

    // Enregistrer le concert dans la base de données
    nouveauConcert.save()
        .then(concertEnregistre => {
            res.status(201).json({
                concert: concertEnregistre,
                message: "Concert créé avec succès !",
            });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
};