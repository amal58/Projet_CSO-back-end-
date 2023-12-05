const mongoose = require("mongoose");
const auditionSchema = mongoose.Schema({
    date: { type: Date,default: Date.now },
    heureDebut: {
        type: Date,required: true},
    duree: {  type: Number,required: true},
    candidat:{ type: mongoose.Schema.Types.ObjectId,ref: 'personne',required: true, },
  });

  
  module.exports = mongoose.model("Auditon", auditionSchema);