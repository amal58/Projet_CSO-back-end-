const excel = require('exceljs');
const { Concert } =require("../models/concert")
const mongoose = require('mongoose');

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
  io.emit('notification', {
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

 module.exports={
    fetchConcert:fetchConcert,
    addConcert:addConcert,
    getConcertById:getConcertById,
    UpdateConcert:UpdateConcert,
    DeleteConcert:DeleteConcert,
    addProgramExcel: addProgramExcel,

 }