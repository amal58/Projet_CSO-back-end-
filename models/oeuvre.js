const mongoose = require('mongoose');

const PartieSchema = mongoose.Schema({
  estChoeur: { type: Boolean, default: false },
  pupitres: { type: String, enum:['Soprano', 'Alto', 'Ténor', 'Basse'] },
  });

  const oeuvreSchema = mongoose.Schema({
  titre: { type: String, required: true },
  anneeComposition: { type: Number, required: true },
  compositeurs: {type: String,trim: true,required: true,},  
  arrangeurs: {type:String, required: true,},
  genre: {
  type: [{ type: String, enum:  ["Symphonie chorale","Classique","Jazz","Opéra","Choral","Rock"], required: true }],},
  presence: { type: Boolean, default: false },
  paroles: [{ type: String, required: false }],
  parties: [PartieSchema], // Utilisation du sous-schéma pour représenter les parties
});

module.exports = mongoose.model('Oeuvre', oeuvreSchema);