const mongoose = require('mongoose');
const Oeuvre = require("../models/oeuvre")

  // Fonction pour ajouter un œuvre avec validation
exports.AjoutOeuvre = async (req, res) => {
  try {
    const oeuvre = new Oeuvre(req.body);
    await oeuvre.validate();

    // Save the document to the database
    await oeuvre.save();

    res.status(201).json({
      model: Oeuvre,
      message: "Oeuvre créée !",
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = {};

      // Accumulate validation errors without interrupting execution
      for (const field in error.errors) {
        if (error.errors.hasOwnProperty(field)) {
          validationErrors[field] = error.errors[field].message;
        }
      }

      // Send the accumulated validation errors as part of the response
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
exports.AfficherToutOeuvre = (req, res) => {
    Oeuvre.find()
      .then((Oeuvres) =>
        res.status(200).json({
          model: Oeuvres,
          message: "succès",
        })
      )
      .catch((error) => {
        res.status(400).json({
          error: error.message,
          message: "problème d'extraction",
        });
        
      });
      
  }
exports.AfficheUneOeuvre = (req, res) => {
Oeuvre.findOne({ _id: req.params.id })
  .then((Oeuvre) => {
    if (!Oeuvre) {
      res.status(404).json({
        message: "Oeuvre non trouvé"
      });
      return;
    }

    res.status(200).json({
      model: Oeuvre,
      message: "oeuvre trouvé"
    });
  })
  .catch((error) => {
    res.status(400).json({
      error: error.message,
      message: "Problème",
    });
  });
}
exports.MiseAjourOeuvre= (req, res) => {
    Oeuvre.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
      .then((Oeuvre) => {
        if (!Oeuvre) {
          res.status(404).json({
            message: "Oeuvre non trouvé ",
          });
          return;
        }
        res.status(200).json({
          model: Oeuvre,
          message: "Oeuvre mis a jour",
        });
      })
      .catch((error) =>
        res.status(400).json({
          error: error.message,
          message: "Id format Oeuvre fausse",
        })
      );
  }

exports.SuppOeuvre = async (req, res) => {
    try {
      await Oeuvre.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "oeuvre supprimée" });
    } catch (error) {
      res.status(400).json({ error });
    }
  };



