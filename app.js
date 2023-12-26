const express = require("express");
const bodyParser = require('body-parser');  // Importez bodyParser ici
const app = express();

const mongoose = require('mongoose');

const addpresenceRoutes = require('./routes/absencepresence');


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



// Utilisez bodyParser ici avant les app.use
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/pr",addpresenceRoutes)




module.exports = app;