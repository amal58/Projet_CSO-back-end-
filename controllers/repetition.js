const { Repetition,repetitionValidationSchema } = require('../models/repetition');
const Choriste=require("../models/choriste")
//const Audition=require("../models")
//creation repetition
exports.createRepetition = async (req, res) => {
  try {
    let soprano=[]
    let alto=[]
    let basse=[]
    let tenor=[]

    let sop=req.body.sop
    let al=req.body.al
    let bas=req.body.bas
    let ten=req.body.ten

    const exist_choriste = await Choriste.find({role:"choriste"}).populate("candidatId")
    const exist_audition= await Audition.find()
  
    
  } catch (error) {
    
  }




};














// Nouvelle route pour obtenir tous les repetition d'un concert
// exports.getRepetitionbyconcert=(req, res) => {
//   const concertId = req.params.id;

//   Repetition.findByConcert(concertId)
//     .populate('concert')
//     .then((repetitions) => {
//       res.status(200).json({
//         model: repetitions,
//         message: 'repetitions d concert récupérés avec succès',
//       });
//     })
//     .catch((error) => {
//       res.status(400).json({
//         error: error.message,
//         message: 'Problème lors de la récupération des repetitions d un cocnert',
//       });
//     });
// };

