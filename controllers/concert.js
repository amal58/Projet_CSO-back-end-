const mongoose = require("mongoose");
const Concert = require("../models/concert");
const Abpr = require("../models/absencepresence");
const Personne= require("../models/personne");
const Audition= require("../models/audition");
const AudCandidat= require("../models/candidatAudition");
const Choriste= require("../models/choriste");

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
      let candidat=[]
      let dispo=[]
      let user=[]
      let Aud=[]

        const existe_Concert=await Abpr.find({concert:req.params.id,etat:false}).populate("choriste").populate("concert")
        //console.log(existe_Concert)
       
      for (let i=0;i<existe_Concert.length;i++){
        let personne=await Personne.findById({_id:existe_Concert[i].choriste.candidatId})
        candidat.push({taille:personne.taille,nom:personne.nom,prenom:personne.prenom})
        user.push(personne)
      }
      for(let i=0;i<user.length;i++){
           let audition=await Audition.findOne({candidat:user[i]._id})
           Aud.push(audition)
      }
console.log(Aud);
      for(let i=0;i<Aud.length;i++){
        let audC=await AudCandidat.findOne({audition:Aud[i]._id})
        candidat[i].tessiture=audC.tessiture
   }


  
    candidat.sort((candidat1, candidat2) => {
      if (candidat1.taille !== candidat2.taille) {
          return candidat1.taille - candidat2.taille; 
      } else {
  
          const voixOrder = { "basse": 1, "tenor": 2, "alto": 3, "soprano": 4 };
         
          return voixOrder[candidat1.tessiture] - voixOrder[candidat2.tessiture];
      }
  });
  const pyramidHeight = 5; 
  let matrix = [];
  let counter = 0;
  
  
  for (let i = 1; i <= pyramidHeight; i++) {
      let row = [];
      for (let j = 1; j <= i; j++) {
          if (counter < candidat.length) {
              row.push(candidat[counter]);
              counter++;
          }
      }
      matrix.push(row);
  }
  matrix.forEach(row => {
    let rowData = "";
    row.forEach(candidat => {
        rowData += `${candidat.nom} ${candidat.prenom} (${candidat.taille}, ${candidat.tessiture})\t`;
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

