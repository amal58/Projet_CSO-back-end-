const Oeuvre = require("../models/oeuvre")

exports.AjoutOeuvre = (req, res) => {
    const oeuvre = new Oeuvre(req.body);
    oeuvre.save().then(() =>
      res.status(201).json({
        model: Oeuvre,
        message: "Oeuvre crée !",
      })
    );
  }
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



