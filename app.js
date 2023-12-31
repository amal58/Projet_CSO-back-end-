const express = require ("express")
const app= express()
const mongoose = require('mongoose')
const concertRoutes=require("./routes/concert");

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


  app.use("/api/concert",concertRoutes)
module.exports=app