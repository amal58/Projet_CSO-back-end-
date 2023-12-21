const mongoose = require('mongoose');
const Joi = require('joi');

const concertSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  lieu: { type: String, required: true },
  affiche: { type: String },
  programme: [{ type: mongoose.Schema.Types.ObjectId, ref:'Oeuvre' ,required:true}],
  choriste: [{ type: mongoose.Schema.Types.ObjectId, ref:'Choriste' }],
  
});

const concertSchemaValidation = Joi.object({
  date: Joi.date().required().min('now').message('La date doit être ultérieure à la date actuelle.'),
  lieu: Joi.string().required(),
  affiche: Joi.string(),
  programme: Joi.array().items(Joi.string()).required(),
 // repetition: Joi.array().items(Joi.string()).required(),
  choriste: Joi.array().items(Joi.string()).required(),
});


//Validation pour vérifier l'unicité de la date et des choristes
concertSchema.path('date').validate(async function (value) {
  const existingConcert = await this.constructor.findOne({ date: value, choriste: { $in: this.choriste } });
  return !existingConcert;
}, 'Ce concert avec la même date et la même liste de choristes existe déjà.');


const Concert = mongoose.model("Concert", concertSchema);
module.exports = { Concert, concertSchemaValidation};