const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({
  date: { type: Date, required: true , validate: { validator: dateValidator, message: 'La date doit être ultérieure à la date actuelle.' }},
  lieu: { type: String, required: true },
  affiche: { type: String },
  programme: [{ type: mongoose.Schema.Types.ObjectId, ref:'Oeuvre' }],
});

//Validation personnalisée pour vérifier que la date est ultérieure à la date actuelle
function dateValidator(value) {
  const currentDate = new Date();
  return value > currentDate;
}

// Validation personnalisée pour vérifier l'unicité de la date et des choristes
concertSchema.path('date').validate(async function (value) {
  const existingConcert = await this.constructor.findOne({ date: value });
  return !existingConcert;
}, 'Ce concert avec la même date et la même liste de choristes existe déjà.');


module.exports = mongoose.model('Concert', concertSchema);