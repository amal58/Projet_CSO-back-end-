const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({
    date: { type: Date, required: true ,unique: true  },
    lieu: { type: String, required: true },
    affiche: { type: String },
    programme: [{ type: mongoose.Schema.Types.ObjectId, ref:'Oeuvre' }],
    urlQR:{type:String,required:true }, 
     
  });
   

module.exports = mongoose.model('Concert', concertSchema);