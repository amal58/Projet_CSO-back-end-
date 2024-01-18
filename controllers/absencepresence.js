const mongoose = require("mongoose");
const Abpr = require("../models/absencepresence");


exports.AjoutDispon = (req, res, next) => {
    
    const { etat,  choriste, concert } = req.body;

    const nouveauDispo = new Abpr({
        etat,
        choriste,
        concert,
    });

    nouveauDispo.save()
        .then(dispo => {
            res.status(201).json({
                Dispo: dispo ,
                message: "dispo créé avec succès !",
            });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
};


