const mongoose = require("mongoose");
const Joi = require("joi");

const absencePresenceSchema = new mongoose.Schema({
  etat: { type: Boolean, default: false },  //  default abs false
  CurrentDate: { type: Date, default: Date.now },
  RaisonAbsence: { type: String },
  RaisonPresenceManuel: { type: String },
  disponibilite: { type: Boolean, default: false },  //  default abs false
  choriste: { type: mongoose.Schema.Types.ObjectId, ref: 'Choriste', required: true },
  repetition: { type: mongoose.Schema.Types.ObjectId, ref: 'Repetition' },
  concert: { type: mongoose.Schema.Types.ObjectId, ref: 'Concert' },
});

const absenceValidationSchema = Joi.object({
  etat: Joi.boolean().default(false),
  date: Joi.date().default(Date.now),  
  RaisonAbsence: Joi.string(),
  RaisonPresenceManuel: Joi.string(),
  choriste: Joi.string().required(),
  repetition: Joi.string(), 
  concert: Joi.string(), 
});

const AbsencePresence = mongoose.model("Absence", absencePresenceSchema);  
module.exports = { AbsencePresence, absenceValidationSchema };

