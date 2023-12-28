const mongoose = require("mongoose");
const Joi = require("joi");

const absencePresenceSchema = new mongoose.Schema({
  etat: { type: Boolean, default: false },  //  default abs false
  CurrentDate: { type: Date, default: Date.now },
  RaisonAbsence: { type: String },
  RaisonPresenceManuel: { type: String },
  choriste: { type: mongoose.Schema.Types.ObjectId, ref:'Choriste', required: true },
  repetition: { type: mongoose.Schema.Types.ObjectId, ref: 'Repetition' },
  concert: { type: mongoose.Schema.Types.ObjectId, ref: 'Concert' },
  seuilnomine:{type:Number, default:15},
  seuilelimine:{type:Number,default:20},
  
});


// Ajouter une méthode statique pour mettre à jour les seuils
absencePresenceSchema.statics.mettreAJourSeuils = async function (seuilNomine, seuilElimine) {
  // Mettre à jour tous les documents avec les nouveaux seuils
  await this.updateMany({}, { $set: { seuilnomine: seuilNomine, seuilelimine: seuilElimine } });
  // Mettre à jour les valeurs par défaut dans le schéma
  this.schema.path('seuilnomine').default(seuilNomine);
  this.schema.path('seuilelimine').default(seuilElimine);
};



// Joi validation schema
const absenceValidationSchema = Joi.object({
  etat: Joi.boolean().default(false),
  date: Joi.date().default(Date.now),  
  RaisonAbsence: Joi.string(),
  RaisonPresenceManuel: Joi.string(),
  choriste: Joi.string().required(), // Ajoutez la validation pour la propriété "choriste"
  concert: Joi.string().required(), // Ajoutez la validation pour la propriété "concert"

});

const AbsencePresence = mongoose.model("Absence", absencePresenceSchema);  
module.exports = { AbsencePresence, absenceValidationSchema };