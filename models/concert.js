const mongoose = require('mongoose');
const Joi = require('joi');

const concertSchema = new mongoose.Schema({
  date: { type: Date, required: true ,unique: true  },
  lieu: { type: String, required: true },
  affiche: { type: String },
  programme: [{ type: mongoose.Schema.Types.ObjectId, ref:'Oeuvre' }],
  urlQR:{type:String,required:true }, 
});

const concertSchemaValidation = Joi.object({
  date: Joi.date().required().min('now').message('La date doit être ultérieure à la date actuelle.'),
  lieu: Joi.string().required(),
  affiche: Joi.string(),
  programme: Joi.array().items(Joi.string()).required(),
  urlQR: Joi.array().items(Joi.string()).required(),
});

concertSchema.path('date').validate({
  validator: async function (value) {
    const existingConcert = await this.constructor.findOne({ date: value, lieu: this.lieu, _id: { $ne: this._id } });
    return !existingConcert;
  },
  message: 'Ce concert avec la même date et lieu existe déjà.',
});


const Concert = mongoose.model("Concert", concertSchema);
module.exports = { Concert, concertSchemaValidation};