const mongoose = require("mongoose");
const Joi = require("joi");

const congeSchema = new mongoose.Schema({
  datefin: { type: Date, required: true },
  datedebut: { type: Date, required: true },
  etat: { type: String, enum: ['en attente', 'accepte'], default: 'en attente' },
  choriste: { type: mongoose.Schema.Types.ObjectId, ref: 'Choriste', required: true },
});

// Schéma de validation avec Joi
const congeValidationSchema = Joi.object({
  datefin: Joi.date().required(),
  datedebut: Joi.date().required(),
  etat: Joi.string().valid('en attente', 'accepte').default('en attente'),
  choriste: Joi.string().required(),
});

const Conge = mongoose.model("Conge", congeSchema);
module.exports = { Conge, congeValidationSchema };
