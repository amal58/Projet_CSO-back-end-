const mongoose = require("mongoose");

const repetitionSchema = new mongoose.Schema({
  heureDebut:{type:String, required:true},
  heureFin:{type:String, required:true},
  date :{type:Date, required:true},
  lieu:{type:String, required:true},
  programme: [{ type: mongoose.Schema.Types.ObjectId, ref:'Oeuvre' }],
  concert: { type: mongoose.Schema.Types.ObjectId, ref: 'Concert', required: true },
  choriste:[{type: mongoose.Schema.Types.ObjectId, ref: 'Choriste'}],
  urlQR:{type:String,required:true}, 
});


  module.exports  = mongoose.model("Repetition", repetitionSchema);