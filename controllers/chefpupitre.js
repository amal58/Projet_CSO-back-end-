const Choriste = require("../models/choriste");

const designatePupitreChefs = async (req, res) => {
  try {
    const choristeId = req.params.id;

    // Récupérer le choriste en vérifiant le rôle
    const choriste = await Choriste.findOne({ _id: choristeId });

    if (!choriste) {
      return res.status(404).json({ message: 'Choriste non trouvé' });
    }
    if (choriste.statutAcutel === 'inactif') {
      return res.status(400).json({ message: 'Le compte est inactif. Impossible de faire des modifications.' });
    }
    // Vérifier si le choriste a déjà été désigné comme chef de pupitre
    if (choriste.role === "chefpupitre") {
      return res.status(400).json({
        message: "Le choriste est déja un chef de pupitre.",
      });
    }

    const typepupitreRecherche = choriste.typepupitre;

    // Utilisation de la méthode countDocuments pour compter les chefpupitres avec le typepupitre spécifié
    const count = await Choriste.countDocuments({
      typepupitre: typepupitreRecherche,
      role: 'chefpupitre',
    });

    if (count >= 2) {
      return res.status(400).json({
        message: `Il existe déjà deux chefpupitres pour le typepupitre "${typepupitreRecherche}".`,
      });
    }

    // Mettre à jour le rôle du choriste
    const updatedChoriste = await Choriste.findByIdAndUpdate(
      choristeId,
      { role: 'chefpupitre' },
      { new: true }
    );

    console.log(`Choriste ${choristeId} mis à jour avec le rôle de chefpupitre.`);
    return res.status(200).json(updatedChoriste); // Ajouter une réponse JSON si nécessaire
  } catch (error) {
    console.error('Erreur lors de la désignation du pupitre :', error);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};





module.exports = {
  designatePupitreChefs,
};
