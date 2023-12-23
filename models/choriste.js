const mongoose = require("mongoose");
const choristeSchema = new mongoose.Schema({
    candidatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CandAud',
      },
    role:{type:String , enum:['admin' , 'choriste' , 'Manager','chefpupitre','chefchoeur']},
    login:{type:String},
    historiqueStatut: [
      {
        saison: { type:Number,required:true },
        statut: { type: String, required: true, enum: ['choriste','junior', 'senior', 'veteran', 'inactif'] },
        }],
    password:{type:String,required:true},
    confirmationStatus: { type: String, default: 'En attente de confirmation' },
      })

  module.exports = mongoose.model("Choriste",choristeSchema);