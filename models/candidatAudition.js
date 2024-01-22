const mongoose = require("mongoose");
const Joi = require('joi');

const candASchema = new mongoose.Schema({
  extrait: { type: String, required: true },
  tessiture: {type:String, enum:["base","alto","tenor","soprano"],required:true},
  evaluation: { type: String, enum: ['A', 'B', 'C'], required: true },
  decision: { type: String,enum:['retenu','en attente','non retenu'], default:'non retenu' , required:true},
  remarque: { type: String, required: true },
  audition: { type: mongoose.Schema.Types.ObjectId, ref: 'Audition' , required: true} ,
  ConfirmedEmail: { type:String,enum:['confirmer','infirmer'], default:'infirmer' },

});


const candAudSchemaValidation = Joi.object({
  extrait: Joi.string().required(),
  tessiture: Joi.string().valid('Base', 'Alto', 'Tenor', 'Soprano').required(),
  evaluation: Joi.string().valid('A', 'B', 'C').required(),
  decision: Joi.string().valid('retenu', 'non retenu').default('non retenu').required(),
  remarque: Joi.string().required(),
  audition: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(), 
});


module.exports= mongoose.model("CandAud", candASchema);
