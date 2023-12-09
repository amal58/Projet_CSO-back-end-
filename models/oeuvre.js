const mongoose = require('mongoose');

const oeuvreSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  compositeur: { type: String },
  duree: { type: Number } // Durée de l'œuvre en minutes, par exemple
});

module.exports = mongoose.model('Oeuvre', oeuvreSchema);
