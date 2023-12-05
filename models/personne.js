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
    enum: ['manager', 'admin', 'chefChoeur', 'chefPupitre', 'choriste', 'condidat'],
    required: true,
  },
});

const Personne = mongoose.model('Personne', personneSchema);

const choristeSchema = new mongoose.Schema({
  status: { type: String, required: true, enum: ['inactif', 'junior', 'senior', 'veteran', 'eliminer'] },
  typePupitre: { type: String, enum: ['Base', 'Alto', 'Tenor', 'Soprano'], required: true },
});


const Choriste = Personne.discriminator('Choriste', choristeSchema);

module.exports = Choriste;
