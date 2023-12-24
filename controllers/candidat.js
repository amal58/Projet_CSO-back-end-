const Personne = require('../models/personne');
const mongoose = require('mongoose');

exports.AjoutCandidat = async (req, res) => {
  try {
      req.body.role = "candidat";
      const newCandidat = new Personne(req.body);
      await newCandidat.save();
      res.status(201).json({
          model: newCandidat,
          message: "Candidat créé !",
      });
  } catch (error) {
      res.status(400).json({
          error: error.message,
          message: "Problème lors de la création du Candidat",
      });
  }
};