const mongoose = require("mongoose");

// Sous-schéma pour représenter une partie de l'œuvre
const PartieSchema = mongoose.Schema({
  pupitres: [{ type: mongoose.Schema.Types.ObjectId,ref: 'Personne',required: true,}],
});

// Schéma principal pour l'œuvre musicale
const OeuvreSchema = mongoose.Schema({
  titre: { type: String, required: true },
  anneeComposition: { type: Number, required: true },
  compositeurs: [{ type: String, required: true }],
  arrangeurs: [{ type: String, required: true }],
  genre: { type: String, required: true },
  presence: { type: Boolean, default: false },
  paroles: [{ type: String, required: false }],
  concertP:[{ type: mongoose.Schema.Types.ObjectId,ref: 'Concert',required: true,}],
  parties: [PartieSchema], // Utilisation du sous-schéma pour représenter les parties
});

module.exports = mongoose.model("Oeuvre", OeuvreSchema);


