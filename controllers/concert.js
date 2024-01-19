const mongoose = require("mongoose");
const Concert = require("../models/concert");

exports.createConcert = (req, res, next) => {
   
    const urlQR = generateRandomURL();

  
    const { date, lieu, affiche,programme } = req.body;

   
    const nouveauConcert = new Concert({
        date,
        lieu,
        affiche,
        programme,
        urlQR,
    });

    
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


function generateRandomURL() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomURL = 'https:';

    for (let i = 0; i < 10; i++) {
        randomURL += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    randomURL += '.com'; 

    return randomURL;
}
