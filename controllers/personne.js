const Personne = require('../models/personne');
const mongoose = require('mongoose');

// Contrôleur pour récupérer la liste de tous les candidats avec pagination
const getAllCandidats = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const candidats = await Personne.paginate({ role: 'candidat' }, options);
    res.json(candidats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getCandidatsBySexe = async (req, res) => {
    try {
      const { sexe } = req.params;
      const { page = 1, limit = 10 } = req.query;
  
      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      };
  
      const candidats = await Personne.paginate({ role: 'candidat', sexe }, options);
      res.json(candidats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
const getCandidatByEmail = async (req, res) => {
    try {
      const { email } = req.params;
      const candidat = await Personne.findOne({ role: 'candidat', email });
      if (!candidat) {
        return res.status(404).json({ message: 'Candidat non trouvé' });
      }
      res.json(candidat);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  const AjoutCandidat = (req, res) => {
    req.body.role = "candidat";
    const newCandidat = new Personne(req.body);
    newCandidat.save()
      .then(() => res.status(201).json({
        model: newCandidat,
        message: "Candidat créé !",
      }))
      .catch((error) => res.status(400).json({
        error: error.message,
        message: "Problème lors de la création du Candidat",
      }));
  };
  
const AfficheUnCandidat = (req, res) => {
Personne.findOne({ _id: req.params.id })
  .then((Personne) => {
    if (!Personne) {
      res.status(404).json({
        message: "Candidat non trouvé"
      });
      return;
    }

    res.status(200).json({
      model: Personne,
      message: "Candidat trouvé"
    });
  })
  .catch((error) => {
    res.status(400).json({
      error: error.message,
      message: "Problème",
    });
  });
}
const MiseAjourCandidat= (req, res) => {
    Personne.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
      .then((Personne) => {
        if (!Personne) {
          res.status(404).json({
            message: "Candidat non trouvé ",
          });
          return;
        }
        res.status(200).json({
          model: Personne,
          message: "Candidat mis a jour",
        });
      })
      .catch((error) =>
        res.status(400).json({
          error: error.message,
          message: "Id format Candidat fausse",
        })
      );
  }

const SuppCandidat = async (req, res) => {
    try {
      await Personne.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Candidat supprimée" });
    } catch (error) {
      res.status(400).json({ error });
    }
  };


module.exports = {
    AjoutCandidat : AjoutCandidat ,
    MiseAjourCandidat : MiseAjourCandidat ,
    AfficheUnCandidat : AfficheUnCandidat ,
    SuppCandidat : SuppCandidat ,
    getAllCandidats :getAllCandidats,
    getCandidatsBySexe : getCandidatsBySexe,
    getCandidatByEmail:getCandidatByEmail,
}