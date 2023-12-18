const mongoose = require("mongoose");

  // Définir l'énumération pour les pupitres autorisés
  const PupitreEnum = ["Soprano", "Alto", "Ténor", "Basse"];

  // Valider que la partie est un chœur si des pupitres sont spécifiés
const validateChoeur = function () {
  return this.estChoeur === true && this.pupitres.length > 0;
};

// Valider que l'année de composition est positive
const validateAnneeComposition = function (value) {
  return value >= 0;
};

// Valider que chaque pupitre fait partie de l'énumération autorisée
const validatePupitres = function (pupitres) {
  return pupitres.every((pupitre) => PupitreEnum.includes(pupitre));
};

// Sous-schéma pour représenter une partie de l'œuvre
const PartieSchema = mongoose.Schema({
  estChoeur: { type: Boolean, default: false },
  pupitres: {
    type: [{ type: String, enum: PupitreEnum, required: true }],
    validate: [
      { validator: validateChoeur, message: "Un chœur doit avoir au moins un pupitre spécifié." },
      { validator: validatePupitres, message: "Chaque pupitre doit être l'un des 'Soprano', 'Alto', 'Ténor', 'Basse'." },
    ],
  },
});

// Schéma principal pour l'œuvre musicale
const OeuvreSchema = mongoose.Schema({
  titre: { type: String, required: true },
  anneeComposition: { type: Number, required: true ,validate: [validateAnneeComposition, "L'année de composition doit être positive."],},
  compositeurs: [{ type: String, required: true }],
  arrangeurs: [{ type: String, required: true }],
  genre: { type: String, required: true },
  presence: { type: Boolean, default: false },
  paroles: [{ type: String, required: false }],
  //concertP:[{ type: mongoose.Schema.Types.ObjectId,ref: 'Concert',required: true,}],
  concertP:[{ type: String,required: true,}],
  parties: [PartieSchema], // Utilisation du sous-schéma pour représenter les parties
});

module.exports = mongoose.model("Oeuvre", OeuvreSchema);


