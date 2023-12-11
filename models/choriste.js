const mongoose = require("mongoose");

const choristeSchema = mongoose.Schema({
    choriste: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Personne',
        required: true,
      },
    status: { type: String, required: true, enum: ['inactif', 'junior', 'senior', 'veteran', 'eliminer'] },
    typePupitre: { type: String, enum: ['Base', 'Alto', 'Tenor', 'Soprano'], required: true },
    chefpupitre:{type:Boolean, required:true},
    chefchoeur:{type:Boolean,required:true},

});
module.exports = mongoose.model("Choriste",choristeSchema);


