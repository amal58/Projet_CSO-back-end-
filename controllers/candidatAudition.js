// const CandA =require("../models/candidatAudition")
const audition = require("../models/audition");
const { CandAud, candAudSchemaValidation} = require('../models/candidatAudition');


const fetchCandAs =(req,res)=>{
  CandAud.find()
    .populate("audition")    
      .then((candAs) =>
        res.status(200).json({
          model: candAs,
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


  
    const getCandAById=(req,res)=>{
    CandAud.findOne({_id:req.params.id})
    .populate("audition")    
    .then((candAs) => {
      if(!candAs){
        res.status(404).json({
          message:"task non trouve"
        })
        return
      }
     res.status(200).json({
      model: candAs,
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
  
 
 

  const addCandA = (req, res) => {
    // Valider les données entrantes avec Joi
    const validationResult = candAudSchemaValidation.validate(req.body);
  
    if (validationResult.error) {
      // Si la validation échoue, renvoyer une réponse avec les détails de l'erreur
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }
  
    // Si la validation réussit, enregistrez les données dans la base de données
    const candA = new CandAud(req.body);
    candA
      .save()
      .then(() =>
        res.status(201).json({
          model: candA,
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
  





const UpdateCandA = (req, res) => {
  // Valider les données entrantes avec Joi
  const validationResult = candAudSchemaValidation.validate(req.body);

  if (validationResult.error) {
    // Si la validation échoue, renvoyer une réponse avec les détails de l'erreur
    return res.status(400).json({ error: validationResult.error.details[0].message });
  }

  CandAud.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((candA) => {
      if (!candA) {
        res.status(404).json({
          message: "candidat audition not found",
        });
        return;
      }

      res.status(200).json({
        model: candA,
        message: "candidat audition updated",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message,
        message: "candidat audition not correct",
      });
    });
};



const DeleteCandA=(req, res) => {
  CandAud.deleteOne({ _id: req.params.id })
      .then(() => 
      res.status(200).json({ message: "candidat audition deleted" }))
      
      .catch((error) => {
        res.status(400).json({
          error: error.message,
          message: "Id candidat audition not correct ",
        });
      });
  }

 module.exports={
    fetchCandAs:fetchCandAs,
    addCandA:addCandA,
    getCandAById:getCandAById,
    UpdateCandA:UpdateCandA,
    DeleteCandA:DeleteCandA
 }