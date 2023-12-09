const mongoose = require('mongoose');

const repetitionSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    lieu: { type: String, required: true },
    duree: { type: Number } // Durée de la répétition en heures, par exemple
  });
  
  module.exports = mongoose.model('Repetition', repetitionSchema);
