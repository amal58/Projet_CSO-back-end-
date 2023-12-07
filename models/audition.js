const mongoose = require("mongoose");
const auditionSchema = mongoose.Schema({
    date: { type: Date,default: Date.now },
    heureDebut: {type: Date,required: true},
    candidat:{ type: mongoose.Schema.Types.ObjectId,ref: 'personne',required: true, },
  });

  
  module.exports = mongoose.model("Audition", auditionSchema);