// concertModel.js
const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  lieu: { type: String, required: true },
  affiche: { type: String, required: true },
  programme: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Oeuvre' }],
  repetition: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Repetition' }],
  choriste: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Choriste' }]

});

module.exports = mongoose.model('Concert', concertSchema);
