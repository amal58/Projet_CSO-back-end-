const mongoose = require("mongoose");
const choristeSchema = new mongoose.Schema({
    candidatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Personne',
      },
    role:{type:String , enum:['admin' , 'choriste' , 'Manager','chefpupitre','chefchoeur']},
    statutAcutel:{type:String, enum: ['choriste','junior', 'senior', 'veteran', 'inactif']},
    login:{type:String},
    historiqueStatut: [
      {
        saison: { type:Number },
        statut: { type: String, enum: ['choriste','junior', 'senior', 'veteran', 'inactif'] },
        }],
    password:{type:String,required:true},
    confirmationStatus: { type: String, default: 'En attente de confirmation' },
      })

  module.exports = mongoose.model("Choriste",choristeSchema);