const mongoose = require("mongoose");

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
  role: {
    type: String,
    enum: ['manager', 'admin', 'choriste', 'candidat'],
    required: true,
    
  },
});
module.exports = mongoose.model("Personne", personneSchema);


