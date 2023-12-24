
const mongoose = require("mongoose");

const notifUrgentSchema = mongoose.Schema({
    content: { type: String, required: true },
    type: { type: String, required: true }, // par exemple, 'changement_horaire', 'changement_lieu'
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'Choriste', required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('notifUrgent', notifUrgentSchema);