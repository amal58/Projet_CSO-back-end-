const choriste =require("../models/choriste") 

const designatePupitreChefs = async (req, res) => {
    try {
      const { choristeId, pupitreType } = req.body;
  
      // Vérifier si le choriste existe
      const choriste = await Choriste.findById(choristeId);
      if (!choriste) {
        return res.status(404).json({ message: "Choriste not found" });
      }
  
      // Vérifier s'il est déjà chef de pupitre pour deux types de pupitres
      if (
        choriste.chefPupitre &&
        choriste.chefPupitre.length >= 2 &&
        !choriste.chefPupitre.includes(pupitreType)
      ) {
        return res.status(400).json({
          message: "Le choriste ne peut être chef de pupitre que pour deux types de pupitres.",
        });
      }
  
      // Mettre à jour le champ chefPupitre
      await Choriste.findByIdAndUpdate(
        choristeId,
        { $addToSet: { chefPupitre: pupitreType } },
        { new: true }
      );
  
      return res.status(200).json({
        message: `Le choriste a été désigné comme chef de pupitre pour le type ${pupitreType}.`,
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