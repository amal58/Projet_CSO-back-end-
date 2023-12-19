const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({
  date: { type: Date, required: true , validate: { validator: dateValidator, message: 'La date doit être ultérieure à la date actuelle.' }},
  lieu: { type: String, required: true },
  affiche: { type: String },
  programme: [{ type: mongoose.Schema.Types.ObjectId, ref:'Oeuvre' }],
  // repetition: [{ type: mongoose.Schema.Types.ObjectId, ref:'Repetition' }],  
  choristePC: [
    {
      choriste: { type: mongoose.Schema.Types.ObjectId, ref: 'Choriste' ,required: true },
      presence: { type: Number,enum:[0,1] ,default: 0 ,required: true }, // Nouveau champ pour stocker la présence
    }
  ] 
});

//Validation personnalisée pour vérifier que la date est ultérieure à la date actuelle
function dateValidator(value) {
  const currentDate = new Date();
  return value > currentDate;
}

// Validation personnalisée pour vérifier l'unicité de la date et des choristes
concertSchema.path('date').validate(async function (value) {
  const existingConcert = await this.constructor.findOne({ date: value, choriste: { $in: this.choriste } });
  return !existingConcert;
}, 'Ce concert avec la même date et la même liste de choristes existe déjà.');


module.exports = mongoose.model('Concert', concertSchema);