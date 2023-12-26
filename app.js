const express = require ("express")
const app= express()

const OeuvreRoutes=require("./routes/oeuvre")
//const personneRoutes = require('./routes/personne');

const mongoose = require('mongoose')

mongoose
.connect('mongodb+srv://p92934700:7RoxD6S97xxp1Dea@cluster0.peomj36.mongodb.net/projetCSO', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

  app.use(express.json())
  app.use("/Oeuvre",OeuvreRoutes)



module.exports=app