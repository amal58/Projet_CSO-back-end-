const express = require ("express")
const app= express()

const OeuvreRoutes=require("./routes/oeuvre")
const personneRoutes = require('./routes/personne');

const mongoose = require('mongoose')

mongoose
.connect("mongodb://127.0.0.1:27017/database", {
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
  app.use('/api/candidats', personneRoutes);



module.exports=app