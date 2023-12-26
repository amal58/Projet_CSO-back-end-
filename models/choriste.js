const mongoose = require("mongoose");
const choristeSchema = mongoose.Schema({
    candidatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Personne',
        required: true,
      },
      role:{type:String , enum:['admin' , 'choriste' , 'Manager','chefpupitre','chefchoeur']},
      login:{type:String},
      historiqueStatut: [
        {
          saison: { type:Number },
          statut: { type: String, enum: ['junior', 'senior', 'veteran', 'inactif'] },
          }],
      password:{type:String,required:true},
      confirmationStatus: { type: String, default: 'En attente de confirmation' },
});
module.exports = mongoose.model("Choriste",choristeSchema);