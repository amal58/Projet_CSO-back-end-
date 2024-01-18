const mongoose = require("mongoose");
const Joi = require('joi');

const candAudSchema = mongoose.Schema({
  extrait: { type: String, required: true },
  tessiture: { type: String,enum:['Base', 'Alto', 'Tenor', 'Soprano'] , required: true },
  evaluation: { type: String, enum: ['A', 'B', 'C'], required: true },
  decision: { type: String,enum:['retenu','non retenu'], default:'non retenu' , required:true},
  remarque: { type: String, required: true },
  audition: { type: mongoose.Schema.Types.ObjectId, ref: 'Audition' , required: true},  
  ConfirmedEmail: { type:String,enum:['confirmer','infirmer'], default:'infirmer' },
});

const candAudSchemaValidation = Joi.object({
  extrait: Joi.string().required(),
  tessiture: Joi.string().valid('Base', 'Alto', 'Tenor', 'Soprano').required(),
  evaluation: Joi.string().valid('A', 'B', 'C').required(),
  decision: Joi.string().valid('retenu', 'non retenu').default('non retenu').required(),
  remarque: Joi.string().required(),
  audition: Joi.required(), 
  ConfirmedEmail:Joi.required()
});



const CandAud = mongoose.model("CandAud", candAudSchema);
module.exports = { CandAud, candAudSchemaValidation };