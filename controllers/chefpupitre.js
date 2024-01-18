const Choriste = require("../models/choriste");
const Audition=require("../models/audition")
const {CandAud} = require("../models/candidatAudition")
   
const designatePupitreChefs = async (req, res) => {
  try {
    const choristeId = req.params.id;
    
    const choriste1 = await Choriste.findOne({ _id: choristeId });

    if (!choriste1) {
      return res.status(404).json({ message: 'Choriste non trouvé' });
    }

    if (choriste1.statutAcutel === 'inactif') {
      return res.status(400).json({ message: 'Le compte est inactif. Impossible de faire des modifications.' });
    }

    if (choriste1.role === "chefpupitre") {
      return res.status(400).json({
        message: "Le choriste est déjà un chef de pupitre.",
      });
    }

    const existAudition = await Audition.findOne({ candidat: choriste1.candidatId });

    if (!existAudition) {
      return res.status(404).json({ message: 'Audition non trouvée' });
    }

    console.log("hedhi id ", existAudition._id);

    const existaudit = await CandAud.findOne({ audition: existAudition._id });

    const chefsMemeTessiture = await Choriste.countDocuments({ role: "chefpupitre", tessiture: existaudit.tessiture });

    if (chefsMemeTessiture >= 2) {
      return res.status(400).json({ message: 'Il existe déjà deux chefs de pupitre avec la même tessiture.' });
    }

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
