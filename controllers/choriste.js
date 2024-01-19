
const mongoose = require('mongoose');
const Choriste = require('../models/choriste');
const Audition = require('../models/audition');

const audition = require('../models/candidataudition');
const personne = require('../models/personne');
const Candidat = require('../models/personne');
const cron = require('node-cron');


const jwt=require ("jsonwebtoken")
const bcrypt = require ("bcryptjs");
const { log } = require('console');


exports.login= async (req,res,next)=>{
    try{
        const email=req.body.email
        const existChoriste= await Choriste.findOne({ login: email })
        const existUser= await personne.findOne({ email: email })
        if(!existChoriste && !existUser){
             return res.status(401).json({message:"user not found"})
        }
        if(existUser){
          const existPassword=await Choriste.findOne({candidatId:existUser._id})
          const password= await bcrypt.compare(req.body.password, existPassword.password)
          if(password){
           return  res.status(200).json({
                token: jwt.sign({ existUser: existPassword._id,role:existPassword.role}, "RANDOM_TOKEN_SECRET", {
                    expiresIn: "24h"
                }),
            });
          }else{
                 return res.status(400).json({message:"invalid password"})
          }}
        else if(existChoriste){
            const password=await bcrypt.compare(req.body.password, existChoriste.password)
            console.log(password);
            if(password){
             return  res.status(200).json({
                  token: jwt.sign({ existChoriste: existChoriste._id ,role:existChoriste.role}, "RANDOM_TOKEN_SECRET", {
                      expiresIn: "24h"
                  }),
              });
            }else{
                   return res.status(400).json({message:"failed to login"})
            }
          }
    }catch(error){
        console.log(error)
    return res.status(400).json({message:"failed!!!!!"})
    }

};
// const { getIoTessiture } = require("../socketTessiture");

exports.modifier_tessiture = async (req, res) => {
  try {
    const idChoriste = req.params.id;
    const tessiture = req.body.tessiture;

   
    const existChoriste = await Choriste.findById(idChoriste);

    if (!existChoriste) {
      return res.status(404).json({ message: "Choriste non trouvé" });
    }

    const existAudition = await Audition.findOne({
      candidat: existChoriste.candidatId,
    });

    if (!existAudition) {
      return res.status(404).json({ message: "Audition non trouvée" });
    }

    const existTessiture = await audition.findOne({
      audition: existAudition._id,
    });

    if (!existTessiture) {
      return res.status(404).json({ message: "Tessiture non trouvée" });
    }
    const candidatAssocie = await Candidat.findById(existChoriste.candidatId);

    if (!candidatAssocie) {
      return res.status(404).json({ message: "Candidat associé non trouvé" });
    }

    const fetchTessiture = await audition.findByIdAndUpdate(
      { _id: existTessiture._id },
      { tessiture: tessiture },
      { new: true }
    );

    // console.log('Tentative de modification de tessiture pour:', candidatAssocie.nom, candidatAssocie.prenom);


    notifierAuChefDePupitre(candidatAssocie.nom,candidatAssocie.prenom,tessiture);
    // console.log('Notification envoyée au chef de pupitre :', tessiture);

    return res.status(200).json({ message: "Tessiture modifiée", res: fetchTessiture });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
const notifierAuChefDePupitre = (nom, prenom, nouvelleTessiture) => {

  cron.schedule('*/1 * * * *', () => { 
    console.log(`Notification envoyée au chef de pupitre - ${nom} ${prenom} - Nouvelle tessiture : ${nouvelleTessiture}`);
  });
};

