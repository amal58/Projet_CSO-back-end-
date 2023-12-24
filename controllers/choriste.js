const mongoose = require('mongoose');
const Choriste = require("../models/choriste")

  // Fonction pour ajouter un œuvre avec validation
exports.AjoutChoriste = async (req, res) => {
  try {
    const choriste = new Choriste(req.body);
    await choriste.validate();

    // Save the document to the database
    await choriste.save();

    res.status(201).json({
      model: Choriste,
      message: "Choriste créée !",
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
      console.error("Erreur lors de la création de choriste :", error.message);
      res.status(500).json({
        error: "Erreur lors de la création de choriste",
      });
    }
  }
};



