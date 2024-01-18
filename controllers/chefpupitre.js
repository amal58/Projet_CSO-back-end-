const Choriste = require("../models/choriste");
const { CandAud } = require("../models/candidatAudition");

const designatePupitreChefs = async (req, res) => {
  try {
    const choristeId = req.params.id;

    const choriste = await Choriste.findOne({ _id: choristeId });

    if (!choriste) {
      return res.status(404).json({ message: 'Choriste non trouvé' });
    }
    if (choriste.statutAcutel === 'inactif') {
      return res.status(400).json({ message: 'Le compte est inactif. Impossible de faire des modifications.' });
    }
    if (choriste.role === "chefpupitre") {
      return res.status(400).json({
        message: "Le choriste est déja un chef de pupitre.",
      });
    }

    const candidat = await CandAud.findOne({ _id: choriste.candidatId });

    if (!candidat) {
      return res.status(404).json({ message: "Candidat not found" });
    }
   

  const choristesMemeTessiture = [];

  const tessitureCandidat = candidat.tessiture;

  const tousLesChoristes = await Choriste.find();
  
for (const choriste of tousLesChoristes) {
  const candidat2 = await CandAud.findOne({ _id: choriste.candidatId });

  if (candidat2.tessiture === tessitureCandidat) {
    choristesMemeTessiture.push(choriste);
  }
}
  
    const chefsPupitreDansLaListe = choristesMemeTessiture.filter(choriste => choriste.role === 'chefpupitre');
    
    if (chefsPupitreDansLaListe.length >= 2) {
      return res.status(400).json({ message: 'Impossible de mettre à jour le choriste. Il y a déjà deux chefs de pupitre actifs pour ce type de pupitre.' });
    }

    await Choriste.findByIdAndUpdate(
      choristeId,
      { role: "chefpupitre" },
      { new: true }
    );

    return res.status(200).json({
      message: `Le choriste a été désigné comme chef de pupitre pour le type ${candidat.tessiture}.`,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: "Erreur lors de la désignation des chefs de pupitre.",
    });
  }
};

module.exports = {
  designatePupitreChefs,
};
