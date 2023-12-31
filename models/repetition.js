const mongoose = require("mongoose");
const Joi = require('joi');
const repetitionSchema = mongoose.Schema({
  heureDebut:{type:String, required:true},
  heureFin:{type:String, required:true},
  date :{type:Date, required:true},
  lieu:{type:String, required:true},
  programme: [{ type: mongoose.Schema.Types.ObjectId, ref:'Oeuvre' }],
  concert: { type: mongoose.Schema.Types.ObjectId, ref: 'Concert', required: true },
  choriste:[{type: mongoose.Schema.Types.ObjectId, ref: 'Choriste', required: true}],
  urlQR:{type:String,required:true}, 
});
const repetitionValidationSchema = Joi.object({
    heureDebut: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).required(),
    heureFin: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).required(),
    date: Joi.date().iso().required(),
    lieu: Joi.string().required(),
    programme: Joi.string().required(),
    urlQR: Joi.string().required(),
  });

const Repetition = mongoose.model("Repetition", repetitionSchema);
module.exports = { Repetition, repetitionValidationSchema };