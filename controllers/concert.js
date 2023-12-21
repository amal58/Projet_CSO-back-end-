const excel = require('exceljs');
const Oeuvre=require("../models/oeuvre")
const {Concert,concertSchemaValidation} =require("../models/concert")


const fetchConcert =(req,res)=>{
    Concert.find()
    .populate("programme")    
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
  
 
 
//ajout
  const addConcert = (req, res) => {
    const validationResult = concertSchemaValidation.validate(req.body);
    if (validationResult.error) {
      // Si la validation échoue, renvoyer une réponse avec les détails de l'erreur
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }
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
  };


//modifier
const UpdateConcert = (req, res) => {
  // Valider les données entrantes avec Joi
  const validationResult = concertSchemaValidation.validate(req.body);

  if (validationResult.error) {
    // Si la validation échoue, renvoyer une réponse avec les détails de l'erreur
    return res.status(400).json({ error: validationResult.error.details[0].message });
  }

  Concert.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((concert) => {
      if (!concert) {
        res.status(404).json({
          message: "concert not found",
        });
        return;
      }

      res.status(200).json({
        model: concert,
        message: "concert updated",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message,
        message: "concert not correct",
      });
    });
};
  
//supprimer
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
const addProgramExcel = async (req, res) => {
  try {
    const { excelPath, concertData } = req.body;
    const { date, lieu, choriste } = concertData;

    const workbook = new excel.Workbook();
    await workbook.xlsx.readFile(excelPath);

    const worksheet = workbook.getWorksheet(1);

    const concertProgram = [];
    const oeuvreIds = [];

    // Itération sur chaque ligne du fichier Excel
    for (let rowIndex = 2; rowIndex <= worksheet.actualRowCount; rowIndex++) {
      const row = worksheet.getRow(rowIndex);

      console.log(`Traitement de la ligne ${rowIndex}:`, row.values);

      try {
        const titre = row.getCell(1).value;
        const anneeComposition = row.getCell(2).value;
        const compositeurs = row.getCell(3).value;
        const arrangeurs = row.getCell(4).value;
        const genre = row.getCell(5).value;
        const presence = row.getCell(6).value;
        const paroles = row.getCell(7).value;
        const estChoeur = row.getCell(8).value || false;
        const pupitres = row.getCell(9).value || null;

        console.log('Valeurs extraites de la ligne:', {
          titre, anneeComposition, compositeurs, arrangeurs,
          genre, presence, paroles, estChoeur, pupitres,
        });

        // Vérifier si l'œuvre existe déjà dans la base de données
        const existingOeuvre = await Oeuvre.findOne({ titre, anneeComposition });

        if (existingOeuvre) {
          // Si l'œuvre existe, ajouter son ID à la liste des œuvres du concert
          oeuvreIds.push(existingOeuvre._id);
        } else {
          // Si l'œuvre n'existe pas, la créer et ajouter son ID à la liste des œuvres du concert
          const newOeuvre = new Oeuvre({
            titre,
            anneeComposition,
            compositeurs,
            arrangeurs,
            genre,
            presence,
            paroles,
            parties: { estChoeur, pupitres },
          });

          await newOeuvre.save();
          oeuvreIds.push(newOeuvre._id);

          console.log('Liste des IDs des œuvres:', oeuvreIds);
        }
      } catch (error) {
        console.error(`Erreur lors du traitement de la ligne ${rowIndex}:`, error);
      }
    }

    // Créer ou mettre à jour le concert avec la liste d'IDs des œuvres
    const concert = new Concert({
      date,
      lieu,
      choriste,
      programme: oeuvreIds,
    });

    console.log('Enregistrement du concert dans la base de données:', concert);

    await concert.save();

    res.json({ success: true, message: 'Programme ajouté avec succès' });
  } catch (error) {
    console.error('Error reading Excel file:', error);

    if (error.name === 'ValidationError') {
      // Si c'est une erreur de validation, vérifiez si c'est due à la validation personnalisée
      const validationError = error.errors && error.errors.date;

      if (validationError && validationError.kind === 'user defined') {
        // C'est une erreur personnalisée
        return res.status(400).json({ error: 'Ce concert avec la même date et la même liste de choristes existe déjà.' });
      }
    }

    // Si ce n'est pas une erreur de validation personnalisée, retournez une erreur générale
    res.status(500).json({ error: 'Internal Server Error' });
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