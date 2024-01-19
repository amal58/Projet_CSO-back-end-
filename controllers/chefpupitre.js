const Choriste = require("../models/choriste");
const Audition=require("../models/audition")
const {CandAud} = require("../models/candidatAudition")
   
// const designatePupitreChefs = async (req, res) => {
//   try {
//     const choristeId = req.params.id;
    
//     const choriste1 = await Choriste.findOne({ _id: choristeId });

//     if (!choriste1) {
//       return res.status(404).json({ message: 'Choriste non trouvé' });
//     }

//     if (choriste1.statutAcutel === 'inactif') {
//       return res.status(400).json({ message: 'Le compte est inactif. Impossible de faire des modifications.' });
//     }

//     if (choriste1.role === "chefpupitre") {
//       return res.status(400).json({
//         message: "Le choriste est déjà un chef de pupitre.",
//       });
//     }

//     const existAudition = await Audition.findOne({ candidat: choriste1.candidatId });
//     console.log("awel console ",existAudition)
//     if (!existAudition) {
//       return res.status(404).json({ message: 'Audition non trouvée' });
//     }

//     console.log("theni console ", existAudition._id);

//     const existaudit = await CandAud.findOne({ audition: existAudition._id });
// console.log("theleth console",existaudit.tessiture)


//     const chefsMemeTessiture = await Choriste.countDocuments({ role: "chefpupitre", tessiture: existaudit.tessiture });
//     console.log("hedhi mtaa nombre kifkif",chefsMemeTessiture)

//     const nombreChefsMemeTessiture = await Choriste.countDocuments({
//       role: "chefpupitre",
//       tessiture: existaudit.tessiture,
//     });
    
//     console.log("Nombre de chefs de pupitre avec la même tessiture :", nombreChefsMemeTessiture);


//     if (chefsMemeTessiture >= 2) {
//       return res.status(400).json({ message: 'Il existe déjà deux chefs de pupitre avec la même tessiture.' });
//     }

//     await Choriste.findByIdAndUpdate(choriste1._id, { role: "chefpupitre" });

//     res.status(200).json({ message: 'Le choriste a été désigné comme chef de pupitre avec succès.', tessiture: existaudit.tessiture });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Erreur interne du serveur' });
//   }
// };


const designatePupitreChefs = async (req, res) => {
  try {
    const choristeId = req.params.id;
    
    const choriste = await Choriste.findOne({ _id: choristeId });

    if (!choriste || choriste.statutAcutel === 'inactif' || choriste.role === "chefpupitre") {
      return res.status(400).json({ message: 'Choriste non valide pour la désignation en tant que chef de pupitre.' });
    }

    const existAudition = await Audition.findOne({ candidat: choriste.candidatId });

    if (!existAudition) {
      return res.status(404).json({ message: 'Audition non trouvée' });
    }

    const existAudit = await CandAud.findOne({ audition: existAudition._id });
   
   const tess = existAudit.tessiture
    const chefsPupitre = await Choriste.find({ role: "chefpupitre" });
 
   let n = 0;
    for (const chef of chefsPupitre) {
    const existAudition1 = await Audition.findOne({ candidat: chef.candidatId });
 
    const existAudit1 = await CandAud.findOne({ audition: existAudition1._id });
 
    if (tess === existAudit1.tessiture) {
       n = n + 1;
      }
     console.log(n);
     }

     console.log("le nombre est: ", n);
    if (n >= 2) {
      return res.status(400).json({ message: 'Il existe déjà deux chefs de pupitre avec la même tessiture.' });
    }

    await Choriste.findByIdAndUpdate(choriste._id, { role: "chefpupitre" });

    res.status(200).json({ message: 'Le choriste a été désigné comme chef de pupitre avec succès.', tessiture: existAudit.tessiture });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};




module.exports = {
  designatePupitreChefs,
};
