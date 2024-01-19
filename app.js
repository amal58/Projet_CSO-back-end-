const express = require("express");
const bodyParser = require('body-parser');  
const app = express();
const path = require('path');


const mongoose = require('mongoose');
const choristeRoutes = require('./routes/choriste');
const routePresenceListe = require('./routes/Listepresence')

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
app.use('/api/choriste', choristeRoutes);
app.use("/listePresents",routePresenceListe)



module.exports = app;