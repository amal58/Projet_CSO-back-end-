const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');
const personneRoutes = require('./routes/personne');
const Personne = require('./models/personne');
const auditionRoutes = require('./routes/audition');

const app = express();
// Configurer body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
   
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });
app.use('/api/auditions', auditionRoutes); 
app.use('/api/candidats', personneRoutes);
app.use(express.json());



module.exports = app;
