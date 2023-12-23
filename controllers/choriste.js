const mongoose = require('mongoose');
const Choriste = require('../models/choriste');
const Audition = require('../models/audition');
const audition = require('../models/candidatAudition');
const jwt=require ("jsonwebtoken")
const bcrypt = require ("bcrypt")

////////////get all choriste (role=choriste)

exports.GetAllChoristes = async (req, res) => {
    try {
      const tab = [];
      const allChoristes = await Choriste.find({role:"choriste"}).populate('candidatId');
      for (const elem of allChoristes) {
        const existAudition = await Audition.findOne({
          candidat: elem.candidatId._id
        });
        if (existAudition) {
          const existAuditionDetail = await audition.findOne({
            audition: existAudition._id
          });
  
          console.log(existAuditionDetail);
          tab.push({elem,existAuditionDetail});
        }
      }
      console.log(tab);
      res.status(200).json({ message: "extraction avec succes", resultat: tab });
    } catch (e) {
      console.error(e);
      res.status(400).json(e);
    }
  };
  
////////////////login choriste

  exports.login = (req, res, next) => {
    Choriste.findOne({ email: req.body.email })
        .then((choriste) => {
            if (!choriste) {
                return res.status(401).json({ message: "Login ou mot de passe incorrect" });
            }
            bcrypt.compare(req.body.password, choriste.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({ message: "Login ou mot de passe incorrect" });
                    }
                    res.status(200).json({
                        token: jwt.sign({ choristeId: user._id }, "RANDOM_TOKEN_SECRET", {
                            expiresIn: "24h"
                        }),
                    });
                })
                .catch((error) => {
                    res.status(500).json({ error: error });
                });
        })
        .catch((error) => {
            res.status(500).json({ error: error });
        });
}
















