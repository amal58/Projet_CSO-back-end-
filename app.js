const express = require("express");
const bodyParser = require('body-parser');  // Importez bodyParser ici
const app = express();
const path = require('path');

// Configuration du moteur de modèle EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

 const repetitionRoutes = require('./routes/repetition');

const mongoose = require('mongoose');
const concertRoutes = require("./routes/concert");
const choristeRoutes=require("./routes/choriste");

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
app.use("/api/concert", concertRoutes);
app.use("/api/choriste",choristeRoutes)

app.use('/api/repetitions', repetitionRoutes);




module.exports = app;