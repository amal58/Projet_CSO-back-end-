const excel = require('exceljs');
const { Concert } =require("../models/concert")
const mongoose = require('mongoose');
const {AbsencePresence} = require("../models/absencepresence");
const Personne= require("../models/personne");
const Audition= require("../models/audition");
const AudCandidat= require("../models/candidatAudition");
const Choriste= require("../models/choriste");

const fetchConcert =(req,res)=>{
    Concert.find()
    .populate("programme")    
    .populate("concert")    
    .populate("choriste")    
      .then((concerts) =>
        res.status(200).json({
          model: concerts,
          message: "success",
        })
      )
      .catch((error) => {
        res.status(400).json({
          error: error.message,
          message: "probleme d'extraction",
        });
      });
    }
const getConcertById=(req,res)=>{
    Concert.findOne({_id:req.params.id})
     .populate("programme")    
     .populate("concert")    
     .populate("choriste")  
    .then((concerts) => {
      if(!concerts){
        res.status(404).json({
          message:"task non trouve"
        })
        return
      }
  
     res.status(200).json({
      model: concerts,
      message:"objet trouve"
     })
   })
   .catch((error) => {
   
     res.status(400).json({
       error:error.message,
       message:"probleme ",
     });
   });
  }

  const addConcert= (req, res) => {
    const concert = new Concert(req.body);
    concert
      .save()
      .then(() =>
        res.status(201).json({
          model: concert,
          message: "Created!",
        })
      )
      .catch((error) => {
        res.status(400).json({
          error: error.message,
          message: "Données invalides",
        });
      });
  }

const UpdateConcert = async (req, res) => {
  try {
    const io = req.app.io; 
    const ioNotification = io.of('/notification');
    const val = req.body ;
    const champModifie = Object.keys(val)[0]; 
    const nouvelleValeur = val[champModifie];
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log("ID non valide");
      return res.status(400).json({
        message: "ID non valide",
      });
    }    
    const conc = await Concert.findOne({ _id: req.params.id});
    if (!conc) {
      console.log("concert non trouvée");
      return res.status(404).json({
        message: "concert non trouvée",
      });
    }
    if(champModifie=="date"){
      const dateFromDatabase = new Date(conc.date);
      const nouvelleDate = new Date(nouvelleValeur);
      if (dateFromDatabase.getTime() == nouvelleDate.getTime()) {
            res.status(200).json({
            message: "Meme valeur a été saisi",
  });
}else{
  const concert = await Concert.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
  ioNotification.emit('notification', {
    message: `Concert  mise à jour : ${champModifie} a été changée  ${nouvelleValeur}`
  });

  console.log("concert mise à jour avec succès");
  res.status(200).json({
    model: concert,
    message: "concert mise à jour avec succès",
  });
}
    }
    else if (String(conc[champModifie]) === String(nouvelleValeur)) {
      res.status(200).json({
        message: "Meme valeur a été saisi",
      });
    }
    else if(! conc[champModifie] ){
      res.status(200).json({
        message: "champs inexistant",
      });
    }
    else{
    const concert = await Concert.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    io.emit('notification', {
      message: `Concert  mise à jour : ${champModifie} a été changée  ${nouvelleValeur}`
    });

    console.log("concert mise à jour avec succès");
    res.status(200).json({
      model: concert,
      message: "concert mise à jour avec succès",
    });
   }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du concert:', error);
    res.status(400).json({
      error: error.message,
      message: "Erreur lors de la mise à jour du concert",
    });
  }
};

const DeleteConcert=(req, res) => {
    Concert.deleteOne({ _id: req.params.id })
      .then(() => 
      res.status(200).json({ message: "concert deleted" }))
      
      .catch((error) => {
        res.status(400).json({
          error: error.message,
          message: "Id concert not correct ",
        });
      });
  }

const addProgramExcel = (req, res) => {
  try {
    const filePath = decodeURIComponent(req.params.filePath);

    const workbook = new excel.Workbook();
    workbook.xlsx.readFile(filePath)
      .then(() => {
        const worksheet = workbook.getWorksheet(1);

        const programmeToAdd = [];

        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
            const oeuvreId = row.getCell(1).value;
            programmeToAdd.push(oeuvreId);
          }
        });

        const concertData = {
          date: req.body.date,
          lieu: req.body.lieu,
          affiche: req.body.affiche,
          concert: req.body.concert,
          choriste: req.body.choriste,
          programme: programmeToAdd,
        };

        const concert = new Concert(concertData);
        return concert.save();
      })
      .then((savedConcert) => {
        res.status(201).json({
          model: savedConcert,
          message: "Concert créé avec succès depuis Excel",
        });
      })
      .catch((error) => {
        console.error('Erreur lors de la création du concert depuis Excel :', error);
        res.status(500).json({
          error: error.message,
          message: "Erreur interne du serveur",
        });
      });
  } catch (error) {
    console.error('Erreur lors de la récupération du chemin du fichier :', error.message);
    res.status(500).json({
      error: error.message,
      message: "Erreur interne du serveur",
    });
  }
};


const ajoutplacement = async (req, res) =>{
    try{
      let candidat=[]
      let dispo=[]
      let user=[]
      let Aud=[]
        const existe_Concert=await AbsencePresence.find({concert:req.params.id,disponibilite:true}).populate("choriste").populate("concert")

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

  module.exports={
    fetchConcert:fetchConcert,
    addConcert:addConcert,
    getConcertById:getConcertById,
    UpdateConcert:UpdateConcert,
    DeleteConcert:DeleteConcert,
    addProgramExcel: addProgramExcel,
    ajoutplacement:ajoutplacement,

 }