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

// Valider que chaque pupitre fait partie de l'énumération autorisée
const validateGenres = function (genres) {
  const allowedGenres = ["Symphonie chorale", "Classique", "Jazz", "Opéra", "Choral", "Rock"];
  return genres.every((genre) => allowedGenres.includes(genre));
};
// Sous-schéma pour représenter une partie de l'œuvre
const PartieSchema = mongoose.Schema({
  estChoeur: { type: Boolean, default: false },
  pupitres: {
    type: [{ type: String, enum: PupitreEnum }],
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
  compositeurs: {
    type: [{
      type: String,
      trim: true, // Supprime les espaces en début et fin de chaîne
    }],
    required: true,
    validate: {
      validator: function (value) {
        // Assurez-vous que la liste des compositeurs est un tableau non vide
        return Array.isArray(value) && value.length > 0;
      },
      message: 'La liste des compositeurs doit contenir au moins un compositeur.',
    },
  },  
  arrangeurs: {
    type: [{
      type: String,
      trim: true,
    }],
    required: true,
    validate: {
      validator: function (value) {
        // Assurez-vous que la liste des arrangeurs est un tableau non vide
        return Array.isArray(value) && value.length > 0;
      },
      message: 'La liste des arrangeurs doit contenir au moins un arrangeur.',
    },
  },
  genre: {
    type: [{ type: String, enum:  ["Symphonie chorale","Classique","Jazz","Opéra","Choral","Rock"], required: true }],
    validate: {
       validator: validateGenres, message: "le genre doit être l'un des 'Classique','Symphonie chorale','Jazz','Opéra','Choral','Rock'.",
    },
  },
  presence: { type: Boolean, default: false },
  paroles: [{ type: String, required: false }],
  parties: [PartieSchema], // Utilisation du sous-schéma pour représenter les parties
});

module.exports = mongoose.model("Oeuvre", OeuvreSchema);


