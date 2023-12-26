const mongoose = require('mongoose');
const { AbsencePresence } = require("../models/absencepresence");
const { Auditions } = require("../models/");

const createPresence = async (req, res) => {
  try {

    const presence = new AbsencePresence(req.body);
    const savedAbsence = await presence.save();
    res.status(201).json({
      model: savedAbsence,
      message: 'Presence créée avec succès',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




module.exports = { createPresence };