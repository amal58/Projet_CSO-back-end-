const mongoose = require("mongoose");
const Joi = require("joi");



const absenceSchema = new mongoose.Schema({
  etat: { type: Boolean, default: false },  
  CurrentDate: { type: Date, default: Date.now },
  RaisonAbsence: { type:String },
  RaisonPresenceManuel: { type:String },
  choriste: { type: mongoose.Schema.Types.ObjectId, ref: 'Choriste', required: true },
  repetition:{ type: mongoose.Schema.Types.ObjectId, ref: 'Repetition'},
  concert:{ type: mongoose.Schema.Types.ObjectId, ref: 'Concert'},
});


const absenceValidationSchema = Joi.object({
  etat: Joi.boolean().default(false),
  RaisonAbsence: Joi.string().allow(''),
  RaisonPresenceManuel: Joi.string().allow(''),

   
});

const Absence = mongoose.model("Absence", absenceSchema);
module.exports = { Absence, absenceValidationSchema };