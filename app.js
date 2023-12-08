const express = require ("express")
const app= express()
const mongoose = require('mongoose')

const candARoutes=require("./routes/candidatAudition");
const concertRoutes=require("./routes/concert");
const nodemon = require("nodemon");

mongoose
.connect("mongodb://localhost:27017/database", {
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
  app.use("/api/cand",candARoutes)
  app.use("/api/concert",concertRoutes)



module.exports=app