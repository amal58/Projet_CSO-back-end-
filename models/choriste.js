const mongoose = require("mongoose");
const choristeSchema = mongoose.Schema({
    candidatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CandAud',
        required: true,
      },
    status: { type: String, required: true, enum: ['junior', 'senior', 'veteran', 'eliminer','choriste'] },
    chefpupitre:{type:Boolean, required:true ,default:false},  
    chefchoeur:{type:Boolean,required:true,default:false},
    etatconge: { type:String,enum:['inactif','actif'], default:'actif'},
});
module.exports = mongoose.model("Choriste",choristeSchema);