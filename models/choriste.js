const mongoose = require("mongoose");
const choristeSchema = mongoose.Schema({
    candidatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'personne',
        required: true,
      },
    nominé: { type: Boolean, default: false },
    éliminé: { type: Boolean, default: false },
    raisonÉlimination: { type: String },
    chefpupitre:{type:Boolean, required:true ,default:false},  
    chefchoeur:{type:Boolean,required:true,default:false},
    confirmationStatus: { type: String, default: 'En attente de confirmation' },
    historiqueStatut: [
      {
        saison: { type: String,required:true },
        statut: { type: String, required: true, enum: ['choriste','junior', 'senior', 'veteran', 'inactif'] },
        }],
        compteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'compte',
            required: true,
        },
    
});
module.exports = mongoose.model("Choriste",choristeSchema);