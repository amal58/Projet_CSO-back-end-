const mongoose = require("mongoose");
const Joi = require("joi");

const absencePresenceSchema = new mongoose.Schema({
  etat: { type: Boolean, default: false },  //  default abs false
  CurrentDate: { type: Date, default: Date.now },
  RaisonAbsence: { type: String },
  RaisonPresenceManuel: { type: String },
  choriste: { type: mongoose.Schema.Types.ObjectId, ref: 'Choriste', required: true },
  repetition: { type: mongoose.Schema.Types.ObjectId, ref: 'Repetition' },
  concert: { type: mongoose.Schema.Types.ObjectId, ref: 'Concert' },
});


module.exports= mongoose.model("Absence", absencePresenceSchema);  
