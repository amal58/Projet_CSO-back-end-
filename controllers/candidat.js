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

exports.AfficheUnCandidat = async (req, res) => {
  try {
      const personne = await Personne.findOne({ _id: req.params.id });
      if (!personne) {
          res.status(404).json({
              message: "Candidat non trouvé"
          });
          return;
      }
      res.status(200).json({
          model: personne,
          message: "Candidat trouvé"
      });
  } catch (error) {
      res.status(400).json({
          error: error.message,
          message: "Problème",
      });
  }
};

exports.MiseAjourCandidat = async (req, res) => {
  try {
      const personne = await Personne.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
      if (!personne) {
          res.status(404).json({
              message: "Candidat non trouvé",
          });
          return;
      }
      res.status(200).json({
          model: personne,
          message: "Candidat mis à jour",
      });
  } catch (error) {
      res.status(400).json({
          error: error.message,
          message: "Id format Candidat fausse",
      });
  }
};

exports.SuppCandidat = async (req, res) => {
  try {
      await Personne.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Candidat supprimé" });
  } catch (error) {
      res.status(400).json({ error });
  }
};
