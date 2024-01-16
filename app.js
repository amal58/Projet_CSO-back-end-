const express = require ("express")
const app= express()
const mongoose = require('mongoose')
const abprRoutes = require('./routes/absencepresence');



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

  app.use('/api/absencepresence', abprRoutes);

module.exports=app