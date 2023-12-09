// concertModel.js
const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  lieu: { type: String, required: true },
  affiche: { type: String },
  programme: [{ type: mongoose.Schema.Types.ObjectId, ref:'Oeuvre' }],
  repetition: [{ type: mongoose.Schema.Types.ObjectId, ref:'Repetition' }],
  choriste: [{ type: mongoose.Schema.Types.ObjectId, ref:'Choriste' }]

});
// Validation personnalisée pour vérifier l'unicité de la date et des choristes
concertSchema.path('date').validate(async function (value) {
  const existingConcert = await this.constructor.findOne({ date: value, choriste: { $in: this.choriste } });
  return !existingConcert;
}, 'Ce concert avec la même date et la même liste de choristes existe déjà.');


module.exports = mongoose.model('Concert', concertSchema);
