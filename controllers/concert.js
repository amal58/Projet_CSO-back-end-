const excel = require('exceljs');
const Concert =require("../models/concert")
const oeuvre=require("../models/oeuvre")
const repetition =require("../models/repitition") 
const choriste =require("../models/choriste") 

const fetchConcert =(req,res)=>{
    Concert.find()
    .populate("programme")    
    .populate("repetition")    
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
     .populate("repetition")    
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



//modifier
const UpdateConcert=(req, res) => {
    Concert.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
      .then((concert) => {
        if (!concert) {
          res.status(404).json({
            message: "concert not found ",
          });
          return;
        }
        res.status(200).json({
          model: concert,
          message: "concert updated",
        });
      })
      .catch((error) =>
        res.status(400).json({
          error: error.message,
          message: "concert not correct",
        })
      );
  }


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


// ****************************

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
          repetition: req.body.repetition,
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


// **************************


 module.exports={
    fetchConcert:fetchConcert,
    addConcert:addConcert,
    getConcertById:getConcertById,
    UpdateConcert:UpdateConcert,
    DeleteConcert:DeleteConcert,
    addProgramExcel: addProgramExcel,

 }