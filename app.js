const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const mongoose = require('mongoose');


// Connexion à MongoDB
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

// Configuration du moteur de modèle EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour les données JSON et URL-encoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Routes
const repetitionRoutes = require('./routes/repetition');
app.use('/api/repetitions', repetitionRoutes);

module.exports = app;
