const mongoose = require("mongoose");

const candASchema = mongoose.Schema({
    extrait:{type:String,required:true},
    evaluation:{type:String,required:true},
    decision:{type:String,required:true},    
    remarque:{type:String,required:true},
    tessiture:{type:String,required:true},
    candidat:{ type: mongoose.Schema.Types.ObjectId, ref:'Candidat'},
   audition:{ type: mongoose.Schema.Types.ObjectId, ref:'Audition'}

  });
module.exports = mongoose.model("CandA", candASchema);

