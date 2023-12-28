const express = require ("express")
const app= express()
const mongoose = require('mongoose')
const nodemon = require("nodemon");

const candARoutes=require("./routes/candidatAudition");
const concertRoutes=require("./routes/concert");
const chefpupitreRoutes=require("./routes/chefpupitre");
const historiqueRoutes=require("./routes/consulterHistorique");
const congeRoutes=require("./routes/conges");
const AbsenceRoutes=require("./routes/resultatAbsence");


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
  app.use("/api/chef",chefpupitreRoutes)
  app.use("/api/historique", historiqueRoutes)
  app.use("/api/conge", congeRoutes)
app.use("/api/absence",AbsenceRoutes)

module.exports=app