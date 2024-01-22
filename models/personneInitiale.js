const mongoose = require("mongoose");
const personneInitiale = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
});

module.exports = mongoose.model("PersonneInitiale", personneInitiale);