const express = require ("express")
const app= express()
const mongoose = require('mongoose')
const candARoutes=require('./routes/candidatAudition')
const auditionRoutes = require('./routes/audition');
const personneRoutes = require('./routes/personne');
const choristeRoutes = require('./routes/choriste');
mongoose
.connect("mongodb://127.0.0.1:27017/data", {
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
  app.use('/api/auditions', auditionRoutes); 
  app.use("/api/cand",candARoutes)
  app.use('/api/candidats', personneRoutes);
  app.use('/api/choriste', choristeRoutes);

module.exports=app