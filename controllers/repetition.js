const { Repetition,repetitionValidationSchema } = require('../models/repetition');

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

