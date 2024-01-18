const mongoose = require("mongoose");

const repetitionSchema = mongoose.Schema({
   heureDebut:{type:String, required:true},
   heureFin:{type:String, required:true},
   date :{type:Date, required:true},
   lieu:{type:String, required:true},
   programme:{type:String,required:true},   
   concert: { type: mongoose.Schema.Types.ObjectId, ref: 'Concert', required: true },
   choristeprep:{type: mongoose.Schema.Types.ObjectId, ref: 'Choriste', required: true},
   urlQR:{type:String,required:true}, 
});

module.exports = mongoose.model('Repetition', repetitionSchema);