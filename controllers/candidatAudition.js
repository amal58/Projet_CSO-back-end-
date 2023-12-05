const CandA=require("../models/candidatAudition")


const fetchCandAs =(req,res)=>{
    CandA.find()
    .populate("Candidat")
    .populate("Audition")    
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
      });}

  const getCandAById=(req,res)=>{
    CandA.findOne({_id:req.params.id})
    .populate("Candidat")
    .populate("Audition")    
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
  
 const addCandA= (req, res) => {
    const candA = new CandA(req.body);
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
  }



//modifier
const UpdateCandA=(req, res) => {
    CandA.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
      .then((candA) => {
        if (!candA) {
          res.status(404).json({
            message: "candidat audition not found ",
          });
          return;
        }
        res.status(200).json({
          model: candA,
          message: "candidat audition updated",
        });
      })
      .catch((error) =>
        res.status(400).json({
          error: error.message,
          message: "candidat audition not correct",
        })
      );
  }


const DeleteCandA=(req, res) => {
    CandA.deleteOne({ _id: req.params.id })
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