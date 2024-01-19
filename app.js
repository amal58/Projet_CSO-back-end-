const express = require("express");
const bodyParser = require('body-parser');  
const app = express();
const path = require('path');


const mongoose = require('mongoose');
const ValidMailPRoutes = require('./routes/validerMailPersonne');
const auditionRoutes = require('./routes/audition');
const saisonRoutes = require('./routes/saison');
mongoose.connect('mongodb+srv://p92934700:7RoxD6S97xxp1Dea@cluster0.peomj36.mongodb.net/projetCSO', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((error) => {
  console.error("Error connecting to MongoDB", error);
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/validerMail', ValidMailPRoutes);
app.use('/api/auditions', auditionRoutes); 
app.use('/api/saison', saisonRoutes); 




module.exports = app;