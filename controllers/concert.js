const excel = require('exceljs');
const Concert =require("../models/concert")
// const Oeuvre =require("../models/") 
// const Repetition =require("../models/") 
// const Choriste =require("../models/") 

// ****************************


const addConcertsFromExcel = (req, res) => {
  const { filePath } = req.body; // Ensure the Excel file path is included in the request body

  const workbook = new excel.Workbook();
  workbook.xlsx.readFile(filePath)
    .then(() => {
      const worksheet = workbook.getWorksheet(1); // Assume data is in the first sheet

      const concertsToAdd = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { // Ignore header row
          const date = row.getCell(1).value;
          const lieu = row.getCell(2).value;
          const affiche = row.getCell(3).value;
          const programme = row.getCell(4).value;
          const repetition = row.getCell(5).value;
          const choriste = row.getCell(6).value;

          concertsToAdd.push({
            date,
            lieu,
            affiche,
            programme,
            repetition,
            choriste,
          });
        }
      });

      // Add concerts to the database
      return Concert.create(concertsToAdd);
    })
    .then((addedConcerts) => {
      res.status(201).json({
        model: addedConcerts,
        message: "Concerts added from Excel successfully",
      });
    })
    .catch((error) => {
      console.error('Error adding concerts from Excel:', error.message);
      res.status(500).json({
        error: error.message,
        message: "Internal Server Error",
      });
    });
};


// **************************


const fetchConcert =(req,res)=>{
    Concert.find()
    .populate("Oeuvre")    
    .populate("Repetition")    
    .populate("Choriste")    
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
    .populate("Oeuvre")    
    .populate("Repetition")    
    .populate("Choriste")  
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

 module.exports={
    fetchConcert:fetchConcert,
    addConcert:addConcert,
    getConcertById:getConcertById,
    UpdateConcert:UpdateConcert,
    DeleteConcert:DeleteConcert,
    addConcertsFromExcel: addConcertsFromExcel,

 }