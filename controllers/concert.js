const mongoose = require("mongoose");
const Concert = require("../models/concert");
const Abpr = require("../models/absencepresence");
const Personne= require("../models/");

exports.addConcert = (req, res, next) => {
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

// Fonction pour générer une chaîne de caractères aléatoire pour l'URLQR
function generateRandomURL() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomURL = 'https://';

    for (let i = 0; i < 10; i++) {
        randomURL += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    randomURL += '.com'; 

    return randomURL;
}
//ajout placement
exports. ajoutplacement = async (req, res) =>{
    try{
      let condidat=[]
      let dispo=[]
        const existe_Concert=await Abpr.find({concert:req.params.id,etat:false}).populate("concert").populate("choriste")
       
      for (let i=0;i<existe_Concert.length;i++){
        let personne=await Personne
      }
  
   // const existe_choriste=await Utilisateur.find({role:"choriste"}) 
  
    condidat.sort((candidat1, candidat2) => {
      if (candidat1.taille !== candidat2.taille) {
          return candidat1.taille - candidat2.taille; 
      } else {
  
          const voixOrder = { "basse": 1, "tenor": 2, "alto": 3, "soprano": 4 };
         
          return voixOrder[candidat1.tessitureVocale] - voixOrder[candidat2.tessitureVocale];
      }
  });
  const pyramidHeight = 5; 
  let matrix = [];
  let counter = 0;
  
  
  for (let i = 1; i <= pyramidHeight; i++) {
      let row = [];
      for (let j = 1; j <= i; j++) {
          if (counter < condidat.length) {
              row.push(condidat[counter]);
              counter++;
          }
      }
      matrix.push(row);
  }
  matrix.forEach(row => {
    let rowData = "";
    row.forEach(candidat => {
        rowData += `${candidat.nom} ${candidat.prenom} (${candidat.taille}, ${candidat.tessitureVocale})\t`;
    });
    console.log(rowData);
  });
  
  
  res.status(200).json({reponse:matrix,message:"succes retour"})
  
    }
    catch(error){
      console.log(error);
  res.status(400).json("faild")
    }
  }

