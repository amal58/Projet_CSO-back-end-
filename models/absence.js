const mongoose = require("mongoose");
const Joi = require("joi");



const absencePresenceSchema = new mongoose.Schema({
  etat: { type: Boolean, default: false },  // true: présent, false: absent par défaut
  CurrentDate: { type: Date.now},
  RaisonAbsence: { type:String },
  RaisonPresenceManuel: { type:String },
  choriste: { type: mongoose.Schema.Types.ObjectId, ref: 'Choriste', required: true },
  repetition:{ type: mongoose.Schema.Types.ObjectId, ref: 'Repetition'},
  concert:{ type: mongoose.Schema.Types.ObjectId, ref: 'Concert'},
});

// Joi validation schema
const absenceValidationSchema = Joi.object({
  etat: Joi.boolean().default(false),
  RaisonAbsence: Joi.string(),
  RaisonPresenceManuel: Joi.string(),
  choriste: Joi.string().required(), 
});

const Absence = mongoose.model("Absence", absenceSchema);
module.exports = { Absence, absenceValidationSchema };