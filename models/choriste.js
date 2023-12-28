const { string } = require("joi");
const mongoose = require("mongoose");
const choristeSchema = new mongoose.Schema({
    candidatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CandAud',
      },
    role:{type:String , enum:['admin' , 'choriste' , 'Manager','chefpupitre','chefchoeur']},
    login:{type:String},
    statutAcutel:{type:String, enum: ['choriste','junior', 'senior', 'veteran', 'inactif']},
    typepupitre:{type:String,required:true},
    historiqueStatut: [
      {
        saison: { type:Number,required:true },
        statut: { type: String, enum: ['choriste','junior', 'senior', 'veteran', 'inactif'] },
        }],
    password:{type:String,required:true},
    confirmationStatus: { type: String, default: 'En attente de confirmation' },
    etat:{type:String,enum:['eliminer','nominer']}
      })

  module.exports = mongoose.model("Choriste",choristeSchema);