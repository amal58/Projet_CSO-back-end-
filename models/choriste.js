const mongoose = require('mongoose');

const choristeSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    voix: { type: String } // Voix du choriste, par exemple (soprano, alto, ténor, basse)
  });
  
   module.exports = mongoose.model('Choriste', choristeSchema);
