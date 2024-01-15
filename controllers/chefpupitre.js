const Choriste = require("../models/choriste");
const Audition=require("../models/audition")
const {CandAud} = require("../models/candidatAudition")



// const designatePupitreChefs = async (req, res) => {
//   try {
//     const choristeId = req.params.id;

//     console.log(choristeId) 
//    // Récupérer le choriste en vérifiant le rôle
//     const choriste = await Choriste.findOne({ _id: choristeId });
//    console.log(choriste)
//     if (!choriste) {
//       return res.status(404).json({ message: 'Choriste non trouvé' });
//     }
//     if (choriste.statutAcutel === 'inactif') {
//       return res.status(400).json({ message: 'Le compte est inactif. Impossible de faire des modifications.' });
//     }
//     // Vérifier si le choriste a déjà été désigné comme chef de pupitre
//     if (choriste.role === "chefpupitre") {
//       return res.status(400).json({
//         message: "Le choriste est déja un chef de pupitre.",
//       });
//     }

//     const typepupitreRecherche = choriste.typepupitre;

//     // Utilisation de la méthode countDocuments pour compter les chefpupitres avec le typepupitre spécifié
//     const count = await Choriste.countDocuments({
//       typepupitre: typepupitreRecherche,
//       role: 'chefpupitre',
//     });

//     if (count >= 2) {
//       return res.status(400).json({
//         message: `Il existe déjà deux chefpupitres pour le typepupitre "${typepupitreRecherche}".`,
//       });
//     }

//     // Mettre à jour le rôle du choriste
//     const updatedChoriste = await Choriste.findByIdAndUpdate(
//       choristeId,
//       { role: 'chefpupitre' },
//       { new: true }
//     );

//     console.log(`Choriste ${choristeId} mis à jour avec le rôle de chefpupitre.`);
//     return res.status(200).json({message :`un chef de pupitre est designé pour le type ${typepupitreRecherche}.`}); // Ajouter une réponse JSON si nécessaire
//   } catch (error) {
//     console.error('Erreur lors de la désignation du pupitre :', error);
//     return res.status(500).json({ message: 'Erreur interne du serveur' });
//   }
// };

// const designatePupitreChefs = async (req, res) => {
//   try {
//     const choristeId = req.params.id;
    
//     const choriste1 = await Choriste.findOne({ _id: choristeId });
//    if (!choriste1) {
//        return res.status(404).json({ message: 'Choriste non trouvé' });
//     }
//     if (choriste.statutAcutel === 'inactif') {
//         return res.status(400).json({ message: 'Le compte est inactif. Impossible de faire des modifications.' });
//        }

//        if (choriste.role === "chefpupitre") {
//            return res.status(400).json({
//             message: "Le choriste est déja un chef de pupitre.",
//             });
//         }
      
//     const existAudition = await Audition.findOne({candidat:choriste1.candidatId})
//     console.log("hedhi id ",existAudition._id)

//    const existaudit = await CandAud.findOne({audition:existAudition._id})
//    console.log(existaudit)
//    if(existaudit){
//   const typetest = await CandAud.findOne({ _id:existaudit._id})
//   console.log(typetest.tessiture)
//    }
   




const designatePupitreChefs = async (req, res) => {
  try {
    const choristeId = req.params.id;
    
    const choriste1 = await Choriste.findOne({ _id: choristeId });

    // Vérifier si le choriste existe
    if (!choriste1) {
      return res.status(404).json({ message: 'Choriste non trouvé' });
    }

    // Vérifier si le compte est actif
    if (choriste1.statutAcutel === 'inactif') {
      return res.status(400).json({ message: 'Le compte est inactif. Impossible de faire des modifications.' });
    }

    // Vérifier si le choriste est déjà un chef de pupitre
    if (choriste1.role === "chefpupitre") {
      return res.status(400).json({
        message: "Le choriste est déjà un chef de pupitre.",
      });
    }

    // Trouver l'audition associée au choriste
    const existAudition = await Audition.findOne({ candidat: choriste1.candidatId });

    // Vérifier si l'audition existe
    if (!existAudition) {
      return res.status(404).json({ message: 'Audition non trouvée' });
    }

    console.log("hedhi id ", existAudition._id);

    // Trouver les candidats audition associés à l'audition
    const existaudit = await CandAud.findOne({ audition: existAudition._id });

    // Vérifier s'il existe déjà deux choristes avec la même tessiture
    const chefsMemeTessiture = await Choriste.countDocuments({ role: "chefpupitre", tessiture: existaudit.tessiture });

    if (chefsMemeTessiture >= 2) {
      return res.status(400).json({ message: 'Il existe déjà deux chefs de pupitre avec la même tessiture.' });
    }

    // Modifier le rôle du choriste à chef de pupitre
    await Choriste.findByIdAndUpdate(choriste1._id, { role: "chefpupitre" });

    res.status(200).json({ message: 'Le choriste a été désigné comme chef de pupitre avec succès.', tessiture: existaudit.tessiture });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};


module.exports = {
  designatePupitreChefs,
};
