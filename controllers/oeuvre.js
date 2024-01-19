const mongoose = require('mongoose');
const Oeuvre = require("../models/oeuvre")

  
exports.AjoutOeuvre = async (req, res) => {
  try {
    const oeuvre = new Oeuvre(req.body);
    await oeuvre.validate();

    
    await oeuvre.save();

    res.status(201).json({
      model: Oeuvre,
      message: "Oeuvre créée !",
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = {};

      
      for (const field in error.errors) {
        if (error.errors.hasOwnProperty(field)) {
          validationErrors[field] = error.errors[field].message;
        }
      }

    
      res.status(400).json({
        error: "Erreur de validation",
        validationErrors,
      });
    } else {
      console.error("Erreur lors de la création de l'œuvre :", error.message);
      res.status(500).json({
        error: "Erreur lors de la création de l'œuvre",
      });
    }
  }
};
exports.AfficherToutOeuvre = async (req, res) => {
  try {
    const Oeuvres = await Oeuvre.find();
    if (Oeuvres.length === 0) {
     
      res.status(404).json({
        message: "Aucune œuvre trouvée dans la base de données",
      });
      return;
    }

    
    res.status(200).json({
      model: Oeuvres,
      message: "Œuvres récupérées avec succès",
    });
  } catch (error) {

    res.status(500).json({
      error: error.message,
      message: "Problème lors de la récupération des oeuvres",
    });
  }
};
exports.AfficheUneOeuvre = async (req, res) => {
  try {
    const oeuvre = await Oeuvre.findOne({ _id: req.params.id });

    if (!oeuvre) {
      
      res.status(404).json({
        message: "Aucune oeuvre trouvée avec l'ID spécifié",
      });
      return;
    }

  
    res.status(200).json({
      model: oeuvre,
      message: "oeuvre récupérée avec succès",
    });
  } catch (error) {
    // Gestion des erreurs générales
    res.status(500).json({
      error: error.message,
      message: "Problème lors de la récupération de l'oeuvre",
    });
  }
};
exports.MiseAjourOeuvre = async (req, res) => {
  try {
    const oeuvre = await Oeuvre.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    if (!oeuvre) {
      console.log("Oeuvre non trouvée");
      return res.status(404).json({
        message: "Oeuvre non trouvée",
      });
    }

    console.log("Oeuvre mise à jour avec succès");
    res.status(200).json({
      model: oeuvre,
      message: "Oeuvre mise à jour avec succès",
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'oeuvre:', error);
    res.status(400).json({
      error: error.message,
      message: "Erreur lors de la mise à jour de l'oeuvre",
    });
  }
};
exports.SuppOeuvre = async (req, res) => {
  try {
    const result = await Oeuvre.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) {
     
      res.status(404).json({ message: "oeuvre non trouvée" });
      return;
    }
    
    res.status(200).json({ message: "oeuvre supprimée avec succès" });
  } catch (error) {
   
    res.status(500).json({ error: error.message });
  }
};