const mongoose = require("mongoose");


const candASchema = mongoose.Schema({
  extrait: { type: String, required: true },
  tessiture: { type: String, required: true },
  evaluation: { type: String, enum: ['A', 'B', 'C'], required: true },
  decision: { type: String, required: true },
  remarque: { type: String, required: true },
  audition: { type: mongoose.Schema.Types.ObjectId, ref: 'Audition' }  // Assurez-vous que le chemin est correctement défini
});

module.exports = mongoose.model("CandA", candASchema);
