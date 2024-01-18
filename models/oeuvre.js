const mongoose = require("mongoose");

const PupitreEnum = ["Soprano", "Alto", "Ténor", "Basse"];
const validateChoeur = function () {
  return this.estChoeur === true && this.pupitres.length > 0;
};
const validateAnneeComposition = function (value) {
  return value >= 0;
};

const validatePupitres = function (pupitres) {
  return pupitres.every((pupitre) => PupitreEnum.includes(pupitre));
};

const validateGenres = function (genres) {
  const allowedGenres = ["Symphonie chorale", "Classique", "Jazz", "Opéra", "Choral", "Rock"];
  return genres.every((genre) => allowedGenres.includes(genre));
};

const PartieSchema = mongoose.Schema({
  estChoeur: { type: Boolean, default: false },
  pupitres: {
    type: [{ type: String, enum: PupitreEnum }],
    validate: [
      {
        validator: function() {
          return !this.estChoeur || (this.estChoeur && this.pupitres.length > 0);
        },
        message: "Un choeur doit avoir au moins un pupitre spécifié.",
      },
      { validator: validatePupitres, message: "Chaque pupitre doit être l'un des 'Soprano', 'Alto', 'Ténor', 'Basse'." },
    ],
  },
});

const OeuvreSchema = mongoose.Schema({
  titre: { type: String, required: true },
  anneeComposition: { type: Number, required: true ,validate: [validateAnneeComposition, "L'année de composition doit être positive."],},
  compositeurs: {
    type: [{
      type: String,
      trim: true, 
    }],
    required: true,
    validate: {
      validator: function (value) {
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
  parties: [PartieSchema], 
});

module.exports = mongoose.model("Oeuvre", OeuvreSchema);


