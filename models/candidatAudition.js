const mongoose = require("mongoose");


const candASchema = new mongoose.Schema({
    extrait: { type: String, required: true },
    tessiture: {type:String, enum:["base","alto","ténor","seprano"],required:true},
    evaluation: { type: String, enum: ['A', 'B', 'C'], required: true },
    decision: { type: String,enum:['retenu','en attente','non retenu'], default:'non retenu' , required:true},
    remarque: { type: String, required: true },
    audition: { type: mongoose.Schema.Types.ObjectId, ref: 'Audition' , required: true} ,
    ConfirmedEmail: { type:String,enum:['confirmer','infirmer'], default:'infirmer' },
  
  });
  

module.exports = mongoose.model("CandA", candASchema);
