const { Repetition,repetitionValidationSchema } = require('../models/repetition');
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