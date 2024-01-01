const Choriste=require("../models/choriste")
const Audition=require("../models/audition")
const audition=require("../models/candidatAudition")
const Repetition=require("../models/repetition")
//creation repetition
exports.createRepetition = async (req, res) => {
  try {
    let soprano=[]
    let alto=[]
    let basse=[]
    let tenor=[]
//body
    let sop=req.body.sop
    let al=req.body.al
    let bas=req.body.bas
    let ten=req.body.ten
console.log(ten);
    const exist_choriste = await Choriste.find({role:"choriste"}).populate("candidatId")
    for (let i=0;i<exist_choriste.length;i++){
      const exist_audition= await Audition.findOne({candidat:Choriste.candidatId._id})
      const exist_audCand= await audition.findOne({audition:exist_audition._id})
      if(exist_audCand.tessiture=="base"){
        basse.push({
          candidat:exist_choriste[i]._id,
          tessiture:exist_choriste[i].tessiture,
        })
      }
      if(exist_audCand.tessiture=="ténor"){
        tenor.push({
          candidat:exist_choriste[i]._id,
          tessiture:exist_choriste[i].tessiture,
        })
      }

      if(exist_audCand.tessiture=="seprano"){
        soprano.push({
          candidat:exist_choriste[i]._id,
          tessiture:exist_choriste[i].tessiture,
        })
      }
      if(exist_audCand.tessiture=="alto"){
        alto.push({
          candidat:exist_choriste[i]._id,
          tessiture:exist_choriste[i].tessiture,
        })
      }

const rep= new Repetition({
  heureDebut:req.body.heureDebut,
  heureFin:req.body.heureFin,
  date :req.body.date,
  lieu:req.body.lieu,
  urlQR:req.body.urlQR, 
  Choriste:[]
})

if (ten==undefined ||al==undefined ||bas==undefined|| sop==undefined ){
  for(let i=0;i<exist_choriste.length;i++){
   rep.choriste.push(exist_choriste[i]._id)
  }

}else {
  
 const tab= alto.sort(() => Math.random() - 0.5).slice(0, al);
 const tabb= soprano.sort(() => Math.random() - 0.5).slice(0, sop);
 const tabbb= tenor.sort(() => Math.random() - 0.5).slice(0, ten);
 const tabbbb= basse.sort(() => Math.random() - 0.5).slice(0, bas);

//  for(let i=0;i<exist_choriste.length;i++){
//   rep.choriste.push(exist_choriste[i]._id)
//  }


}





    }
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

