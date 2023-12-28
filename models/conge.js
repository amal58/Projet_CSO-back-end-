const mongoose = require("mongoose");
const Joi = require("joi");

const congeSchema = new mongoose.Schema({
  dateDebutConge:{ type: Date, required: true },
  dateFinConge: { type: Date, required: true },
  etat: { type: String, enum: ['en attente', 'accepte'], default: 'en attente' },
  choriste: { type: mongoose.Schema.Types.ObjectId, ref: 'Choriste', required: true },
});

// Schéma de validation avec Joi
// const congeValidationSchema = Joi.object({
//   dateDebutConge: Joi.date().required(),
//   dateFinConge: Joi.date().required(),
//   etat: Joi.string().valid('en attente', 'accepte').default('en attente'),
//   choriste: Joi.string().required(), 
// });


module.exports = mongoose.model("Conge", congeSchema);