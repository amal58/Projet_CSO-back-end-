const { Repetition,repetitionValidationSchema } = require('../models/repetition');
const socketIo = require('socket.io');

//creation repetition
exports.createRepetition = async (req, res) => {
  try {
  
    const { error, value } = repetitionValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const repetition = new Repetition(value);
    const savedRepetition = await repetition.save();
    res.status(201).json({
      model: savedRepetition,
      message: 'repetition créé avec succès',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Nouvelle route pour obtenir tous les repetition d'un concert
exports.getRepetitionbyconcert=(req, res) => {
  const concertId = req.params.id;

  Repetition.findByConcert(concertId)
    .populate('concert')
    .then((repetitions) => {
      res.status(200).json({
        model: repetitions,
        message: 'repetitions d concert récupérés avec succès',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message,
        message: 'Problème lors de la récupération des repetitions d un cocnert',
      });
    });
};

exports.UpdateRepetition = async (req, res) => {
  try {
    const io = req.app.io; // Récupérez io à partir de req.app
    const repetition = await Repetition.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    if (!repetition) {
      console.log("Répétition non trouvée");
      return res.status(404).json({
        message: "Répétition non trouvée",
      });
    }

    // Émettre une notification aux clients connectés
    io.emit('notification', {
      message: `Répétition mise à jour : ${repetition.programme} le ${new Date(repetition.date).toLocaleDateString()}`
    });

    console.log("Répétition mise à jour avec succès");
    res.status(200).json({
      model: repetition,
      message: "Répétition mise à jour avec succès",
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la répétition:', error);
    res.status(400).json({
      error: error.message,
      message: "Erreur lors de la mise à jour de la répétition",
    });
  }
};
