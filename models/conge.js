const mongoose = require("mongoose");
const Joi = require("joi");

const congeSchema = new mongoose.Schema({
  dateDebutConge:{ type: Date, required: true },
  dateFinConge: { type: Date, required: true },
  etat: { type: String, enum: ['en attente', 'accepte'], default: 'en attente' },
  choriste: { type: mongoose.Schema.Types.ObjectId, ref: 'Choriste', required: true },
});



module.exports = mongoose.model("Conge", congeSchema);