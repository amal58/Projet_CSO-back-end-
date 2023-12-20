const mongoose = require("mongoose");

const compteSchema = mongoose.Schema({

    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'choriste','manager'], default: 'choriste' },
});
compteSchema.methods.toPublic = function () {
    const userObject = this.toObject();
    delete userObject.password; // Supprimer le mot de passe
    return userObject;
};

module.exports = mongoose.model("Compte", compteSchema);