const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({
  date: { type: Date, required: true , validate: { validator: dateValidator, message: 'La date doit être ultérieure à la date actuelle.' }},
  lieu: { type: String, required: true },
  affiche: { type: String },
  programme: [{ type: mongoose.Schema.Types.ObjectId, ref:'Oeuvre' }],
  // repetition: [{ type: mongoose.Schema.Types.ObjectId, ref:'Repetition' }],  
  choristePC: [
    {
      choriste: { type: mongoose.Schema.Types.ObjectId, ref: 'Choriste' ,required: true },
    }
  ] ,
  ListeParticipants: [
    {
      pupitre: String, // Ajoutez le type de pupitre si vous voulez stocker cette information
      participants: [
        {
          nom: String,
          prenom: String,
          tauxPresence: String,
          tauxAbsence: String,
        },
      ],
    },
  ],
});

//Validation personnalisée pour vérifier que la date est ultérieure à la date actuelle
function dateValidator(value) {
  const currentDate = new Date();
  return value > currentDate;
}

concertSchema.path('date').validate(async function (value) {
  // Assurez-vous que this.choristePC est un tableau
  const choristes = Array.isArray(this.choristePC) ? this.choristePC.map(item => item.choriste) : [this.choristePC.choriste];

  const existingConcert = await this.constructor.findOne({ date: value, choristePC: { $in: choristes } });
  return !existingConcert;
}, 'Ce concert avec la même date et la même liste de choristes existe déjà.');

module.exports = mongoose.model('Concert', concertSchema);