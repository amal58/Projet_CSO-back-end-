const mongoose = require("mongoose");
const Joi = require("joi");

const congeSchema = new mongoose.Schema({
  duree: { type: Number, required: true },
  datedebut: { type: Date, required: true },
  etat: { type: String, enum: ['en attente', 'accepte'], default: 'en attente' },
  candidat: { type: mongoose.Schema.Types.ObjectId, ref: 'Personne', required: true },
  processed: { type: Boolean, default: false },
});

// Schéma de validation avec Joi
const congeValidationSchema = Joi.object({
  duree: Joi.number().required(),
  datedebut: Joi.date().required(),
  etat: Joi.string().valid('en attente', 'accepte').default('en attente'),
  candidat: Joi.string().required(), 
});


const Conge = mongoose.model("Conge", congeSchema);
module.exports = { Conge, congeValidationSchema };

