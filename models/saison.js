const mongoose = require("mongoose");

const saisonSchema = mongoose.Schema({
    SaisonName: { type: String, required: true },
    dateDebut: { type: Date, default: Date.now, required: true },
    dateFin: { type: Date, required: true },
    Personnes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Personne' }],
    Oeuvres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Oeuvre' }],
    Absences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Absence' }],
    CandAuds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CandAud' }],
    Choristes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Choriste' }],
    Repetitions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Repetition' }],
    PersonneInitiales: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PersonneInitiale' }],
    Conges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conge' }],
    Concerts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Concert' }],
});

module.exports = mongoose.model("Saison", saisonSchema);
