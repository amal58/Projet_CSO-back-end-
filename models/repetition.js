const mongoose = require("mongoose");

const repetitionSchema = new mongoose.Schema({
  heureDebut:{type:String},
  heureFin:{type:String},
  date :{type:Date},
  lieu:{type:String},
  programme: [{ type: mongoose.Schema.Types.ObjectId, ref:'Oeuvre' }],
  concert: { type: mongoose.Schema.Types.ObjectId, ref: 'Concert'},
  choriste:[{type: mongoose.Schema.Types.ObjectId, ref: 'Choriste'}],
  urlQR:{type:String}, 
});



  module.exports  = mongoose.model("Repetition", repetitionSchema);

