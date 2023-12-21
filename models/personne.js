const mongoose = require("mongoose");
const Joi = require('joi');
const personneSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  nomJeuneFille: { type: String },
  sexe: { type: String, enum: ['Homme', 'Femme'], required: true },
  dateNaissance: { type: Date, required: true },
  Nationalite: { type: String, required: true },
  taille: { type: Number, required: true },
  telephone: { type: String, required: true },
  cin: { type: String, required: true },
  situationPro: { type: String, required: true },
  createdAt: { type: Date,default: Date.now },
  role: {
    type: String,
    enum: [ 'choriste', 'candidat'],default:'candidat'},
   
   
});

module.exports = mongoose.model("Personne", personneSchema);


