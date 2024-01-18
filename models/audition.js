const mongoose = require("mongoose");
const auditionSchema = new mongoose.Schema({
    date: { type: Date,default: Date.now },
    heureDebut: {type: Date,required: true},
    candidat:{ type: mongoose.Schema.Types.ObjectId,ref: 'Personne',required: true, },
  });

  
<<<<<<< HEAD
  module.exports = mongoose.model("Audition", auditionSchema);
=======
  module.exports = mongoose.model("Audition", auditionSchema);


  
>>>>>>> repetitionCrud
